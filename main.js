const body = document.querySelector("body");
const cardContainer = document.getElementById("card-container");
const buttonText = document.getElementById("showFilters");
const hiddenSpan = document.getElementById("hidden-span");
const spotForButton = document.getElementById("spot-for-button");
const nameSearch = document.getElementById("poke-name-search");
const dataList = document.getElementById("all-pokemon");
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear");
const ddType1 = document.getElementById("type1");
const ddType2 = document.getElementById("type2");
const ddColour = document.getElementById("colour");
const ddMega = document.getElementById("mega");
const allSelectors = document.querySelectorAll("select");
const buttonPlacement = document.getElementById("show-random-placement");
const variationsCheck = document.getElementById("variations");

function showFilters () {
    if (hiddenSpan.style.display === "block") {
        hiddenSpan.style.display = "none";
        buttonText.innerHTML = "More ▼";
        // ddType1.value = "";                                                 //? this doesn't count as a "change" :(
    } else {
        hiddenSpan.style.display = "block";
        buttonText.innerHTML = "Less ▲";
    }
}

function removeExistingData (){
    cardContainer.innerHTML = "";
}

  function shuffleList(fullList) {
    fullList.sort(() => Math.random() - 0.5);
}

function fullFetch () {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=1154").then(function (response) {
         return response.json()     
    }).then((result) => {
        const fullList = result.results
        // const URLarray = fullList.map(element=> element.url)
        // console.log('URLarray :>> ', URLarray);
        // fetchSingleUrl(URLarray)
        fullListController(fullList)
        return fullList  
    }).catch((error)=>{console.log(error)}) 
}

// const  fetchSingleUrl = (URLarray) => {
//     Promise.all(URLarray.map(url=> fetch(url).then((response)=>response.json()))).then((result)=> console.log('result :>> ', result))
// }

function makeSearchSuggestions(list) {
    spotForButton.innerHTML = "";
    const shuffleButton = document.createElement("button");
    shuffleButton.innerHTML = "Shuffle!";
    shuffleButton.addEventListener("click", () => takeFive(list));
    spotForButton.appendChild(shuffleButton);
    dataList.innerHTML = "";
    for (let i = 0; i < list.length; i++) {
        const searchOption = document.createElement("option");
        searchOption.setAttribute("value", list[i].name);
        searchOption.innerHTML = list[i].name;
        dataList.appendChild(searchOption);
    }
    console.log(list);
}

function reset (fullList) {
    let empty = "";
    for (let i = 0; i < allSelectors.length; i++) {
        if (allSelectors[i].value === "") {
            empty = "empty"
        } else empty = "not empty";
            break;
        }
    if (empty === "empty") {
        makeSearchSuggestions(fullList);
    }
}

