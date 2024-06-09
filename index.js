const pokemonNameElement = document.querySelector(".pokemon-name");
const pokemonNumberElement = document.querySelector(".pokemon-number"); 
const pokemonImageElement = document.querySelector(".pokemon-image"); 
const pokemonTypesElement = document.querySelector(".pokemon-types"); 
const pokemonHeightElement = document.querySelector(".pokemon-height"); 
const pokemonWeightElement = document.querySelector(".pokemon-weight"); 
const pokemonCryElement = document.querySelector(".pokemon-cry-audio"); 

const TOTAL_POKEMON = 1025; 

async function searchPokemon() {
    let searchValue = document.querySelector(".search-bar").value.toLowerCase(); 

    if(searchValue === "") {
        return; 
    }

    searchValue = searchValue.trim().replace(" ", "-");

    //pokeAPI requires user to specify male/female (-m/-f) in nidoran's name.
    if(searchValue === "nidoran") {
        if(Math.random() < 0.5) {
            searchValue = searchValue+"-m";
        } else {
            searchValue = searchValue+"-f";
        }
    }

    getPokemonAndUpdateScreen(searchValue); 

}

async function getPokemonAndUpdateScreen(searchValue) {
    const response =  await fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`);
    //console.log("RESPONSE STATUS: " + response.status);

    if(response.status !== 200) {
        pokemonCryElement.setAttribute("src", "audio/Missingno_default_cry.ogg");
        pokemonCryElement.load();

        pokemonNameElement.innerHTML = "MISSINGNO.";
    
        pokemonNumberElement.innerHTML = `No.0`;
    
        pokemonImageElement.setAttribute("src", "images/Missingno_RB_centered.png");
    
        pokemonTypesElement.innerHTML = `TYPE: ???`;
    
        pokemonHeightElement.innerHTML = `HEIGHT: ???`;
    
        pokemonWeightElement.innerHTML = `WEIGHT: ???`;
    } else {
        const responseJSON = await response.json();

        pokemonCryElement.setAttribute("src", responseJSON.cries.latest);
        pokemonCryElement.load(); 
    
        pokemonNameElement.innerHTML = responseJSON.name.toUpperCase();
    
        pokemonNumberElement.innerHTML = `No.${responseJSON.id}`;
    
        pokemonImageElement.setAttribute("src", responseJSON.sprites.front_default);
    
        let typesString = ""; 
        responseJSON.types.forEach((typeObj) => { 
            if(typesString !== "") {
                typesString += ", "; 
            }
            typesString += `${typeObj.type.name.toUpperCase()}`;
        });
        pokemonTypesElement.innerHTML = `TYPE: ${typesString.toUpperCase()}`;
    
        pokemonHeightElement.innerHTML = `HEIGHT: ${responseJSON.height * 10}cm`;
    
        pokemonWeightElement.innerHTML = `WEIGHT: ${responseJSON.weight / 10}kg`;
    }
}


function playPokemonAudio() {
    const audioElement = document.querySelector(".pokemon-cry-audio");
    if(audioElement.getAttribute("src") === "") {
        return; 
    }
    audioElement.load();
    audioElement.volume = 0.2; 
    audioElement.play(); 
}

async function nextPokemon() {
    let newId = 1; 
    if(pokemonNumberElement.innerHTML !== "") {
        newId = parseInt(pokemonNumberElement.innerHTML.split(".")[1]) + 1;
    } 
    getPokemonAndUpdateScreen(newId);
    
}

function prevPokemon() {
    let newId = TOTAL_POKEMON; 
    if(pokemonNumberElement.innerHTML !== "") {
        newId = parseInt(pokemonNumberElement.innerHTML.split(".")[1]) - 1;
        if(newId < 0) {
            newId = TOTAL_POKEMON; 
        }
    }
    getPokemonAndUpdateScreen(newId);
}

function toggleMusic() {
    const audioElement = document.querySelector(".pokemon-center-theme-audio");
    audioElement.volume = 0.2; 
    if(audioElement.paused) {
        audioElement.play(); 
    } else {
        audioElement.pause(); 
    }
}