import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, useMediaQuery, LinearProgress, Card, CardContent } from '@mui/material';
import { fetchPokemonDetails } from '../functions/functions';

const Pokemon = () => {
	let { name } = useParams();
	const isNonMobile = useMediaQuery('(min-width:600px)');
	const [pokemon, setPokemon] = useState(null);
	const [details,setDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	

	useEffect(() => {
		fetchPokemonDetails({ setIsLoading, setPokemonDetails: setPokemon, name });
	}, [name]);

	useEffect(()=>{

		const getSpeciesRelatedData = async()=>{
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon?.id}/`);
			const data = await response.json();
			const onlyEnglishEntries = data?.flavor_text_entries.filter((entry) => entry.language.name === 'en').map((each) => each.flavor_text.replace(/[\n\f]/g, ' '));
			let uniqueValues = [...new Set(onlyEnglishEntries)].slice(0,6);
			setDetails(uniqueValues);
		}
		getSpeciesRelatedData();

	}, [pokemon])

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Box className={`flex ${isNonMobile?'flex-row':'flex-col'} justify-evenly items-start mt-3`}>
			<Box className='flex flex-col basis-2/4 p-2'>
				<Box className='text-black capitalize basis-2/4'><Typography variant="h3">{pokemon.name}</Typography></Box>
				<Box className='basis-2/4'><img alt='pokemon' src={pokemon.imageUrl}></img></Box>
				<Box><Typography variant="h3">Base Stats</Typography></Box>
				<Box>
					{pokemon?.statistics.map((stat)=>(
						<Box className='flex py-2 justify-evenly items-center'><Box className='basis-1/12 text-nowrap capitalize text-base'>{stat.stat.name}</Box><Box className='basis-1/12'>{stat.base_stat}</Box><Box className='basis-10/12'><LinearProgress variant="determinate" sx={{
							backgroundColor: '#d7d2cc',
							'& .MuiLinearProgress-bar': {
								backgroundColor: '#48b1bf'
							},
							height:'8px',
						}} value={stat.base_stat} /></Box></Box>
					))}
				</Box>
				<Box>
				</Box>
			</Box>
			<Box className='basis-2/4 p-2'>
				<Box className='text-black'><Typography variant="h4">Pokédex data</Typography></Box>
				<Box>{details.map((info)=>(
					<Typography className='text-base text-blue-950 font-semibold'>{info}</Typography>
				))}
				</Box>
				<Card className='mt-3' sx={{ maxWidth: '100%', background:'linear-gradient(to right, #4b79a1, #283e51);' }}>
					<CardContent className='p-4'>
					  <Box className='flex'>
							<Box className='basis-2/4 text-white text-base'>
								<Box className='flex pb-0.5'><Typography>Type:</Typography><Typography>data</Typography></Box>
								<Box className='flex pb-0.5'><Typography>Abilities:</Typography><Typography>data</Typography></Box>
								<Box className='flex pb-0.5'><Typography>Height:</Typography><Typography>data</Typography></Box>
								<Box className='flex pb-0.5'><Typography>Weight:</Typography><Typography>data</Typography></Box>
								<Box className='flex pb-0.5'><Typography>Species:</Typography><Typography>data</Typography></Box>
							</Box>
							<Box className='basis-2/4 text-white text-base'>
								<Box className='flex pb-0.5'><Typography>Growth Rate:</Typography><Typography>Medium Fast</Typography></Box>
								<Box className='flex pb-0.5'><Typography>Gender:</Typography><Typography>Female</Typography></Box>
								<Box className='flex pb-0.5'><Typography>Egg Groups:</Typography><Typography>Bug</Typography></Box>
								<Box className='flex pb-0.5'><Typography>Egg Cycles:</Typography><Typography>15</Typography></Box>
							</Box>
						</Box>
					</CardContent>
				 </Card>
			</Box>
		</Box>
	);
};

export default Pokemon;