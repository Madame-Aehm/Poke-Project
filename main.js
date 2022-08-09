const cardContainer = document.getElementById("card-container");
const buttonText = document.getElementById("showFilters");
const hiddenSpan = document.getElementById("hidden-span");
const nameSearch = document.getElementById("poke-name-search");
const dataList = document.getElementById("all-pokemon");
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear");
const randomButton = document.getElementById("show-random");
const ddType1 = document.getElementById("type1");
const ddType2 = document.getElementById("type2");
const ddColour = document.getElementById("colour");
const ddMega = document.getElementById("mega");
const nameSearchArray = [];

function showFilters () {
    if (hiddenSpan.style.display === "inline") {
        hiddenSpan.style.display = "none";
        buttonText.innerHTML = "Show Filters »»»";
    } else {
        hiddenSpan.style.display = "inline";
        buttonText.innerHTML = "««« Hide Filters";
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

function makeSearchSuggestions(list) {
    clearDataList()
    for (let i = 0; i < list.length; i++) {
        const searchOption = document.createElement("option");
        searchOption.setAttribute("value", list[i].name);
        searchOption.innerHTML = list[i].name;
        dataList.appendChild(searchOption);
    }
    console.log(list);
}

function clearDataList() {
    dataList.innerHTML = "";
    console.log("data list cleared");
}

function makeFullSearch (fullList) {
    let found = null;
    for (let i = 0; i < fullList.length; i++) {
        if (fullList[i].name === nameSearch.value) {
            found = "search successful";
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
}

function noMonHere() {
    removeExistingData();
    const cardDiv = document.createElement("div");
    cardContainer.appendChild(cardDiv);
    cardDiv.setAttribute("style", "margin-top: 0.5em; display: flex; flex-direction: column; align-items: center; font-size: large; font-weight: bold;");
    const textDiv = document.createElement("div");
    cardDiv.appendChild(textDiv);
    textDiv.innerHTML = "No 'Mon Home :(";
    const noMonImg = document.createElement("img");
    noMonImg.setAttribute("src", "assets/images/no-mon-home.png", "alt", "Empty PokeBall");
    cardDiv.appendChild(noMonImg);

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
    cardDiv.setAttribute("style", "display: flex; flex-direction: column; margin-bottom: 0.5em; margin-top: 0.5em; border: solid 2px black; border-radius: 6px; font-size: large; font-weight: bold;");
    const nameDiv = document.createElement("div");
    cardDiv.appendChild(nameDiv);
    nameDiv.setAttribute("style", "overflow: hidden; ")
    nameDiv.innerHTML = singlePoke.name;
    nameDiv.setAttribute("style", "display: flex; justify-content: center; padding: 0.2em; color: white; background-color: #fc8485; align-self: stretch; border-top-left-radius: 3px 3px; border-top-right-radius: 3px 3px;")
    const img = document.createElement("img");
    img.setAttribute("style", "width: 100px; align-self:center;") 
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
        fetchSinglePoke(singleURL);
    }
}

function fullListController (fullList) {
   setEventListeners(fullList)
}

function setEventListeners(fullList) {
    nameSearch.addEventListener("click", function() {
        if (ddType1.value) {
            console.log("type1 selected")
        } else {
            makeSearchSuggestions(fullList)
        }
    })
    randomButton.addEventListener("click",() => takeFive(fullList));
    searchButton.addEventListener("click",() => makeFullSearch(fullList));
    nameSearch.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            makeFullSearch(fullList);
          }
    });
}

fullFetch();


//* /////////////////////// add filters /////////////////////////////

function typesFetch() {
    fetch("https://pokeapi.co/api/v2/type/").then((response) => response.json())
    .then((result) => {
        const typesList = result.results
        typesController(typesList)
        return typesList;
    }).catch((error)=>{console.log(error)}) 
}

typesFetch();

function typesController(typesList) {
    ddFillType1(typesList);
    addTypeEL(typesList);
}

function ddFillType1(typesList) {
        for (let i = 0; i < typesList.length; i++) {
            const option = document.createElement("option");
            option.setAttribute("value", typesList[i].name);
            option.innerHTML = typesList[i].name;
            ddType1.appendChild(option);
        }
}

function addTypeEL(typesList) {
    ddType1.addEventListener("change",() => {
        getSingleTypeList();
        ddFillType2(typesList);
    });
}

function getSingleTypeList() {
    if (ddType1.value) {
        let typeURL = ddType1.value;
        fetch(`https://pokeapi.co/api/v2/type/${typeURL}/`).then((response) => response.json())
        .then((result) => {
            const typeList = result.pokemon
            makeCompatibleArray(typeList);
            return typeList;
        }).catch((error)=>{console.log(error)}) 
    }
}

function makeCompatibleArray (typeList) {
    const newArray = [];
    for (let i = 0; i < typeList.length; i++)  {
        newArray.push(typeList[i].pokemon)
    }
    nameSearch.addEventListener("click", function() {
        if (ddType1.value) {
        makeSearchSuggestions(newArray);
        }
    });
    console.log(newArray);
}

function ddFillType2(typesList) {  
        clearddType2(); 
        const editedList = [];
        for (let i = 0; i < typesList.length; i++) {
            if (typesList[i].name !== ddType1.value) {
            editedList.push(typesList[i])
            }
        }
        for (let i = 0; i < editedList.length; i++) {
            const option = document.createElement("option");
            option.setAttribute("value", editedList[i].name);
            option.innerHTML = editedList[i].name;
            ddType2.appendChild(option);
        }
}

function clearddType2() {
    ddType2.options.length = 1;
}




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