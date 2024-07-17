
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

const fetchPokemonSpeciesData = async (pokemonData,isDashboard) => {
  const speciesResponse = await fetch(pokemonData.species.url);
  const speciesData = await speciesResponse.json();

  const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
  console.log(flavorTextEntry);
  const cleanFlavorText = flavorTextEntry
    ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ')
    : 'No description available';


  return {
    name: pokemonData.name,
    id: pokemonData.id,
    height: pokemonData.height,
    weight: pokemonData.weight,
    types: pokemonData.types.map(typeInfo => typeInfo.type.name),
    imageUrl: isDashboard ? pokemonData.sprites.front_default : pokemonData.sprites.other['official-artwork'].front_default,
    shortDescription: cleanFlavorText,
    statistics: pokemonData.stats,
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
    console.log(data);

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


export { getTagColor, fetchPokemonDetails } ;


