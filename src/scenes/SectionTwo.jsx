import React, { useState, useEffect } from 'react';
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
	Button,
	Skeleton,
	Tooltip
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getTagColor, fetchPokemonDetails } from '../functions/functions';
import emptyData from '../assets/emptyData.jpg';
import { Link } from 'react-router-dom';

const SectionTwo = () => {
	const isNonMobile = useMediaQuery('(min-width:600px)');
	const [pokemonDetails, setPokemonDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

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
					Search for a Pokemon by name
				</Typography>
			</Box>
			<Box display='flex' backgroundColor='#000' borderRadius='3px' className='flex mb-5 p-2'>
				<InputBase
					sx={{ width: isNonMobile ? '550px' : '250px', background: '#000', paddingLeft: '10px', color: '#fff' }}
					placeholder='Search'
					onChange={handleSearchChange}
				/>
				<Search sx={{ color: "#fff", height: 'unset' }} />
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
							<Card sx={{ maxWidth: '100%' }}>
								<Box className='flex justify-center items-center' sx={{ background: 'linear-gradient(to right, #283048, #859398); ' }}>
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
								<Box sx={{ background: 'linear-gradient(to right, #ece9e6, #ffffff); ' }} className='border-1 border-black'>
									<CardContent sx={{ padding: '16px 16px 16px 12px !important', height: '100%', marginBottom: '8px' }}>
										<Typography className='capitalize tracking-wide cursor-pointer !important' sx={{ fontSize: '19px', color: '#DC143C', fontFamily: 'unset', fontWeight: '600' }}>
											<Link to={`/pokemon/${pokemon?.name}`}>
												{pokemon?.name}
										</Link>
										</Typography>
										<Typography sx={{ fontSize: '15px', fontWeight: '500', marginBottom: '12px', color: '#2F4F4F' }}>
											{pokemon?.shortDescription}
										</Typography>
										<Typography className='flex'>
											{pokemon.types.map((type, i) => (
												<Box key={i} sx={{ background: getTagColor(type), fontFamily: 'unset' }} className='text-sm mr-1 px-2.5 py-0.5 font-normal'>
													<Tooltip title='Pokemon Type'>{type}</Tooltip>
												</Box>
											))}
										</Typography>
									</CardContent>
									<CardActions>
										<Button size="small" sx={{ fontWeight: '700' }}>Learn More...</Button>
									</CardActions>
								</Box>
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
