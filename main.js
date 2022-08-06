const cardContainer = document.getElementById("card-container");
let buttonText = document.getElementById("showMore");
let moreDiv = document.getElementById("more");
const nameSearch = document.getElementById("poke-name-search");
const dataList = document.getElementById("all-pokemon");
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", removeExistingData)
const randomButton = document.getElementById("show-random");

function showMore () {
    if (moreDiv.style.display === "block") {
        removeExistingData();
        moreDiv.style.display = "none";
        buttonText.innerHTML = "Not sure...? ▼";
    } else {
        moreDiv.style.display = "block";
        buttonText.innerHTML = "I'm done ▲";
    }
}

function removeExistingData (){
    while (cardContainer.firstChild) {
            cardContainer.removeChild(cardContainer.firstChild)
    }
}

  function shuffleList(fullList) {
    fullList.sort(() => Math.random() - 0.5);
}

function fullFetch () {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=1154").then(function (response) {
         return response.json()     
    }).then((result) => {
        const fullList = result.results
        fullListController(fullList)
        return fullList  
    }).catch((error)=>{console.log(error)}) 
}

function makeSearchSuggestions(fullList) {
    for (let i = 0; i < fullList.length; i++) {
        const searchOption = document.createElement("option");
        searchOption.setAttribute("value", fullList[i].name);
        searchOption.innerHTML = fullList[i].name;
        dataList.appendChild(searchOption);
    }
}

function makeSearch (fullList) {
    for (let i = 0; i < fullList.length; i++) {
        if (fullList[i].name === nameSearch.value) {
            found = fullList[i].name;
            fetchSinglePoke(fullList[i].url);
            monHere(fullList);
            return found;
        } else {
            noMonHere();
        }
    }
}

function monHere() {
    removeExistingData();
    moreDiv.style.display = "block";
    buttonText.innerHTML = "I'm done ▲";
}

function noMonHere() {
    removeExistingData();
    moreDiv.style.display = "block";
    buttonText.innerHTML = "I'm done ▲";
    const cardDiv = document.createElement("div");
    cardContainer.appendChild(cardDiv);
    const textDiv = document.createElement("div");
    cardDiv.appendChild(textDiv);
    textDiv.innerHTML = "No 'Mon Home :(";
    const noMonImg = document.createElement("img");
    noMonImg.setAttribute("src", "assets/images/no-mon-home.png", "alt", "Empty PokeBall - there's nobody home.");
    cardDiv.appendChild(noMonImg);
    // cardDiv.innerHTML = "No 'mon here :("

}

function fetchSinglePoke (pokeURL) {
    fetch(pokeURL).then(function (response) {
        return response.json()
    }).then(function (result) {
        let singlePoke = result;
        createCard(singlePoke);
        return singlePoke;
    }).catch((error)=>{console.log(error)})
}

function createCard(singlePoke) {
    const cardDiv = document.createElement("div");
    cardContainer.appendChild(cardDiv);
    cardDiv.setAttribute("style", "text-align: center; font-size: large; font-weight: bold; color: #003a70;");
    const nameDiv = document.createElement("div");
    cardDiv.appendChild(nameDiv);
    nameDiv.innerHTML = singlePoke.name;
    const img = document.createElement("img");
    if (singlePoke.sprites.front_default === null) {
        img.setAttribute("src", "assets/images/sleeping.png", "alt", singlePoke.name)
    } else {
    img.setAttribute("src", singlePoke.sprites.front_default, "alt", singlePoke.name);
    }
    cardDiv.appendChild(img);
}

function takeFive (takeFive) {
    removeExistingData()
    shuffleList(takeFive);
    for (let i = 0; i < 5; i++) {
        let singleURL = takeFive[i].url;
        fetchSinglePokes(singleURL);
    }
}

function fetchSinglePokes (pokeURL) {
    fetch(pokeURL).then(function (response) {
        return response.json()
    }).then(function (result) {
        let singlePokes = result;
        createCard(singlePokes);
        return singlePokes;
    }).catch((error)=>{console.log(error)})
}

function fullListController (fullList) {
   setEventListeners(fullList)
}

function setEventListeners(fullList) {
    randomButton.addEventListener("click", function showFive(){
        takeFive(fullList);
    });
    nameSearch.addEventListener("input", function showSearchSuggestions(){
        makeSearchSuggestions(fullList);
    });
    searchButton.addEventListener("click", function showSearchResults(){
        makeSearch(fullList);
    });
    nameSearch.addEventListener("keypress", function (e){
        if (e.key === 'Enter') {
            makeSearch(fullList);
          }
    });
}

fullFetch();

// function createPokeArray(pokeArray, singlePoke) {
//     pokeArray.push(singlePoke);
//     console.log(pokeArray);
// }



// function extractUrls (fullList){
//     for (let i = 0; i < fullList.length; i++) {
//         fetchSinglePokemon(fullList[i].url)
//     }  
// }

// function fetchSinglePokemon (urlList) {
//     fetch(urlList).then((response) => {
//         return response.json()
//     }).then((result) => {
//         // console.log(result)
//     })
// }