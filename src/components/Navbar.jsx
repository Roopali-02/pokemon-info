import React,{useState} from 'react';
import { Box, MenuItem, Drawer, Button, useMediaQuery } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material'
import user from '../assets/user.png';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [drawerVisible,setDrawerVisible] = useState(false);
  const pages = ['Home', 'Moves','News'];
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const toggleDrawer = ()=>{
    setDrawerVisible(!drawerVisible);
  }

  return (
    <Box className= 'flex justify-between items-center p-3 rounded-tl-lg rounded-tr-lg sticky top-0 z-40'
      backgroundColor='#3a6073'>
        <Box className='flex items-center'>
          <img alt='logo' height='90px' width='90px' src={logo} className='cursor-pointer'/>
          {isNonMobile && pages.map((page,i)=>(
            <Button key={i} sx={{
              color: '#ffffff',m:'0px 2px',fontSize:'16px', '&:hover': {
                color: 'yellow',
                backgroundColor: '#000',
                fontWeight:'bold' 
              },
              fontFamily:'monospace'
            }}>
            <Link to={`${page === 'Home'?'/':page==='Moves'?'/move-info':'/news'}`}>{page}</Link>
            </Button>
          ))}
          {!isNonMobile &&<MenuOutlined className="text-white ml-2" onClick={toggleDrawer}></MenuOutlined>}
          <Drawer
            anchor='left'
            open={drawerVisible}
            onClose={() => setDrawerVisible(false)}
          >
            <Box
              className='w-60 bg-gray-200 text-black h-full font-mono font-xs'
              background= 'linear-gradient(to left, #d3cce3, #e9e4f0);'
              role="presentation"
              onClick={() => setDrawerVisible(false)}
              onKeyDown={() => setDrawerVisible(false)}
            >
              {pages.map((page, i) => (
             <MenuItem key={i} sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px', color:'#2C5364'}}><Link to={`${page === 'Home'?'/':page==='Moves'?'/move-info':'/news'}`}>{page}</Link></MenuItem>
              ))}
            </Box>
          </Drawer>
         </Box>
         <Box>
          <img alt='profile-user' src={user} className='cursor-pointer rounded-full h-11 w-11'/>
         </Box>
      </Box>
  )
}

export default Navbar