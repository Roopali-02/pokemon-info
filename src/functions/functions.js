import { Box, Popover } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

//Get pokemon type tag colors
const getTagColor =(type)=>{
const pokemonType = type;
let colorCode = '';
  switch (pokemonType){
  case 'normal':
    colorCode = '#aaaa99';
    break;
    case 'fire':
      colorCode = '#ff4422';
      break;
      case 'water':
      colorCode = '#3399ff';
      break;
    case 'electric':
      colorCode = '#ffcc33';
      break;
    case 'grass':
      colorCode = '#77cc55';
      break;
    case 'ice':
      colorCode = '#66ccff';
      break;
    case 'fighting':
      colorCode ='#bb5544';
      break;
    case 'poison':
      colorCode = '#aa5599';
      break;
    case 'ground':
      colorCode = '#ddbb55';
      break;
    case 'flying':
      colorCode = '#8899ff';
      break;
    case 'psychic':
      colorCode = '#ff5599';
      break;
    case 'bug':
      colorCode = '#aabb22';
      break;
    case 'rock':
      colorCode = '#bbaa66';
      break;
    case 'ghost':
      colorCode = '#6666bb';
      break;
    case 'dragon':
      colorCode = '#7766ee';
      break;
    case 'dark':
      colorCode = '#775544';
      break;
    case 'steel':
      colorCode = '#aaaabb';
      break;
    case 'fairy':
    colorCode = '#ee99ee';
      break;
    default:
      colorCode = '#000000';
}
  return colorCode;
}

// Api call to fetch ability related short info
const displayInfo = async (ability)=>{
  const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`);
  const abilityInfo = await response.json();
  const englishEntry = abilityInfo.effect_entries.filter((entry) => entry.language.name === 'en').map((entry) => entry.short_effect);
  return englishEntry[0];
 }

// Format change to display national number
const modifiedId = (id) => {
  const idStr = id.toString();
  return `#${idStr.padStart(4, '0')}`;
};


const displayValues = (pokemon, index, column, anchorEl, setAnchorEl, abilityInfo, setAbilityInfo) => {
  switch (index) {
    case 0:
      return column === 1 ? modifiedId(pokemon?.id) : pokemon?.abilities.map((ability) => (
      <Box key={ability}>
      {ability} 
          <InfoOutlined 

          className='cursor-pointer pl-2'
          onClick={async (event) => {
            setAnchorEl(event.currentTarget);
            const info = await displayInfo(ability);
            setAbilityInfo(info);
          }}
          />
        <Popover 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: { padding: '4px', background:'linear-gradient(to top, #e6b980 0%, #eacda3 100%)',width:'260px' }
            }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          >
          {abilityInfo}
      </Popover>
      </Box>));
    case 1:
      return column === 1 ? pokemon?.species.map(each => each) : pokemon.growthRate;
    case 2:
      return column === 1 ? pokemon?.types.map(type => <Box className='px-1' sx={{ background: getTagColor(type), color:'#fff' }}>{type}</Box>) : pokemon.gender;
    case 3:
      return column === 1 ? `${pokemon?.height / 10} m` : pokemon.shape;
    case 4:
      return column === 1 ? `${pokemon?.weight / 10} kg` : pokemon.eggGroups;
    case 5:
      return column === 1 ? pokemon?.experience : pokemon.eggCycles;
    case 6:
      return column === 1 ? pokemon?.effortValue : pokemon.baseFriendship;
    case 7:
      return column === 1 ? pokemon?.catchRate : pokemon.home;
    case 8:
      return column === 1 ? pokemon?.generation : '';
    default:
      return '';
  }
};

const fetchPokemonSpeciesData = async (pokemonData,isDashboard) => {
  const speciesResponse = await fetch(pokemonData.species.url);
  const speciesData = await speciesResponse.json();
  //Pokemon details in brief
  const speciesType = speciesData.genera.filter(each => each.language.name === 'en').map((each) => each?.genus);
  const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
  const cleanFlavorText = flavorTextEntry
    ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ')
    : 'No description available';

  //Pokemon effort value(EV yield) extraction
  const evYield = pokemonData.stats.filter((stat) => stat.stat.name === 'special-attack').map((each) => each.effort);
  const formattedEffortValue = ` ${evYield} Sp. Atk`

  //pokemon gender calculation
  const genderRate = speciesData.gender_rate;
  const femalePercentage = genderRate >= 0 ? (genderRate / 8) * 100 : 0;
  const malePercentage = genderRate >= 0 ? 100 - femalePercentage : 0;

  return {
    name: pokemonData.name,
    id: pokemonData.id,
    height: pokemonData.height,
    weight: pokemonData.weight,
    types: pokemonData.types.map(typeInfo => typeInfo.type.name),
    imageUrl: isDashboard ? pokemonData.sprites.front_default : pokemonData.sprites.other['official-artwork'].front_default,
    shortDescription: cleanFlavorText,
    statistics: pokemonData.stats,
    species: speciesType,
    abilities: pokemonData.abilities.map(ability => ability.ability.name),
    shape: speciesData.shape.name,
    growthRate: speciesData.growth_rate.name,
    gender: genderRate >= 0 ? `${malePercentage}% Male, ${femalePercentage}% Female` : 'Genderless',
    evolutionUrl: speciesData.evolution_chain.url,
    experience: pokemonData.base_experience,
    eggGroups: speciesData.egg_groups.map((group, index) => index < speciesData.egg_groups.length - 1 ? `${group.name},` : `${group.name}`),
    catchRate: speciesData.capture_rate,
    effortValue: formattedEffortValue,
    eggCycles: speciesData.hatch_counter,
    baseFriendship: speciesData.base_happiness,
    home: speciesData.habitat.name,
    generation: speciesData.generation.name,
    moves: pokemonData.moves
  };
};

//Get all the details related to pokemon(single & multiple pokemon data)
const fetchPokemonDetails = async ({ setIsLoading, setPokemonDetails, name = null }) => {
  const mainUrl = 'https://pokeapi.co/api/v2/pokemon';
  const dashboardUrl = `${mainUrl}/?offset=0&limit=100`;
  const pokemonPageUrl = `${mainUrl}/${name}`;
  try {
    setIsLoading(true);
    const response = await fetch(name ? pokemonPageUrl : dashboardUrl);
    const data = await response.json();
    if (name) {
      let isDashboard = false;
      // Fetch details for a single Pokémon
      const pokemonDetails = await fetchPokemonSpeciesData(data);
      setPokemonDetails(pokemonDetails, isDashboard);
    } else {
      let isDashboard = true;
      // Fetch list of Pokémon
      const pokemonPromises = data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        return await fetchPokemonSpeciesData(pokemonData, isDashboard);
      });

      const pokemonDetailsList = await Promise.all(pokemonPromises);
      setPokemonDetails(pokemonDetailsList);
    }

    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
  }
};


export { getTagColor, fetchPokemonDetails, displayValues, modifiedId } ;


