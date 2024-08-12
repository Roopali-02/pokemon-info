import React, { useState, useEffect } from 'react';
import {
	Box,
	Card,
	CardContent,
	useMediaQuery,
	CardMedia,
	Grid,
	Divider,
	InputBase
} from '@mui/material';
import { newsDetails } from '../data/newsData';
import { constants } from '../constants';

const News = () => {
	const isNonMobile = useMediaQuery('(min-width:600px)');
	const [news, setNews] = useState(newsDetails);
	const partialNewsData = newsDetails.slice(0, 2);
	const [searchText, setSearchText] = useState('');

	useEffect(()=>{
		if (searchText){
			const filteredNewsArr = news.filter((feed) => (feed?.info.toLowerCase().includes(searchText.toLowerCase())))
			setNews(filteredNewsArr);
		}else{
			setNews(newsDetails);
		}
	}, [searchText])

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const cardContent = (feed)=>{
		return(
			<Box 
				className='h-60'
				sx={{ '& .MuiCardContent-root:hover': { backgroundColor: '#F0F0F0' } }}
			>
				<CardContent sx={{height: '100%', marginBottom: '8px'}}>
					<Box className="font-bold font-sans text-sm" sx={{ color: '#ee6b2f' }}>{feed.date}</Box>
					<Box className='pb-2 font-semibold' sx={{ color: '#919191', fontSize: '14px' }}>{feed.subtitle}</Box>
					<Box className="capitalize pb-2 font-bold" sx={{ fontSize: '19px', fontFamily: 'serif' }}>{feed.title}</Box>
					<Box className=' text-neutral-500' sx={{ fontSize: '15px', fontFamily: 'sans-serif' }}>{feed.info}</Box>
				</CardContent>
			</Box>
		)
	}

	return (
		<>
			<Box className='my-3 text-3xl font-semibold text-center'>{constants.mainNewsTitle}</Box>
			<Box className=' mb-3'>
			{
				constants.pokemonNews.map((info,index)=>(
					<Box key={index} className=' text-neutral-500 font-semibold bg-neutral-100 py-2 pl-2  mb-2'>{info}</Box>
				))
			}
			</Box>
			<Grid 
				container 
				direction="row" 
				justifyContent="flex-start" 
				alignItems="flex-start" 
				spacing={2} 
				className='cursor-pointer' 
				sx={{'& .MuiPaper-root':{boxShadow:'unset !important'} }}
			>
			{
				partialNewsData.map((feed,index)=>(
				<Grid item xs={12} sm={6} md={6} lg={6} key={index}>
					<Card  sx={{borderRadius:'0px !important'}}>
						<Box className=''>
								<CardMedia
									component="img"
									alt="pokemon image"
									height="140"
									image={feed?.url}
									sx={{ width: 'unset' }}
								/>
						</Box>
						{cardContent(feed)}
				</Card>
				</Grid>
			))
			}
		</Grid>
			<Divider sx={{ borderColor: '#30A8D6', borderBottomWidth: '2px',margin:'8px 0px !important' }} />
			<Box  borderRadius='3px' className='flex justify-end items-end my-6'>
				<InputBase
					sx={{ width: isNonMobile?'350px':'100%', background: '#ee6b2f', paddingLeft: '10px', color: '#fff' }}
					placeholder='Search'
					onChange={handleSearchChange}
				/>
			</Box>
			<Grid 
				container
				direction="row" 
				justifyContent="flex-start" 
				alignItems="flex-start" 
				spacing={2} 
				className='mt-8'
				sx={{ '& .MuiPaper-root': { boxShadow: 'unset !important' } }}
			>
				{
					news.map((feed,index)=>(
						<Grid item xs={12} sm={6} md={4} lg={4} key={index} className={`mt-3 cursor-pointer`}>
							<Card>
							<Box>
							<CardMedia
								component="img"
								alt="pokemon image"
								height="140"
								image={feed?.url}
								sx={{ width: 'unset' }}
							/>
							</Box>
								{cardContent(feed)}
							</Card>
						</Grid>
					))
				}
			</Grid>
		</>
	);
};

export default News;