function makeSearch (list) {
    // let enteredText = nameSearch.value;
    // enteredText.trim();                                                         //? want to incorporate this somehow
    let found = "";
        for (let i = 0; i < list.length; i++) {
                if (list[i].name === nameSearch.value) {
                    found = "match found";
                    removeExistingData();
                    fetchSinglePoke(list[i].url);
                    break;
                } else {
                    noMonHere();
                }
            }
    
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
        const singlePoke = result;
        console.log(singlePoke);
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
    nameDiv.innerHTML = singlePoke.name;
    nameDiv.setAttribute("style", "display: flex; justify-content: center; padding: 0.2em; color: white; background-color: #fc8485; align-self: stretch; border-top-left-radius: 3px 3px; border-top-right-radius: 3px 3px;")
    const img = document.createElement("img");
    img.setAttribute("style", "width: 100px; align-self:center;") 
    if (singlePoke.sprites.front_default === null) {
        img.setAttribute("src", "assets/images/sleeping.png", "alt", "No image of " + singlePoke.name)
    } else {
    img.setAttribute("src", singlePoke.sprites.front_default, "alt", singlePoke.name);
    }
    cardDiv.appendChild(img);

    //*create modal////////////////////////
    const modalBackground = document.createElement("div");
    modalBackground.setAttribute("style", "display: none; position: fixed; top: 0; left: 0; z-index: 1; height: 100%; width: 100%; background-color: rgba(0,0,0,0.2);");
    const modal = document.createElement("div");
    // modalBackground.addEventListener("click", () => modalBackground.style.display = "none");   //? need to specify not children of modelBackground....
    modal.setAttribute("style", "display: flex; flex-direction: column; margin: 1% auto; border: solid 2px black; border-radius: 12px; background-color: white; width: 70%; height: 90%; overflow-y: scroll; font-size: large;")
    
    const modalHeader = document.createElement("div");
    modalHeader.setAttribute("style", "display: flex; flex-direction: column; background-color: #fc8485;");
    const close = document.createElement("span");
    close.setAttribute("style", "align-self: flex-end; padding-right: 0.3em; color: white; font-size: 28px; font-weight: bold;");
    close.addEventListener("mouseenter", () => close.setAttribute("style", "cursor: pointer; align-self: flex-end; padding-right: 0.3em; color: black; font-size: 28px; font-weight: bold;"));
    close.addEventListener("mouseleave", () => close.setAttribute("style", "cursor: default; align-self: flex-end; padding-right: 0.3em; color: white; font-size: 28px; font-weight: bold;"));
    close.addEventListener("click", () => modalBackground.style.display = "none");
    close.innerHTML = "&times;";
    const h1 = document.createElement("h1");
    h1.setAttribute("style", "color: white; align-self: center; margin-top: 0;")
    h1.innerHTML = singlePoke.name;
    
    const modalContent1 = document.createElement("div");
    modalContent1.setAttribute("style", "display: flex; flex-flow: row wrap; justify-content: space-around;");
    const imgDiv = document.createElement("div");
    imgDiv.style.width = "50%";
    const mainImg = document.createElement("img");
    if (singlePoke.sprites.other["official-artwork"].front_default === null) {
        mainImg.setAttribute("src", "assets/images/sleeping.png", "alt", "No image of " + singlePoke.name)
    } else {
        mainImg.setAttribute("src", singlePoke.sprites.other["official-artwork"].front_default, "alt", singlePoke.name);
    }
    mainImg.style.maxWidth = "100%";
    const content1Right = document.createElement("div");
    content1Right.setAttribute("style", "width: 50%; display: flex; flex-direction: column; gap: 1em; padding-top: 5%");
    const typeLine = document.createElement("div");
    typeLine.setAttribute("style", "display: flex; gap: 1em;")
    const typesH3 = document.createElement("h3");
    typesH3.innerHTML = "Type: ";
    const types = document.createElement("span");
    if (singlePoke.types[1] !== undefined) {
        types.innerHTML =
        singlePoke.types[0].type.name +
          " / " +
          singlePoke.types[1].type.name;
      } else {
        types.innerHTML = singlePoke.types[0].type.name;
      }
    
    const baseStatsLine = document.createElement("div");
    const baseStatsH3 = document.createElement("h3");
    baseStatsH3.innerHTML = "Base stats:";
    const baseStatsTable = document.createElement("table");
      for (let i = 0; i < singlePoke.stats.length; i++) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.innerHTML = singlePoke.stats[i].stat.name;
        const td = document.createElement("td");
        td.innerHTML = singlePoke.stats[i].base_stat;
        tr.append(th, td);
        baseStatsTable.append(tr);
      }
    const heightWeightLine = document.createElement("div");
    heightWeightLine.setAttribute("style", "display: flex; gap: 2em;");
    const heightSpan = document.createElement("span");
    heightSpan.setAttribute("style", "display: flex; gap: 1em;")
    const heightH3 = document.createElement("h3");
    heightH3.innerHTML = "Height: ";
    const height = document.createElement("span");
    height.innerHTML = singlePoke.height;
    const weightSpan = document.createElement("span");
    weightSpan.setAttribute("style", "display: flex; gap: 1em;");
    const weightH3 = document.createElement("h3");
    weightH3.innerHTML = "Weight: ";
    const weight = document.createElement("span");
    weight.innerHTML = singlePoke.weight;

    const abilitiesLine = document.createElement("div");
    const abilitiesH3 = document.createElement("h3");
    abilitiesH3.innerHTML = "Abilities: ";
    const abilitiesList = document.createElement("ol");
    for (let i = 0; i < singlePoke.abilities.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = singlePoke.abilities[i].ability.name;
        abilitiesList.appendChild(li);
    }

    const spriteSection = document.createElement("div");
    spriteSection.style.padding = "1em";
    const spriteHeader = document.createElement("div");
    const spriteH3 = document.createElement("h3");
    spriteH3.innerHTML = "Sprites: ";
    const spriteFilterSection = document.createElement("span");
    const spriteCheckbox1 = document.createElement("input");
    spriteCheckbox1.setAttribute("type", "checkbox", "name", "sprites", "value", "front", "id", "front");
    const spriteCheckbox1Label = document.createElement("label");
    spriteCheckbox1Label.for = "front";
    spriteCheckbox1Label.innerHTML = "testing1";
    const spriteCheckbox2 = document.createElement("input");
    spriteCheckbox2.setAttribute("type", "checkbox", "name", "sprites", "value", "back", "id", "back");
    const spriteCheckbox2Label = document.createElement("label");
    spriteCheckbox2Label.for = "back";
    spriteCheckbox2Label.innerHTML = "testing2"
    spriteFilterSection.innerHTML = "Show only: ";
    const spriteDisplay = document.createElement("div");
    spriteDisplay.setAttribute("style", "display: flex; gap: 1em; justify-content: space-between; width: 100%; overflow-x: scroll; border: solid 2px black; border-radius: 12px");
    const sprites = Object.entries(singlePoke.sprites);
    sprites.length = sprites.length -2;
    for (let i = 0; i < sprites.length; i++) {
        if (sprites[i][1] !== null) {
            const spriteImg = document.createElement("img");
            spriteImg.setAttribute("src", sprites[i][1], "alt", singlePoke.name)
            spriteDisplay.appendChild(spriteImg);
        }
    }
    

    // const gamesArray = [];
    // const versions = Object.entries(singlePoke.sprites.versions);
    // console.log(versions);
    // for (let i = 0; i < versions.length; i++) {
    //     const generations = Object.entries(versions[i][1]);
    //     for (let j = 0; j < generations.length; j++) {
    //         if (generations[i] !== undefined) {
    //             gamesArray.push(generations[i][1])
    //         }
    //     }
    // }
    // console.log("gamesArray :>> ", gamesArray);
    // for (let i = 0; i < gamesArray.length; i++) {

    // }  //*                    getting real sick of this API and its bullshit way of organizing itself



    spriteFilterSection.append(spriteCheckbox1, spriteCheckbox1Label, spriteCheckbox2, spriteCheckbox2Label);
    spriteHeader.append(spriteH3, spriteFilterSection, spriteDisplay)
    spriteSection.append(spriteHeader);





    abilitiesLine.append(abilitiesH3, abilitiesList)
    weightSpan.append(weightH3, weight);
    heightSpan.append(heightH3, height),
    heightWeightLine.append(heightSpan, weightSpan)
    typeLine.append(typesH3, types);
    baseStatsLine.append(baseStatsH3, baseStatsTable);
    content1Right.append(typeLine, baseStatsLine, heightWeightLine, abilitiesLine);
    imgDiv.appendChild(mainImg);
    modalContent1.append(imgDiv, content1Right);
    modalHeader.append(close, h1);
    modal.append(modalHeader, modalContent1, spriteSection);
    modalBackground.appendChild(modal);
    body.appendChild(modalBackground);

    cardDiv.addEventListener("click", () => {
        modalBackground.style.display = "block";
    })
}

