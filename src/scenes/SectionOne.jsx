import React from 'react';
import { constants } from '../constants';
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
      <Box className={`flex ${isNonMobile ? undefined : 'flex-col'} z-40`} sx={{background:"#F9F9F9"}}>
      <Box className={`basis-6/12 order-1`}><img src={image1} alt='newImage'></img></Box>
      <Box className={`font-extrabold order-2 font-mono basis-6/12 ml-7 my-auto`}>
        <Box className={`text-rose-600 mb-2 text-6xl`}>{constants.firstTitle}</Box>
          <Box className='mb-2 text-6xl text-cyan-700'>{constants.secondTitle}</Box>
          <Box className='text-blue-500 mb-4 text-6xl'>{constants.thirdTitle}</Box>
          <Box className='text-base font-sans font-medium leading-6 pr-3'>{constants.dashboardInfo}
        </Box>
      </Box>
      </Box>
      {/* <Divider className="py-2"/> */}
    </Box>
  )
}

export default SectionOne