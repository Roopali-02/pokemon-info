import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';
import SectionOne from './scenes/SectionOne';
import SectionTwo from './scenes/SectionTwo';
import News from './scenes/News';
import Pokemon from './scenes/Pokemon';
import {Container} from '@mui/material';
import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<div className="app">
			<Container maxWidth='lg'>
				<Navbar />
			<Routes>
					<Route path='/' element={<><SectionOne /><SectionTwo /></>}/>
					<Route path='/pokemon/:name' element={<Pokemon />}/>
					<Route path='/news' element={<News />} />
			</Routes>
				<Footer />
			</Container>
		</div>
	);
}

export default App;
