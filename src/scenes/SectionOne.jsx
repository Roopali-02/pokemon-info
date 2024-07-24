import React from 'react';
import {
  Box,
  Divider,
  useMediaQuery
} from '@mui/material';
import image1 from '../assets/background1.jpg';

const SectionOne = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  return (
    <Box>
      <Box className={`flex ${isNonMobile ? undefined : 'flex-col'} z-40`}>
      <Box className={`basis-6/12 order-1`}><img src={image1} alt='newImage'></img></Box>
      <Box className={`font-extrabold order-2 font-mono basis-6/12 ml-7 my-auto`}>
        <Box className={`text-rose-600 mb-2 text-6xl`}>Bringing the world</Box>
        <Box className='mb-2 text-6xl text-cyan-700'>together</Box>
        <Box className='text-blue-500 mb-4 text-6xl'>through Pokémon</Box>
        <Box className='text-base font-sans font-medium leading-6'>The world of Pokémon connects people across the globe, beloved by kids, adults, and every Trainer in between! These incredible creatures have crossed borders and language barriers to reach the hearts of millions for over 25 years, bringing people together through the joy of play and discovery.
        </Box>
      </Box>
      </Box>
      <Divider className="py-2"/>
    </Box>
  )
}

export default SectionOne