function takeFive (list) {
    removeExistingData()
    const newArray = [];
    for (let i = 0; i < list.length; i++) {
        newArray.push(list[i])
    }
    shuffleList(newArray);
    for (let i = 0; i < 5; i++) {
        let singleURL = newArray[i].url;
        fetchSinglePoke(singleURL);
    }
}

function setEventListeners(fullList) {
    ddType1.addEventListener("change", () => reset(fullList));
    searchButton.addEventListener("click",() => makeSearch(fullList));
    nameSearch.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            makeSearch(fullList);
          }
    });
}

function fullListController (fullList) {
    reset(fullList);
    setEventListeners(fullList)
}

fullFetch();


//* /////////////////////// add type filters /////////////////////////////

function typesFetch() {
    fetch("https://pokeapi.co/api/v2/type/").then((response) => response.json())
    .then((result) => {
        const typesList = result.results
        typesController(typesList)
        return typesList;
    }).catch((error)=>{console.log(error)}) 
}

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
        let pokemonName = ddType1.value;
        fetch(`https://pokeapi.co/api/v2/type/${pokemonName}/`).then((response) => response.json())
        .then((result) => {
            const typeList = result.pokemon;
            const compatibleType1 = typeList.map((element) => element.pokemon);
            ddType2.addEventListener("change",() => get2ndSingleTypeList(compatibleType1));
            makeSearchSuggestions(compatibleType1);
            // activateShuffle(compatibleType1);                   //? doesn't remove, only adds.
            // randomButton.addEventListener("click", function activateShuffle(){ takeFive(compatibleType1)});       //? initializing function doesn't work either...

            // const buttonClone = randomButton.cloneNode(true);
            // randomButton.remove();
            // buttonPlacement.appendChild(buttonClone);
            // buttonClone.addEventListener("click",() => takeFive(compatibleType1));
            // buttonClone = randomButton;

            // randomButton.remove().clone().appendTo(buttonPlacement);
            // randomButton.addEventListener("click", () => takeFive(compatibleType1))
        }).catch((error)=>{console.log(error)}); 
    }
}

