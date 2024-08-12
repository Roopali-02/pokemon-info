import React, { useState, useEffect } from 'react';
import { Box, Tooltip, Skeleton, Button } from '@mui/material';
import {
	useParams,
	Link
} from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { constants } from '../constants/index';
import { getTagColor } from '../functions/functions';
import specialMove from '../assets/move-special.png';
import physicalMove from '../assets/move-physical.png';
import statusMove from '../assets/move-status.png';

const Moves = () => {
	let { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [allMoves, setAllMoves] = useState([]);

	const formatMoveDetails = (moveName, moveData) => ({
		id: moveName,
		move: moveName,
		type: moveData.type?.name,
		category: moveData.damage_class?.name,
		power: moveData.power,
		accuracy: moveData.accuracy,
		point: moveData.pp,
		effect: moveData.effect_entries?.find(entry => entry.language.name === 'en')?.short_effect
	});

	const getMoveId = (url) => {
		const match = url.match(/\/(\d+)\/$/);
		return match ? parseInt(match[1], 10) : null;
	};

	const fetchInBatches = async (urls, batchSize) => {
		const results = [];
		for (let i = 0; i < urls.length; i += batchSize) {
			const batch = urls.slice(i, i + batchSize);
			const batchResults = await Promise.all(batch.map(url => cachedFetch(url)));
			results.push(...batchResults);
		}
		return results;
	};

	const formattedMoves = async (movesArr) => {
		const moveDataUrls = movesArr.map(move => move.moveUrl);
		const moveData = await fetchInBatches(moveDataUrls, 150); // Adjust the batch size as needed
		const finalArr = moveData
			.map((data, index) => formatMoveDetails(movesArr[index].name, data))
			.filter(move => move.id !== '532'); // Filter out move with ID 532
		setAllMoves(finalArr);
		setLoading(false);
		return finalArr;
	};

	const fetchAllMoves = async () => {
		const allMoveUrls = [];
		let url = id ? `https://pokeapi.co/api/v2/generation/${id}/` : `https://pokeapi.co/api/v2/move?offset=0&limit=150`;

		while (url) {
			try {
				const data = await cachedFetch(url);
				if (data) {
					const validMoves = data.results
						.map(move => ({ name: move.name, moveUrl: move.url }))
						.filter(move => {
							const moveId = getMoveId(move.moveUrl);
							return moveId !== 532; // Exclude move with ID 532
						});
					allMoveUrls.push(...validMoves);
					url = data.next; // Update the URL for the next page, if available
				} else {
					url = null; // Exit loop if no more data
				}
			} catch (errors) {
				url = null; // Exit loop on error
			}
		}

		return allMoveUrls;
	};

	useEffect(() => {
		const getData = async () => {
			if (id) {
				try {
					const data = await cachedFetch(`https://pokeapi.co/api/v2/generation/${id}/`);
					if (data) {
						const moves = data.moves
							.map(move => ({
								name: move.name,
								moveUrl: move.url
							}))
							.filter(move => {
								const moveId = getMoveId(move.moveUrl);
								return moveId !== 532; // Exclude move with ID 532
							});
						const detailedMoves = await formattedMoves(moves);
					}
				} catch (error) {
					console.warn(`Error fetching data for Generation ${id}.`);
				}
			} else {
				const allMoveUrls = await fetchAllMoves();
				const detailedMoves = await formattedMoves(allMoveUrls);
			}
		};

		getData();
	}, [id]);

	const cachedFetch = (() => {
		const cache = {};
		return async (url, retries = 3) => {
			if (!cache[url]) {
				try {
					const response = await fetch(url);
					const responseBody = await response.text();

					try {
						const data = JSON.parse(responseBody);
						cache[url] = data;
					} catch (jsonError) {
						if (retries > 0) {
							return await cachedFetch(url, retries - 1);
						}
						throw jsonError;
					}
				} catch (error) {
					if (retries > 0) {
						return await cachedFetch(url, retries - 1);
					}
					throw error;
				}
			}
			return cache[url];
		};
	})();

	const columns = [
		{
			field: 'move',
			headerName: <Box className='font-bold font-sans'>Move</Box>,
			width: 150,
			renderCell: (params) => (
				<Box className='capitalize font-bold text-blue-700 font-sans' sx={{ fontSize: '15px' }}>{params.value}</Box>
			)
		},
		{
			field: 'type',
			headerName: <Box className='font-bold font-sans'>Type</Box>,
			width: 100,
			renderCell: (params) => (
				<Box className='h-full flex items-center'>
					<Box className='flex items-center justify-center h-2/4 px-3 font-semibold' sx={{ backgroundColor: getTagColor(params.value), color: '#fff' }}>{params.value}</Box>
				</Box>
			)
		},
		{
			field: 'category',
			headerName: <Box className='font-bold font-sans'>Category</Box>,
			width: 100,
			renderCell: ({ row: { category } }) => (
				<Box className='flex justify-center items-center h-full'>
					<Tooltip title={`${category === 'physical' ? 'physical' : category === 'special' ? 'special' : 'status'}`}>
						<img src={category === 'physical' ? physicalMove : category === 'special' ? specialMove : statusMove} alt='category' width={30} height={30} />
					</Tooltip>
				</Box>
			)
		},
		{
			field: 'power',
			headerName: <Box className='font-bold font-sans'>Power</Box>,
			align: 'right',
			headerAlign: 'right',
			width: 100,
			renderCell: (params) => (
				<Box className='font-semibold text-neutral-600'>{params.value ? params.value : '---'}</Box>
			)
		},
		{
			field: 'accuracy',
			headerName: <Box className='font-bold font-sans'>Accuracy</Box>,
			align: 'right',
			headerAlign: 'right',
			width: 100,
			renderCell: (params) => (
				<Box className='font-semibold text-neutral-600'>{params.value ? params.value : '---'}</Box>
			)
		},
		{
			field: 'point',
			headerName: <Tooltip title="Power Points"><Box className='font-bold font-sans'>PP</Box></Tooltip>,
			width: 100,
			align: 'right',
			headerAlign: 'right',
			renderCell: (params) => (
				<Box className='font-semibold text-neutral-600'>{params.value ? params.value : '---'}</Box>
			)
		},
		{
			field: 'effect',
			headerName: <Box className='font-bold font-sans'>Effect</Box>,
			flex: 2,
			renderCell: (params) => (
				<Box className='text-neutral-500 font-semibold' sx={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis'
				}} title={params.value ? params.value : '---'}>{params.value ? params.value : '---'}</Box>
			),
		}
	];

	const LoadingOverlay = () => (
		<Box className='flex flex-col p-2' sx={{ gap: 2 }}>
			{Array.from({ length: 15 }).map((_, index) => (
				<Box key={index} className='flex items-center'>
					<Skeleton variant="rectangular" className="w-full" height={25} />
				</Box>
			))}
		</Box>
	);

	return (
		<Box>
			<Box className='my-2 font-semibold text-center text-4xl'>
				{id ? `Pokémon moves from Generation ${id}` : constants.moveListTitle}
			</Box>
			<Box><Link to='/move-info'><Button variant="contained">Back</Button></Link></Box>
			<Box className='bg-slate-100 p-3 my-2 font-semibold text-neutral-500' sx={{ fontSize: '17px' }}>{id ? `${constants.genearationWiseTitle} ${id}.` : constants.allMoveListSubtitle}</Box>
			<Box sx={{ height: loading ? 600 : null, ...constants.dataTableStyles }}>
				<DataGrid
					rows={loading ? [] : allMoves}
					columns={columns}
					loading={loading}
					slots={{ loadingOverlay: LoadingOverlay }}
					slotProps={{
						loadingOverlay: {
							sx: { height: '100%' },
						},
					}}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 20 },
						},
					}}
					pageSizeOptions={[10, 20]}
				/>
			</Box>
		</Box>

	);
};

export default Moves;
