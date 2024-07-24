import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Card,
	CardContent,
	useMediaQuery,
	CardMedia,
	Grid,
	Divider,
	InputBase
} from '@mui/material';
import { newsDetails } from '../data/newsData';




const News = () => {
	const isNonMobile = useMediaQuery('(min-width:600px)');
	const [news, setNews] = useState(newsDetails);
	const partialNewsData = newsDetails.slice(0, 2);
	const [searchText, setSearchText] = useState('');

	useEffect(()=>{
		if (searchText){
			const filteredNewsArr = news.filter((feed) => (feed?.info.toLowerCase().includes(searchText.toLowerCase())))
			console.log(filteredNewsArr);
			setNews(filteredNewsArr);
		}else{
			setNews(newsDetails);
		}
	}, [searchText])


	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	return (
		<>

			<Box className='my-3'><Typography variant="h4" sx={{ color: '#919191' }}>Pokémon News</Typography></Box>
			<Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} className='cursor-pointer' 
				sx={{'& .MuiPaper-root':{boxShadow:'unset !important'} }}
			>
			{
						partialNewsData.map((feed,index)=>(
						<Grid item xs={12} sm={6} md={6} lg={6} key={index}>
								<Card  sx={{borderRadius:'0px !important'}}>
								<Box className=''
									>
										<CardMedia
											component="img"
											alt="pokemon image"
											height="140"
											image={feed?.url}
											sx={{ width: 'unset' }}
										/>
								</Box>
								<Box 
								className='h-60'
										sx={{ '& .MuiCardContent-root:hover': { backgroundColor:'#F0F0F0'}}}
								>
										<CardContent sx={{
											height: '100%', marginBottom: '8px'
											 }}>
										<Typography  sx={{color:'#ee6b2f',fontSize:'16px',fontFamily:'cursive',fontWeight:'600'}}>{feed.date}</Typography>
											<Typography className='pb-2' sx={{ color: '#919191', fontSize: '14px', fontWeight: '500' }}>{feed.subtitle}</Typography>
											<Typography className="capitalize pb-2" sx={{ color: '#212121', fontSize: '19px', fontFamily: 'serif', fontWeight: '600' }}>{feed.title}</Typography>
											<Typography  variant='h6' sx={{ color:'#919191', fontSize: '14px', fontFamily: '', fontWeight: '500' }}>{feed.info}</Typography>
									</CardContent>
								</Box>
						</Card>
						</Grid>
					))
			}
		</Grid>
			
			
			<Divider sx={{ borderColor: '#30A8D6', borderBottomWidth: '2px',margin:'8px 0px !important' }} />
			<Box  borderRadius='3px' className='flex justify-end items-end my-6'>
				<InputBase
					sx={{ width: isNonMobile?'300px':'100%', background: '#ee6b2f', paddingLeft: '10px', color: '#fff' }}
					placeholder='Search'
					onChange={handleSearchChange}
				/>
			</Box>

			<Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} className='mt-8'
				sx={{ '& .MuiPaper-root': { boxShadow: 'unset !important' } }}
			>
				
						{
								news.map((feed,index)=>(
									<Grid item xs={12} sm={6} md={4} lg={4}  key={index} className='mt-3 cursor-pointer'>
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
											<Box className='h-60' sx={{ '& .MuiCardContent-root:hover': { backgroundColor: '#F0F0F0' } }}>
												<CardContent sx={{ height: '100%', marginBottom: '8px' }}>
													<Typography variant='h6' sx={{ color: '#ee6b2f', fontSize: '16px', fontFamily: 'cursive', fontWeight: '600' }}>{feed.date}</Typography>
													<Typography variant='h6' className='pb-1' sx={{ color: '#919191', fontSize: '14px', fontWeight: '500' }}>{feed.subtitle}</Typography>
													<Typography variant='h6' className='pb-1' sx={{ color: '#212121', fontSize: '17px', fontFamily: 'serif', fontWeight: '500' }}>{feed.title}</Typography>
													<Typography variant='h6' sx={{ color: '#919191', fontSize: '14px', fontFamily: '', fontWeight: '500' }}>{feed.info}</Typography>
												</CardContent>
											</Box>
											</Card>
									</Grid>
								))
						}
			</Grid>
			
		</>
	);
};

export default News;
