import React from 'react';
import {Box, Typography} from '@mui/material';
import {constants} from '../constants/index';
import { Link } from 'react-router-dom';

const MoveInfo = () => {
	return (
		<Box>
			<Box className='my-2.5 text-center text-3xl'>{constants.title}</Box>
			<Box className='bg-slate-100 p-3 my-2 font-semibold'>{constants.heading}</Box>
			<Box className="flex gap-3">
				<Box className="basis-4/12 p-3 bg-slate-100">
					<Typography variant='h5' className="pb-2">{constants.leftContainerHeading}</Typography>
					<Box>
						<Box className='pb-2 text-blue-600 font-semibold'><Link to='/moves'>{constants.subHeadingOne}</Link></Box>
						<Typography className='pb-2' sx={{fontWeight:600}}>{constants.subHeadingTwo}</Typography>
						<ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
						{
							Array.from({length:9}).map((el,i)=>(
								<Link to={`/moves/generation/${i + 1}`} key={i} ><li className='pb-2 text-blue-600 font-semibold'>{`Generation ${i + 1}`}</li></Link>
							))
						}
						</ul>
					</Box>
				</Box>
				<Box className="basis-8/12 bg-slate-100 p-3">
					<Typography variant='h5' className="pb-2">{constants.rightContainerHeading}</Typography>
					{constants.moveInfo.map((info,i)=>(
						<Box key={i} className="pb-3 font-semibold text-neutral-500">{info}</Box>
					))}
					<Box></Box>
				</Box>
			</Box>
		</Box>
	)
}

export default MoveInfo