/**
 * Create one card from item data.
 */
function createCardElement(item) {
  return `
      <li class="card">
          <img src=${item.image} alt="">
          <div class="card-content">
              <p class="subheader">
                  ${item.subtitle}
              </p>
              <h3 class="header">
                  ${item.title}
              </h3>
          </div>
      </li>
    `;
}

/**
 * Create multiple cards from array of item data.
 */
function createCardElements(data) {
  return data.map(createCardElement).join("");
}

/**
 * Fetch list of pokemon names and urls.
 */
async function fetch150PokemonList() {
  try {
    // Get a list of Pokemon numbered 0-150
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?offset=0&limit=150"
    );
    const data = await response.json();
    return data.results;
    //Error handling
  } catch (error) {
    displayError("Error fetching Pokémon list. Please try again later.");
    console.error("Error fetching Pokémon list:", error);
    return [];
  }
}

/**
 * Fetch details of a pokemon.
 */
async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
    //Error handling
  } catch (error) {
    console.log(error);
  }
}

/**
 * Fetch details of all 150 pokemon.
 */
async function fetch150PokemonDetails() {
  const detailsList = [];
  for (let i = 1; i <= 150; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const data = await fetchPokemonDetails(url);
    if (data) {
      detailsList.push(data);
    }
  }

  return detailsList;
}

/**
 * Option 1
 */
function renderOption1Results(data) {
  const card = createCardElement({
    title: data.name,
    subtitle: data.types.map((type) => type.type.name).join(", "),
    image: data.sprites.other["official-artwork"].front_default,
  });
  document.getElementById("option-1-results").innerHTML = card;
}

async function option1DropdownClickHandler(event) {
  try {
    const select = document.getElementById("dropdown");
    const url = select.options[select.selectedIndex].value;
    const data = await fetchPokemonDetails(url);
    if (data) {
      renderOption1Results(data);
    }
  } catch (error) {
    displayError("Error fetching Pokémon details. Please try again later.");
    console.error("Error fetching Pokémon details:", error);
  }
}

/**
 * Attach an event listener to the submit button for the Option 1 dropdown list.
 */
const option1SubmitButton = document.getElementById("submit-button");
option1SubmitButton.addEventListener("click", option1DropdownClickHandler);

/**
 * Populate the dropdown list with pokemon names and their endpoint urls.
 */
async function renderOption1Dropdown() {
  try {
    const select = document.getElementById("dropdown");
    const list = await fetch150PokemonList();
    if (list) {
      list.forEach((item) => {
        const option = document.createElement("option");
        option.textContent = item.name;
        option.value = item.url;
        select.appendChild(option);
      });
    }
  } catch (error) {
    displayError("Error rendering dropdown options. Please try again later.");
    console.error("Error rendering dropdown options:", error);
  }
}

renderOption1Dropdown();

/**
 * Option 2
 */
async function renderOption2() {
  try {
    // Fetch list of Pokémon
    const pokemonList = await fetchPokemonList();

    // Fetch details for each Pokémon
    const pokemonData = await Promise.all(
      pokemonList.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return response.json();
      })
    );

    // Map the fetched data to card data
    const cardData = pokemonData.map((data) => ({
      title: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      subtitle: data.types.map((type) => type.type.name).join(", "),
    }));

    // Create HTML for the cards
    const cardsHTML = createCardElements(cardData);

    // Render the cards on the web page
    document.getElementById("option-2-results").innerHTML = cardsHTML;
  } catch (error) {
    console.error("Error rendering Pokémon cards:", error);
  }
}

renderOption2();

/**
 * Option 2 Enhanced
 */
async function renderOption2Enhanced() {
  try {
    const data = await fetch150PokemonDetails();
    const cards = createCardElements(
      data.map((item) => ({
        title: item.name,
        image: item.sprites.other["official-artwork"].front_default,
        subtitle: item.types.map((type) => type.type.name).join(", "),
      }))
    );
    document.getElementById("option-2-enhanced-results").innerHTML = cards;
  } catch (error) {
    displayError("Error rendering Pokémon cards. Please try again later.");
    console.error("Error rendering Pokémon cards:", error);
  }
}
renderOption2Enhanced();

/**
 * Option 2 Enhanced: Search bar function.
 */
function searchbarEventHandler() {
  //Get the value of the input field with id="searchbar"
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  //Get all the cards
  const enhancedResults = document.getElementById("option-2-enhanced-results");
  const card = enhancedResults.getElementsByClassName("card");

  for (i = 0; i < card.length; i++) {
    //If the value of the input field is not equal to the name of the pokemon, hide the card
    if (!card[i].innerHTML.toLowerCase().includes(input)) {
      card[i].style.display = "none";
      //If the value of the input field is equal to the name of the pokemon, show the card
    } else {
      card[i].style.display = "block";
    }
  }
}

const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("keyup", searchbarEventHandler);

// Error handling function to display error message
function displayError(message) {
  // Display error message to the user (e.g., in a modal or an alert)
  alert(message);
}
// Ensure DOM content is loaded before executing
document.addEventListener("DOMContentLoaded", async () => {
  // Render Option 1 dropdown
  await renderOption1Dropdown();

  // Attach event listener to Option 1 submit button
  const option1SubmitButton = document.getElementById("submit-button");
  option1SubmitButton.addEventListener("click", option1ButtonClickHandler);

  // Render Option 2 Enhanced
  await renderOption2Enhanced();
});
