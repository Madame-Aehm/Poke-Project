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
const allSelectors = document.querySelectorAll("select");

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

fullFetch();

function fullListController (fullList) {
    reset(fullList);
    setEventListeners(fullList)
}

function reset (fullList) {
    if (ddType1.value === "") {
        makeSearchSuggestions(fullList);
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

function removeExistingData (){
    cardContainer.innerHTML = "";
}

  function shuffleList(fullList) {
    fullList.sort(() => Math.random() - 0.5);
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

//* /////////////////////// add type filters /////////////////////////////

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
        let pokemonName = ddType1.value;
        fetch(`https://pokeapi.co/api/v2/type/${pokemonName}/`).then((response) => response.json())
        .then((result) => {
            const typeList = result.pokemon;
            const compatibleType1 = typeList.map((element) => element.pokemon);
            ddType2.addEventListener("change",() => get2ndSingleTypeList(compatibleType1));
            makeSearchSuggestions(compatibleType1);
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

function createCard(singlePoke) {
    const cardDiv = document.createElement("div");
    cardContainer.appendChild(cardDiv);
    cardDiv.setAttribute("style", "display: flex; flex-direction: column; margin-bottom: 0.5em; margin-top: 0.5em; border: solid 2px black; border-radius: 6px; font-size: large; font-weight: bold;");
    const nameDiv = document.createElement("div");
    cardDiv.appendChild(nameDiv);
    nameDiv.innerHTML = displayNicely(singlePoke.name);
    nameDiv.setAttribute("style", "display: flex; justify-content: center; padding: 0.2em; color: white; background-color: #fc8485; align-self: stretch; border-top-left-radius: 3px 3px; border-top-right-radius: 3px 3px;")
    const img = document.createElement("img");
    img.setAttribute("style", "width: 100px; align-self:center;") 
    if (singlePoke.sprites.front_default === null) {
        img.setAttribute("src", "assets/images/sleeping.png", "alt", "No image of " + singlePoke.name)
    } else {
    img.setAttribute("src", singlePoke.sprites.front_default, "alt", singlePoke.name);
    }
    cardDiv.appendChild(img);

    //*                                        modal construction start point                                        
    const modalBackground = document.createElement("div");
    modalBackground.setAttribute("style", "display: none; position: fixed; top: 0; left: 0; z-index: 1; height: 100%; width: 100%; background-color: rgba(0,0,0,0.2);");
    const modal = document.createElement("div");
    modal.setAttribute("style", "display: flex; flex-direction: column; margin: 1% auto; border: solid 2px black; border-radius: 12px; background-color: white; width: 90%; height: 90%; overflow-y: scroll; font-size: large;")
    
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
    h1.innerHTML = displayNicely(singlePoke.name);
    
    const modalContent1 = document.createElement("div");
    modalContent1.setAttribute("style", "display: flex; flex-flow: row wrap; justify-content: space-evenly;");
    const imgDiv = document.createElement("div");
    imgDiv.style.alignSelf = "center";
    const mainImg = document.createElement("img");
    if (singlePoke.sprites.other["official-artwork"].front_default === null) {
        mainImg.setAttribute("src", "assets/images/sleeping.png", "alt", "No image of " + singlePoke.name)
    } else {
        mainImg.setAttribute("src", singlePoke.sprites.other["official-artwork"].front_default, "alt", singlePoke.name);
    }
    mainImg.setAttribute("style", "max-width:100%; max-height: 340px");
    

    const contentWrapper = document.createElement("div");
    contentWrapper.style.margin = "1em";
    const content = document.createElement("div");
    content.setAttribute("style", "display: flex; flex-direction: column; gap: 1.6em; padding: 0.5em; border: solid 2px black; border-radius: 12px; max-width: 230px;");
    const contentH3 = document.createElement("h3");
    contentH3.innerHTML = "Summary: "
    const typeLine = document.createElement("div");
    typeLine.setAttribute("style", "display: flex; gap: 1em;")
    const typesH3 = document.createElement("h3");
    typesH3.innerHTML = "Type: ";
    const types = document.createElement("span");
    if (singlePoke.types[1] !== undefined) {
        types.innerHTML =
        displayNicely(singlePoke.types[0].type.name) +
          " / " +
          displayNicely(singlePoke.types[1].type.name);
      } else {
        types.innerHTML = displayNicely(singlePoke.types[0].type.name);
      }
    const baseStatsLine = document.createElement("div");
    const baseStatsH3 = document.createElement("h3");
    baseStatsH3.innerHTML = "Base stats:";
    const baseStatsTable = document.createElement("table");
    baseStatsTable.classList.add("stats-table");
      for (let i = 0; i < singlePoke.stats.length; i++) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.innerHTML = displayNicely(singlePoke.stats[i].stat.name);
        const td = document.createElement("td");
        td.innerHTML = singlePoke.stats[i].base_stat;
        tr.append(th, td);
        baseStatsTable.append(tr);
      }
    const heightWeightLine = document.createElement("div");
    heightWeightLine.setAttribute("style", "display: flex; flex-wrap: wrap; gap: 1em;");
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
        li.innerHTML = displayNicely(singlePoke.abilities[i].ability.name);
        abilitiesList.appendChild(li);
    }


    const movesDivWrapper = document.createElement("div");
    movesDivWrapper.style.margin = "1em";
    const movesDiv = document.createElement("div");
    movesDiv.setAttribute("style", "overflow-y: scroll; max-width: 100%; max-height: 300px; padding: 0.5em; border: solid 2px black; border-radius: 12px;");
    const movesH3 = document.createElement("h3");
    movesH3.innerHTML = "Moves: ";
    const selectorsWrapper = document.createElement("span");
    selectorsWrapper.setAttribute("style", "display: flex; gap: 0.5em; padding-bottom: 0.5em;")

    const movesFilterSection = document.createElement("div");
    movesFilterSection.innerHTML = "Filter by: ";
    const movesFilter1 = document.createElement("select");
    movesFilter1.setAttribute("id", "move", "name", "move");
    const movesFilter1FirstValue = document.createElement("option");
    movesFilter1FirstValue.value = "";
    movesFilter1FirstValue.innerHTML = "Select Move...";
    movesFilter1.appendChild(movesFilter1FirstValue);
    const movesFilter2 = document.createElement("select");
    movesFilter2.setAttribute("id", "game", "name", "game");
    const movesFilter2FirstValue = document.createElement("option");
    movesFilter2FirstValue.value = "";
    movesFilter2FirstValue.innerHTML = "Select Game...";
    movesFilter2.appendChild(movesFilter2FirstValue);
    const movesFilter3 = document.createElement("select");
    movesFilter3.setAttribute("id", "method", "name", "method");
    const movesFilter3FirstValue = document.createElement("option");
    movesFilter3FirstValue.value = "";
    movesFilter3FirstValue.innerHTML = "Select Method...";
    movesFilter3.appendChild(movesFilter3FirstValue);

    const movesTable = document.createElement("table");
    movesTable.classList.add("moves-table");
    fillMovesTable(singlePoke.moves);

    //*   fill move filter select
    for (let i = 0; i < singlePoke.moves.length; i++) {
        const moveSelectOption = document.createElement("option");
        moveSelectOption.value = singlePoke.moves[i].move.name;
        moveSelectOption.innerHTML = displayNicely(singlePoke.moves[i].move.name);
        movesFilter1.appendChild(moveSelectOption);
    }
    movesFilter1.addEventListener("change", () => {
        if (movesFilter1.value === "") {
            fillMovesTable(singlePoke.moves);
        } else {
            const matchArray = [];
            for (let i = 0; i < singlePoke.moves.length; i++) {
                if (movesFilter1.value === singlePoke.moves[i].move.name) {
                    matchArray.push(singlePoke.moves[i]);
                    fillMovesTable(matchArray);
                }
            }
        }    
    });

    //*   fill game filter select
    const versionGroupDetails = [];
    for (let i = 0; i < singlePoke.moves.length; i++) {
        for (let j = 0; j < singlePoke.moves[i].version_group_details.length; j++) {
            versionGroupDetails.push(singlePoke.moves[i].version_group_details[j].version_group.name);
        }
    }
    const featuredGames = [...new Set(versionGroupDetails)];
    console.log(featuredGames);
    for (let i = 0; i < featuredGames.length; i++) {
        const forDisplay = displayGameNames(featuredGames[i]);
        const gameSelectOption = document.createElement("option");
        gameSelectOption.value = featuredGames[i];
        gameSelectOption.innerHTML = forDisplay;
        movesFilter2.appendChild(gameSelectOption);
    }
    movesFilter2.addEventListener("change", () => {
        if (movesFilter2.value === "") {
            fillMovesTable(singlePoke.moves);
        } else {
            const matchArray = [];
            for (let i = 0; i < singlePoke.moves.length; i++) {
                for (let j = 0; j < singlePoke.moves[i].version_group_details.length; j++) {
                    if (movesFilter2.value === singlePoke.moves[i].version_group_details[j].version_group.name) {
                        matchArray.push(singlePoke.moves[i]);
                    }
                }
            }
            fillTableGameFilter(matchArray);
        } 
    });

    function fillTableGameFilter (moveArray) {
        movesTable.innerHTML = ""
        createMoveTableHeaders();
        for (let i = 0; i < moveArray.length; i++) {
            const newMove = document.createElement("tr");
            movesTable.appendChild(newMove);
            const moveName = document.createElement("td");
            moveName.innerHTML = displayNicely(moveArray[i].move.name);
            newMove.appendChild(moveName);

            const test = [];
            for (let j = 0; j < moveArray[i].version_group_details.length; j++) {
                if (movesFilter2.value === moveArray[i].version_group_details[j].version_group.name) {
                    test.push(moveArray[i].version_group_details[j].version_group.name)
                    if (test.length > 1) {
                        const newRow = document.createElement("tr");
                        movesTable.appendChild(newRow);
                        let rowSpanNumber = moveName.rowSpan;
                        rowSpanNumber = rowSpanNumber + 1;
                        moveName.rowSpan = rowSpanNumber;
                        const moveVer = document.createElement("td");
                        moveVer.innerHTML = displayGameNames(moveArray[i].version_group_details[j].version_group.name);
                        const moveMethod = document.createElement("td");
                        if (moveArray[i].version_group_details[j].move_learn_method.name === "level-up") {
                            moveMethod.innerHTML = displayNicely(moveArray[i].version_group_details[j].move_learn_method.name) + " (lvl " + moveArray[i].version_group_details[j].level_learned_at + ")";
                        } else { 
                            moveMethod.innerHTML = displayNicely(moveArray[i].version_group_details[j].move_learn_method.name);
                        }
                        newRow.append(moveVer, moveMethod);
                    } else { 
                        const moveVer = document.createElement("td");
                        moveVer.innerHTML = displayGameNames(moveArray[i].version_group_details[j].version_group.name);
                        const moveMethod = document.createElement("td");
                        if (moveArray[i].version_group_details[j].move_learn_method.name === "level-up") {
                            moveMethod.innerHTML = displayNicely(moveArray[i].version_group_details[j].move_learn_method.name) + " (lvl " + moveArray[i].version_group_details[j].level_learned_at + ")";
                        } else { 
                            moveMethod.innerHTML = displayNicely(moveArray[i].version_group_details[j].move_learn_method.name);
                        }
                        newMove.append(moveVer, moveMethod);
                    }
                }
            }
        }
    }
            

    //*   fill method filter select
    const moveLearnMethod = [];
    for (let i = 0; i < singlePoke.moves.length; i++) {
        for (let j = 0; j < singlePoke.moves[i].version_group_details.length; j++) {
            moveLearnMethod.push(singlePoke.moves[i].version_group_details[j].move_learn_method.name);
        }
    }
    const methods = [...new Set(moveLearnMethod)];
    for (let i = 0; i < methods.length; i++) {
        const methodSelectOption = document.createElement("option");
        methodSelectOption.value = methods[i];
        methodSelectOption.innerHTML = displayNicely(methods[i]);
        movesFilter3.appendChild(methodSelectOption);
    }


    function createMoveTableHeaders () {
        const headings = document.createElement("tr");
        const moveNameCol = document.createElement("th");
        moveNameCol.innerHTML = "Move";
        const gameVerCol = document.createElement("th");
        gameVerCol.innerHTML = "Game";
        const learnedByCol = document.createElement("th");
        learnedByCol.innerHTML = "Method";
        headings.append(moveNameCol, gameVerCol, learnedByCol);
        movesTable.appendChild(headings);
    }

    function fillMovesTable(moveArray) {
        movesTable.innerHTML = ""
        createMoveTableHeaders();
        for (let i = 0; i < moveArray.length; i++) {
            const newMove = document.createElement("tr");
            movesTable.appendChild(newMove);
            const moveName = document.createElement("td");
            moveName.innerHTML = displayNicely(moveArray[i].move.name);
            moveName.style.verticalAlign = "top";
            const moveVer = document.createElement("td");
            moveVer.innerHTML = displayGameNames(moveArray[i].version_group_details[0].version_group.name);
            const learnedBy = document.createElement("td");
            if (moveArray[i].version_group_details[0].move_learn_method.name === "level-up") {
                learnedBy.innerHTML = displayNicely(moveArray[i].version_group_details[0].move_learn_method.name) + " (lvl " + moveArray[i].version_group_details[0].level_learned_at + ")";
            } else { 
                learnedBy.innerHTML = displayNicely(moveArray[i].version_group_details[0].move_learn_method.name);
            }
            newMove.append(moveName, moveVer, learnedBy);
            if (moveArray[i].version_group_details.length > 1) {
                for (let j = 1; j < moveArray[i].version_group_details.length; j++) {
                    let rowSpanNumber = moveName.rowSpan;
                    rowSpanNumber = rowSpanNumber + 1;
                    moveName.rowSpan = rowSpanNumber;
                    const nextRow = document.createElement("tr");
                    const nextVer = document.createElement("td");
                    nextVer.innerHTML = displayGameNames(moveArray[i].version_group_details[j].version_group.name);
                    const nextMethod = document.createElement("td");
                    if (moveArray[i].version_group_details[j].move_learn_method.name === "level-up") {
                        nextMethod.innerHTML = displayNicely(moveArray[i].version_group_details[j].move_learn_method.name) + " (lvl " + moveArray[i].version_group_details[j].level_learned_at + ")";
                    } else { 
                        nextMethod.innerHTML = displayNicely(moveArray[i].version_group_details[j].move_learn_method.name);
                    }
                    nextRow.append(nextVer, nextMethod);
                    movesTable.appendChild(nextRow);
                }
            }
        }
    }

    const spriteSection = document.createElement("div");
    spriteSection.setAttribute("style", "padding-left: 1em; padding-right: 1em;");
    const spriteHeader = document.createElement("div");
    const spriteH3 = document.createElement("h3");
    spriteH3.innerHTML = "Sprites: ";
    const spriteFilterSection = document.createElement("span");
    const spriteCheckbox1 = document.createElement("input");
    spriteCheckbox1.setAttribute("type", "checkbox", "name", "sprites", "value", "front", "id", "front");
    const spriteCheckbox1Label = document.createElement("label");
    spriteCheckbox1Label.for = "front";
    spriteCheckbox1Label.innerHTML = "Front";
    const spriteCheckbox2 = document.createElement("input");
    spriteCheckbox2.setAttribute("type", "checkbox", "name", "sprites", "value", "back", "id", "back");
    const spriteCheckbox2Label = document.createElement("label");
    spriteCheckbox2Label.for = "back";
    spriteCheckbox2Label.innerHTML = "Back";
    const spriteCheckbox3 = document.createElement("input");
    spriteCheckbox3.setAttribute("type", "checkbox", "name", "sprites", "value", "shiny", "id", "shiny");
    const spriteCheckbox3Label = document.createElement("label");
    spriteCheckbox3Label.for = "shiny";
    spriteCheckbox3Label.innerHTML = "Shiny";
    spriteFilterSection.innerHTML = "Show only: </br>";
    
    const spriteDisplay = document.createElement("div");
    spriteDisplay.setAttribute("style", "display: flex; flex-flow: row no-wrap; align-items: center; justify-content: space-between; max-width: 100%; overflow-x: scroll; border: solid 2px black; border-radius: 12px");
    
    const defaultSprites = Object.values(singlePoke.sprites);
    defaultSprites.length = defaultSprites.length -2;
    const redBlue = Object.values(singlePoke.sprites.versions["generation-i"]["red-blue"]);
    const yellow = Object.values(singlePoke.sprites.versions["generation-i"].yellow);
    const crystal = Object.values(singlePoke.sprites.versions["generation-ii"].crystal);
    const gold = Object.values(singlePoke.sprites.versions["generation-ii"].gold);
    const silver = Object.values(singlePoke.sprites.versions["generation-ii"].silver);
    const emerald = Object.values(singlePoke.sprites.versions["generation-iii"].emerald);
    const fireRedLeafGreen = Object.values(singlePoke.sprites.versions["generation-iii"]["firered-leafgreen"]);
    const rubySapphire = Object.values(singlePoke.sprites.versions["generation-iii"]["ruby-sapphire"]);
    const diamondPearl = Object.values(singlePoke.sprites.versions["generation-iv"]["diamond-pearl"]);
    const heartGoldSoulSilver = Object.values(singlePoke.sprites.versions["generation-iv"]["heartgold-soulsilver"]);
    const platinum = Object.values(singlePoke.sprites.versions["generation-iv"].platinum);
    const blackWhite = Object.values(singlePoke.sprites.versions["generation-v"]["black-white"]);
    const blackWhiteAnimated = Object.values(blackWhite.shift());
    const omegaRubyAlphaSapphire = Object.values(singlePoke.sprites.versions["generation-vi"]["omegaruby-alphasapphire"]);
    const xY = Object.values(singlePoke.sprites.versions["generation-vi"]["x-y"]);
    const ultraSunUltraMoon = Object.values(singlePoke.sprites.versions["generation-vii"]["ultra-sun-ultra-moon"]);
    const icons = Object.values(singlePoke.sprites.versions["generation-viii"].icons);
    const allGameSprites = [].concat(defaultSprites, redBlue, yellow, crystal, gold, silver, emerald, fireRedLeafGreen, rubySapphire, diamondPearl, heartGoldSoulSilver, platinum, blackWhite, blackWhiteAnimated, omegaRubyAlphaSapphire, xY, ultraSunUltraMoon, icons);
    for (let i = 0; i < allGameSprites.length; i++) {
        if (allGameSprites[i] !== null) {
                const spriteImg = document.createElement("img");
                spriteImg.setAttribute("src", allGameSprites[i], "alt", singlePoke.name);
                spriteDisplay.appendChild(spriteImg);
                spriteImg.onload = () => {
                    if (spriteImg.width < 128) {
                        let difference = 128 - spriteImg.width;
                        difference = difference / 2 + "px";
                        spriteImg.style.margin = difference;
                    }
                }
        }
    }

    const closeModelButton = document.createElement("button");
    closeModelButton.setAttribute("style", "align-self: center; margin: 1em;")
    closeModelButton.innerHTML = "Close";
    closeModelButton.addEventListener("click", () => modalBackground.style.display = "none");

    spriteFilterSection.append(spriteCheckbox1, spriteCheckbox1Label, spriteCheckbox2, spriteCheckbox2Label, spriteCheckbox3, spriteCheckbox3Label);
    spriteHeader.append(spriteH3, spriteFilterSection, spriteDisplay)
    spriteSection.append(spriteHeader);
    abilitiesLine.append(abilitiesH3, abilitiesList)
    weightSpan.append(weightH3, weight);
    heightSpan.append(heightH3, height),
    heightWeightLine.append(heightSpan, weightSpan)
    typeLine.append(typesH3, types);
    baseStatsLine.append(baseStatsH3, baseStatsTable);
    content.append(typeLine, baseStatsLine, heightWeightLine, abilitiesLine);
    imgDiv.appendChild(mainImg);
    selectorsWrapper.append(movesFilter1, movesFilter2, movesFilter3);
    movesFilterSection.appendChild(selectorsWrapper);
    movesDiv.appendChild(movesTable);
    movesDivWrapper.append(movesH3, movesFilterSection, movesDiv)
    contentWrapper.append(contentH3, content)
    modalContent1.append(imgDiv,contentWrapper, movesDivWrapper);
    modalHeader.append(close, h1);
    modal.append(modalHeader, modalContent1, spriteSection, closeModelButton);
    modalBackground.appendChild(modal);
    body.appendChild(modalBackground);

    cardDiv.addEventListener("click", () => {
        modalBackground.style.display = "block";
    })
}

function displayNicely(string) {
    const removeFirstHyphen = string.replace("-", " ");
    noHyphens = removeFirstHyphen.replace("-", " ");

    let final = "";
    for (let i = 0; i < noHyphens.length; i++) {
        if (i === 0 || noHyphens.charAt(i - 1) === " ") {
            final += noHyphens.charAt(i).toUpperCase();
        } else {
            final += noHyphens.charAt(i);
        }
    } return final;
}

function displayGameNames(gameName) {
    if (gameName === "red-blue") {
        return "Red/Blue";
    }
    if (gameName === "yellow") {
        return "Yellow";
    }
    if (gameName === "gold-silver") {
        return "Gold/Silver";
    }
    if (gameName === "crystal") {
        return "Crystal";
    }
    if (gameName === "emerald") {
        return "Emerald";
    }
    if (gameName === "firered-leafgreen") {
        return "Fire Red/Leaf Green";
    } 
    if (gameName === "diamond-pearl") {
        return "Diamond/Pearl";
    }
    if (gameName === "platinum") {
        return "Platinum";
    }
    if (gameName === "heartgold-soulsilver") {
        return "Heart Gold/Soul Silver";
    }
    if (gameName === "black-white") {
        return "Black/White";
    }
    if (gameName === "black-2-white-2") {
        return "Black 2/White 2";
    }
    if (gameName === "x-y") {
        return "X/Y";
    }
    if (gameName === "omega-ruby-alpha-sapphire") {
        return "Omega Ruby/Alpha Sapphire";
    }
    if (gameName === "sun-moon") {
        return "Sun/Moon";
    }
    if (gameName === "ultra-sun-ultra-moon") {
        return "Ultra Sun/Ultra Moon";
    }
    if (gameName === "sword-shield") {
        return "Sword/Shield";
    }
    if (gameName === "sword-shield") {
        return "Sword/Shield";
    }
    if (gameName === "ruby-sapphire") {
        return "Ruby/Sapphire";
    }
    if (gameName === "colosseum") {
        return "Colosseum";
    }
    if (gameName === "xd") {
        return "XD";
    }
    if (gameName === "lets-go-pikachu-lets-go-eevee") {
        return "Let's Go Pikachu/Let's Go Eevee";
    }
}