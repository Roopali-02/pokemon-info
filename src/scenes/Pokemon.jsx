import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, useMediaQuery, LinearProgress, Card, CardContent, Skeleton, Tooltip } from '@mui/material';
import { fetchPokemonDetails, displayValues, getTagColor, modifiedId } from '../functions/functions';
import { EastOutlined,ArrowLeftOutlined,ArrowRightOutlined } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import specialMove from '../assets/move-special.png';
import physicalMove from '../assets/move-physical.png';
import statusMove from '../assets/move-status.png';
import { Link } from 'react-router-dom';
import {constants} from '../constants';

const Pokemon = () => {
	let { name } = useParams();
	const isNonMobile = useMediaQuery('(min-width:600px)');
	const isNonMobileTable = useMediaQuery('(min-width:1200px)');
	const [pokemon, setPokemon] = useState(null);
	const [details, setDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [evolutionData, setEvolutionData] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [abilityInfo, setAbilityInfo] = useState('');
	const [moves, setMoves] = useState([]);
	const [resizeKey, setResizeKey] = useState(0); 
	const [newDetails,setNewDetails] = useState([]);

	useEffect(() => {
		const handleResize = () => setResizeKey(prevKey => prevKey + 1);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		fetchPokemonDetails({ setIsLoading, setPokemonDetails: setPokemon, name });
	}, [name]);

	useEffect(()=>{
		fetchPokemonDetails({ setIsLoading, setPokemonDetails: setNewDetails });
	},[])

	const pageOrderData = useMemo(() => {
		const currentPokemon = newDetails.find((each) => each?.id === pokemon?.id);
		const previousPokemon = newDetails.find((each) => each?.id === pokemon?.id - 1);
		const nextPokemon = newDetails.find((each) => each?.id === pokemon?.id + 1);
		return { prev: previousPokemon, next: nextPokemon, current: currentPokemon };
	}, [newDetails,pokemon]);

	const parseEvolutionChain =async (chain) => {
		let evolutions = [];
		let current = chain;
		while (current) {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${current.species.name}`)
			const data = await response.json();
			evolutions.push({
			name: current.species.name,
			url: current.species.url,
			imageUrl: data.sprites.other['official-artwork'].front_default
			});
			current = current.evolves_to[0];
		}
		return evolutions;
	};
	
	useEffect(() => {
		if (pokemon?.id) {
			const getSpeciesRelatedData = async () => {
				setIsLoading(true);
				const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon?.id}/`);
				const data = await response.json();
				const evolutionResponse = await fetch(pokemon.evolutionUrl);
				const evolutionData = await evolutionResponse.json();
				const evolutions = await parseEvolutionChain(evolutionData.chain);
				setEvolutionData(evolutions);
				const onlyEnglishEntries = data?.flavor_text_entries.filter((entry) => entry.language.name === 'en').map((each) => each.flavor_text.replace(/[\n\f]/g, ' '));
				let uniqueValues = [...new Set(onlyEnglishEntries)].slice(0, 6);
				setDetails(uniqueValues);

				//Fetch all the moves
				const movesData = await Promise.all(
					pokemon?.moves.map(async (move) => {
						const moveResponse = await fetch(move.move.url);
						const moveDetails = await moveResponse.json();
						return {
							id: move.move.name,
							move: move.move.name,
							type: moveDetails.type.name,
							category: moveDetails.damage_class.name,
							power: moveDetails.power,
							accuracy: moveDetails.accuracy,
							method: move.version_group_details[0].move_learn_method.name,
							level: move.version_group_details[0].level_learned_at
						};
					})
				);
				setMoves(movesData);
				setIsLoading(false);
			};
			getSpeciesRelatedData();
		}
	}, [pokemon]);

	const categorizedMoves = (moves, type) => {
		return moves.filter((move) => move.method === type);
	};

	const columnTitle = (title)=>{
		return <Box className='font-bold font-sans'>{title}</Box>
	}

	//Moves related Table columns
	const columns = [
		{
			field: 'level', 
			headerName: columnTitle('Level'), 
			width:60,
			headerAlign: 'left',
			align: 'left', 
		},
		{ field: 'move', 
			headerName: columnTitle('Move'), 
			width:140,
			renderCell: (params) => (
				<Box
					sx={{ color:'#2C5364'}}
					className='font-bold capitalize font-sans'
					title={params.value ? params.value : '---'}
				>
					{params.value}
				</Box>
			),
		
		},
		{
			field: 'type', 
			headerName: columnTitle('Type'), 
			width: 90,
			renderCell: (params) => (
				<Box className="h-full flex items-center">
					<Box className='flex items-center justify-center h-2/4 px-3' sx={{ background: getTagColor(params.row.type),color:'#fff' }}>{params.row.type}</Box>
				</Box>
			)
		},

		{ field: 'category', 
			headerName: columnTitle('Category'), 
			width: 100,
			renderCell:({row:{category}})=>(
				<Box className='flex justify-center items-center h-full'>
					<Tooltip title={`${category === 'physical'? 'physical': category === 'special'?'special':'status'}`}>
						<img src={category === 'physical' ? physicalMove : category === 'special' ? specialMove : statusMove} alt='category' width={30} height={30}/>
					</Tooltip>
				</Box>
			)
		},
		{ field: 'power', 
			headerName: columnTitle('Power'),
			width:90,
		  renderCell:({row:{power}})=>{ 
				return <Box className='font-semibold text-neutral-600'>{power?power:'---'}</Box>
			}
		},
		{ field: 'accuracy', 
			headerName: columnTitle('Accuracy'), 
			flex:1,
			renderCell: ({ row: { accuracy } }) => {
				return <Box className='font-semibold text-neutral-600'>{accuracy ? accuracy : '---'}</Box>
			}
		},
	]

	if (isLoading) {
		return (
			<Box className="flex flex-col gap-3 mt-3">
				<Box className="flex gap-2 basis-full">
				<Box className="basis-2/4 h-[380px]"><Skeleton sx={{height:'100%'}} variant="rectangular" /></Box>
				<Box className="basis-2/4 h-[380px]">
				<Skeleton width={160} height={60} variant="text"/>
				{Array.from({length:11}).map((_,i)=>(
					<Skeleton width={'100%'} height={30} variant="text" key={i}/>
				))}
				</Box>
				</Box>
				<Box className="flex gap-2 w-full h-[380px]">
					<Box className="basis-2/4 h-full">	
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton width={'100%'} height={30} variant="text" key={i} />
					))}</Box>
					<Box className="basis-2/4 h-full"><Skeleton sx={{ height: '100%' }} variant="rectangular" /></Box>
				</Box>
			</Box>
		);
	}
	if (!pageOrderData.current) return null;
	return (
			<Box className='bg-slate-50 mt-4'>
			<Box className='flex justify-between items-center'>
				<Box className='capitalize cursor-pointer text-base font-semibold text-blue-500'>
					{pageOrderData.prev && (
						<Link to={`/pokemon/${pageOrderData.prev.name}`}>
							<ArrowLeftOutlined />
							{`${modifiedId(pageOrderData.prev.id)} ${pageOrderData.prev.name}`}
						</Link>
					)}
				</Box>
				<Box className='capitalize cursor-pointer text-base font-semibold text-blue-500'>
					{pageOrderData.next && (
						<Link to={`/pokemon/${pageOrderData.next.name}`}>{`${modifiedId(pageOrderData.next.id)} ${pageOrderData.next.name}`} 
							<ArrowRightOutlined />
						</Link>
					)}
				</Box>
			</Box>
				<Box className={`flex ${isNonMobile ? 'flex-row' : 'flex-col'} justify-evenly items-start mt-6`}>
					<Box className={`flex flex-col basis-2/4 p-0.5`}>
						<Box className="text-black capitalize basis-2/4">
							<Typography variant="h3" className="text-sky-400 p-3 text-center" sx={{ background: '#000' }}>{pokemon?.name}</Typography>
						</Box>
						<Box className="basis-2/4 bg-black">
							<img alt="pokemon" src={pokemon?.imageUrl} />
						</Box>
					<Box className='mt-2' sx={{ background: 'linear-gradient(to top, #dfe9f3 0%, white 65%)' }}>
						<Box className='p-2.5 font-semibold text-3xl'>{constants.baseStatistics}</Box>
						<Box className='p-2.5' >
							{pokemon?.statistics.map((stat, index) => (
								<Box className="flex py-2 items-center" key={stat.stat.name}>
									<Box className="basis-1/3 text-nowrap capitalize font-semibold text-neutral-500" sx={{fontSize:'18px'}}>{index === 0 ? <Tooltip title='Hit Points'>{stat.stat.name}</Tooltip> : stat.stat.name}</Box>
									<Box className="basis-1/12 font-bold">{stat.base_stat}</Box>
									<Box className="basis-3/5">
										<LinearProgress variant="determinate" sx={{
											backgroundColor: '#d7d2cc',
											'& .MuiLinearProgress-bar': {
												backgroundColor: '#a7a6cb',
											},
											height: '8px',
										}}
											 value={stat.base_stat}
										/>
									</Box>
								</Box>
							))}
						</Box>
					</Box>
					</Box>
					<Box className={`basis-2/4 px-2`}>
					<Box className='text-4xl font-semibold'>{constants.pokedexDataTitle}</Box>
						<Box className='my-3'>
							{details.map((info, index) => (
								<Box className=" pb-0.5 font-semibold text-neutral-600" key={index}>{info}</Box>
							))}
						</Box>
						<Card className="mt-6" sx={{ maxWidth: '100%' }}>
							<CardContent className="pb-6" sx={{
								background: 'linear-gradient(to bottom, #dfe9f3 0%, white 65%)'
								 }}>
							<Box className="mb-3"><Typography variant="h5" sx={{ fontWeight: 'bold' }}>{constants.otherInfo}</Typography></Box>
								<Box className="flex border-3 border-blue-300">
									<Box className="basis-2/4 text-base">
										{
											constants.sectionOneParams.map((param, index) => (
												<Box className="flex mb-5 last:mb-0" key={param}><Typography className="basis-2/5 text-nowrap text-neutral-600" sx={{ fontWeight: '600', fontFamily: 'cursive', fontSize: '15px' }}>{param}</Typography><Typography className="flex gap-x-1 basis-3/5 p-0.5 capitalize" sx={{ fontWeight: '600', fontFamily: 'monospace', color: '#1e3c72' }}>{displayValues(pokemon, index, 1, anchorEl, setAnchorEl)}</Typography></Box>
											))
										}
									</Box>
									<Box className="basis-2/4 text-base">
										{
											constants.sectionTwoParams.map((param, index) => (
												<Box className="flex mb-5 last:mb-0" key={param}><Typography className="basis-2/5 text-neutral-600" sx={{ fontWeight: '600', fontFamily: 'cursive', fontSize: '15px' }}>{param}</Typography><Typography className="basis-3/5 capitalize" sx={{ fontWeight: '600', fontFamily: 'monospace', color: '#1e3c72' }}>{displayValues(pokemon, index, 2, anchorEl, setAnchorEl, abilityInfo, setAbilityInfo)}</Typography></Box>
											))
										}
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Box>
				</Box>
				<Box className="my-6">
				<Box className='p-2'>
					<Typography variant='h5' sx={{ fontWeight: 'bold' }}>{constants.evolutionChart}</Typography>
				</Box>
				<Box className='bg-slate-100 px-2 py-3 text-neutral-600 font-semibold'>{constants.briefEvolutionData}</Box>
					<Box className='flex justify-center items-center pb-2' sx={{ background: 'linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)' }}>
						{evolutionData.map((each, index) => (
							<Box className='flex items-center' key={index}>
								<Box className='flex flex-col items-center capitalize'><img src={each?.imageUrl} alt='pokemon' className='w-2/4 h-2/4'></img><Typography variant='h6' sx={{ fontWeight: 'bold' }}>{each?.name}</Typography></Box>
								{index < evolutionData.length - 1 && (
									<Box>
										<EastOutlined />
									</Box>
								)}
							</Box>
						))}
					</Box>
				</Box>
				<Box className='my-6'>
			<Box className='text-3xl font-semibold mb-3'>{constants.moves}</Box>
				<Box key={resizeKey} className={`flex w-full gap-x-2 ${isNonMobileTable ? 'flex-row' : 'flex-col'} mb-3`}>
					<Box className = 'flex flex-col basis-2/4'
					sx = {
						{
							...constants.dataTableStyles
						}
					} >
						<Box className='text-xl font-semibold p-2' sx={{ color: '#fff', background:'linear-gradient(to right, #4b79a1, #283e51)'}}>
						{constants.levelUpMoves}
						</Box>
						<DataGrid
							columns={columns}
							rows={categorizedMoves(moves, 'level-up')}
							initialState={{
								pagination: {
									paginationModel: { page: 0, pageSize: 20 },
								},
							}}
							pageSizeOptions={[10, 20]}
						/>
					</Box>
				<Box 
					className='flex flex-col basis-2/4' 
					sx={{...constants.dataTableStyles}}
				>
						<Box className='text-xl font-semibold p-2 text-white' sx={{background: 'linear-gradient(to right, #4b79a1, #283e51)' }}>
					{constants.technicalMachineMoves}
						</Box>
						<DataGrid
							columns={columns}
							rows={categorizedMoves(moves, 'machine')}
							initialState={{
								pagination: {
									paginationModel: { page: 0, pageSize: 20 },
								},
							}}
							pageSizeOptions={[10, 20]}
						/>
					</Box>
				</Box>
			</Box>
			</Box>
	
	);
};

export default Pokemon;
