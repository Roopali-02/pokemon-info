import React from 'react';
import {Box} from '@mui/material';
import {constants} from '../constants/index';

const Footer = () => {
	return (
		<Box className='flex justify-between items-center text-white mt-5 p-5' sx={{ background:'linear-gradient(to right, #000000, #434343);'}}>
			<Box>{constants.rightsReserved}</Box>
			<Box className='flex cursor-pointer'><Box>{constants.termsAndConditions}</Box><Box className='ml-5'>{constants.privacyPolicy}</Box></Box>
		</Box>
	)
}

export default Footer