function get2ndSingleTypeList(type1List) {
    if (ddType1.value && ddType2.value) {
        let pokemonName = ddType2.value;
        fetch(`https://pokeapi.co/api/v2/type/${pokemonName}/`).then((response) => response.json())
        .then((result) => {
            const type2List = result.pokemon
            const compatibleType2 = type2List.map((element)=> {
                return element.pokemon
            });
            const combinedList = [...type1List, ...compatibleType2];
            const duplicateNames = combinedList.map(e => e.name).filter((e, i, array) => array.indexOf(e) !==i);
            const duplicatesArray = combinedList.filter(e => duplicateNames.includes(e.name));
            const duelTypesList = duplicatesArray.map(e => e["name"])
            .map((e, i, final) => final.indexOf(e) === i && i)                          //* store the keys of the unique objects
            .filter(e => duplicatesArray[e]).map(e => duplicatesArray[e]);              //* eliminate the dead keys & store unique objects
            makeSearchSuggestions(duelTypesList);
        }).catch((error)=>{console.log(error)})
    }
}

function ddFillType2(typesList) {  
        ddType2.options.length = 1;
        const editedList = [];
        for (let i = 0; i < typesList.length; i++) {
            if (typesList[i].name !== ddType1.value) {
            editedList.push(typesList[i])
            }
        }
        if (ddType1.value !== "") {
            for (let i = 0; i < editedList.length; i++) {
                const option = document.createElement("option");
                option.setAttribute("value", editedList[i].name);
                option.innerHTML = editedList[i].name;
                ddType2.appendChild(option);
            }
        }
}

typesFetch();







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