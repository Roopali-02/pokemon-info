import React, { useState, useEffect } from 'react';
import {constants} from '../constants';
import {
	Box,
	Typography,
	useMediaQuery,
	InputBase,
	Pagination,
	Card,
	Grid,
	CardMedia,
	CardContent,
	CardActions,
	Skeleton,
	Tooltip
} from '@mui/material';
import { getTagColor, fetchPokemonDetails } from '../functions/functions';
import emptyData from '../assets/emptyData.jpg';
import { Link } from 'react-router-dom';

const SectionTwo = () => {
	const isNonMobile = useMediaQuery('(min-width:600px)');
	const [pokemonDetails, setPokemonDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;

	useEffect(() => {
		fetchPokemonData();
	}, []);
	
	const fetchPokemonData = async () => {
		fetchPokemonDetails({ setIsLoading, setPokemonDetails});
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
		setCurrentPage(1); // Reset to the first page on search
	};

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	const filteredPokemonDetails = pokemonDetails.filter((pokemon) =>
		pokemon.name.toLowerCase().includes(searchText.toLowerCase())
	);

	const paginatedPokemonDetails = filteredPokemonDetails.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<Box>
		<Box className='flex flex-col justify-center items-center mt-5 z-30'>
			<Box className='mb-5'>
				<Typography variant='h4' sx={{ color: '#355C7D', fontWeight: 'bold' }}>
						{constants.searchHeading}
				</Typography>
			</Box>
			<Box display='flex' className='flex justify-center mb-5 p-2 w-full'>
				<InputBase
			
					sx = {
						{
							width: isNonMobile ? '550px' : '100%',
							padding: '8px',
							color: '#000',
							background: '#F9F5F6',
						  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
						}
					}
					placeholder='Search'
					onChange={handleSearchChange}
				/>
				{/* <Search sx={{ color: "#fff", height: 'unset' }} /> */}
			</Box>
			<Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
				{isLoading ? (
					Array.from(new Array(8)).map((_, index) => (
						<Grid item xs={12} sm={6} md={3} key={index}>
							<Card sx={{ maxWidth: '100%' }}>
								<Skeleton variant='rectangular' height={140} />
								<CardContent>
									<Skeleton variant='text' />
									<Skeleton variant='text' width="60%" />
									<Skeleton variant='text' width="60%" />
								</CardContent>
								<CardActions>
									<Skeleton variant='rectangular' width={80} height={32} />
								</CardActions>
							</Card>
						</Grid>
					))
				) : filteredPokemonDetails.length === 0 ? (
					<Box className='mx-auto'><img src={emptyData} alt='NO Data' /></Box>
				) : (
					paginatedPokemonDetails.map((pokemon, index) => (
						<Grid item xs={12} sm={6} md={3} key={index}>
				
							<Card  sx = {{maxWidth: '100%'}}
							>
								<Box className = 'flex justify-center items-center shadow-sm'
								sx = {{
									background: '#F1f1f1'
									}} 
								>
									<Tooltip title={pokemon.name}>
										<CardMedia
											component="img"
											alt="pokemon image"
											height="140"
											image={pokemon?.imageUrl}
											sx={{ width: 'unset' }}
										/>
									</Tooltip>
								</Box>
								<Link to={`/pokemon/${pokemon?.name}`}>
									<Box className='border-1 border-black bg-slate-50 pb-2 shadow' sx={{ 
										background: 'linear-gradient(-225deg, #FFFEFF 0%, #ebedee 100%)',
										}}>
										<CardContent sx={{ padding: '16px 16px 0px 12px !important', height: '100%', marginBottom: '8px' }}>
											<Typography className='capitalize tracking-wide cursor-pointer !important' sx={{ fontSize: '20px', color: '#51829B', fontFamily: 'unset', fontWeight: '600' }}>
												<Link to={`/pokemon/${pokemon?.name}`}>
													{pokemon?.name}
												</Link>
											</Typography>
											<Box className='mb-3 font-semibold text-neutral-500'>{pokemon?.shortDescription}</Box>
											<Box className='flex'>
												{pokemon.types.map((type, i) => (
													<Box key={i} sx={{ background: getTagColor(type),color:'#fff', fontFamily: 'unset' }} className='text-sm mr-1 px-2.5 py-0.5 font-normal'>
														<Tooltip title='Pokemon Type'>{type}</Tooltip>
													</Box>
												))}
											</Box>
										</CardContent>
										<CardActions className='capitalize font-semibold text-blue-600' sx={{paddingLeft:'12px'}}>
											<Box classsName='font-semibold'>{constants.learnMore}</Box>
										</CardActions>
									</Box>
								</Link>
								
							</Card>
						</Grid>
					))
				)}
			</Grid>
		</Box>
			<Box className="flex justify-end">
			{filteredPokemonDetails.length > itemsPerPage && (
				<Pagination
					count={Math.ceil(filteredPokemonDetails.length / itemsPerPage)}
					color="primary"
					size="small"
					page={currentPage}
					onChange={handlePageChange}
					sx={{ marginTop: '20px' }}
				/>
			)}</Box>
		</Box>
	);
};

export default SectionTwo;
