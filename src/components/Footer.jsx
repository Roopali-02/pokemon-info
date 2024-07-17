import React from 'react';
import {Box} from '@mui/material';

const Footer = () => {
	return (
		<Box className='flex justify-between items-center text-white mt-5 p-5' sx={{ background:'linear-gradient(to right, #000000, #434343);'}}>
			<Box>All content & design ©2024 Pokemon, Inc. All rights reserved</Box>
			<Box className='flex cursor-pointer'><Box>Terms & Conditions</Box><Box className='ml-5'>Privacy policy</Box></Box>
		</Box>
	)
}

export default Footer