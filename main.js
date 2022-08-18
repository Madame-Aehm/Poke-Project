const body = document.querySelector("body");
const modalDiv = document.getElementById("modal-div");
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
    setEventListeners(fullList);
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
    buttonText.addEventListener("click", () => {
        showFilters(fullList);
    });
}

function showFilters (fullList) {
    if (hiddenSpan.style.display === "block") {
        hiddenSpan.style.display = "none";
        buttonText.innerHTML = "More ▼";
        ddType1.value = "";
        makeSearchSuggestions(fullList)
    } else {
        hiddenSpan.style.display = "block";
        buttonText.innerHTML = "Less ▲";
    }
}

function removeExistingData (){
    cardContainer.innerHTML = "";
    modalDiv.innerHTML = "";
    nameSearch.value = "";
}

  function shuffleList(fullList) {
    fullList.sort(() => Math.random() - 0.5);
}

function takeFive (list) {
    if (list.length === 0) {
        noMonHere();
    } else {
        nameSearch.value = "";
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
    let enteredText = nameSearch.value.toLowerCase().trim().replace(" ", "-");  //* not sure what other conditions to reformat......
    let found = "";
    for (let i = 0; i < list.length; i++) {
        if (list[i].name === enteredText) {
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
        body.style.cursor = "progress";
        return response.json()
    }).then(function (result) {
        const singlePoke = result;
        console.log(singlePoke);
        createCard(singlePoke);
        body.style.cursor = "default";
    }).catch((error)=>{console.log(error)})
}

//* /////////////////////// add type filters /////////////////////////////

function typesFetch() {
    fetch("https://pokeapi.co/api/v2/type/").then((response) => response.json())
    .then((result) => {
        const typesList = result.results
        typesController(typesList);
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
            option.innerHTML = displayNicely(typesList[i].name);
            ddType1.appendChild(option);
        }
}

function addTypeEL(typesList) {
    ddType1.addEventListener("change", () => {
        nameSearch.value = "";
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
            ddType2.addEventListener("change",() => {
                nameSearch.value = "";
                get2ndSingleTypeList(compatibleType1);
            });
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
            .map((e, i, final) => final.indexOf(e) === i && i)                    //* store the keys of the unique objects
            .filter(e => duplicatesArray[e]).map(e => duplicatesArray[e]);        //* eliminate the dead keys & store unique objects
            makeSearchSuggestions(duelTypesList);
        }).catch((error)=>{console.log(error)})
    } else {
        makeSearchSuggestions(type1List);
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
                option.innerHTML = displayNicely(editedList[i].name);
                ddType2.appendChild(option);
            }
        }
}

function createCard(singlePoke) {
    const cardDiv = document.createElement("div");
    cardContainer.appendChild(cardDiv);
    cardDiv.classList.add("card-div");
    const nameDiv = document.createElement("div");
    cardDiv.appendChild(nameDiv);
    nameDiv.innerHTML = displayNicely(singlePoke.name);
    nameDiv.classList.add("name-div");
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
    modalBackground.classList.add("modal-background");
    const modal = document.createElement("div");
    modal.classList.add("modal");
    
    //*                                          modal header ..................................................
    const modalHeader = document.createElement("div");
    modalHeader.setAttribute("style", "display: flex; flex-direction: column; background-color: #fc8485;");
    const close = document.createElement("span");
    close.setAttribute("style", "align-self: flex-end; padding-right: 0.3em; color: white; font-size: 28px; font-weight: bold;");
    close.addEventListener("mouseenter", () => close.setAttribute("style", "cursor: pointer; align-self: flex-end; padding-right: 0.3em; color: black; font-size: 28px; font-weight: bold;"));
    close.addEventListener("mouseleave", () => close.setAttribute("style", "cursor: default; align-self: flex-end; padding-right: 0.3em; color: white; font-size: 28px; font-weight: bold;"));
    close.addEventListener("click", () => {
        modalBackground.style.display = "none";
        body.style.overflow = "initial";
    });
    close.innerHTML = "&times;";
    const h1 = document.createElement("h1");
    h1.setAttribute("style", "color: white; align-self: center; margin-top: 0;")
    h1.innerHTML = displayNicely(singlePoke.name);
    
    //*                                          content div                                                 
    const modalContent1 = document.createElement("div");
    modalContent1.setAttribute("style", "display: flex; flex-flow: row wrap; justify-content: space-evenly;");
    //*                                          large image                                                    
    const imgDiv = document.createElement("div");
    imgDiv.style.alignSelf = "center";
    const mainImg = document.createElement("img");
    if (singlePoke.sprites.other["official-artwork"].front_default === null) {
        mainImg.setAttribute("src", "assets/images/sleeping.png", "alt", "No image of " + singlePoke.name)
    } else {
        mainImg.setAttribute("src", singlePoke.sprites.other["official-artwork"].front_default, "alt", singlePoke.name);
    }
    mainImg.setAttribute("style", "max-width:100%; max-height: 340px");
    
    //*                                         summary div                                                  
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
    height.innerHTML = singlePoke.height * 10 + "cm";
    const weightSpan = document.createElement("span");
    weightSpan.setAttribute("style", "display: flex; gap: 1em;");
    const weightH3 = document.createElement("h3");
    weightH3.innerHTML = "Weight: ";
    const weight = document.createElement("span");
    let convertedWeight = singlePoke.weight / 10;
    weight.innerHTML = convertedWeight + "kg"

    const abilitiesLine = document.createElement("div");
    const abilitiesH3 = document.createElement("h3");
    abilitiesH3.innerHTML = "Abilities: ";
    const abilitiesList = document.createElement("ol");
    for (let i = 0; i < singlePoke.abilities.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = displayNicely(singlePoke.abilities[i].ability.name);
        abilitiesList.appendChild(li);
    }

    //*                                                   moves div                                                
    const movesDivWrapper = document.createElement("div");
    movesDivWrapper.setAttribute("style", "margin: 1em; max-width: 95%;");
    const movesDiv = document.createElement("div");
    movesDiv.setAttribute("style", "overflow-y: scroll; max-width: 100%; height: 300px; padding: 0.5em; border: solid 2px black; border-radius: 12px;");
    const movesH3 = document.createElement("h3");
    movesH3.innerHTML = "Moves: ";
    const selectorsWrapper = document.createElement("span");
    selectorsWrapper.setAttribute("style", "display: flex; gap: 0.5em; padding-bottom: 0.5em;")

    const movesFilterSection = document.createElement("div");
    movesFilterSection.innerHTML = "Filter: ";
    const movesFilter1 = document.createElement("select");
    movesFilter1.setAttribute("id", "move", "name", "move");
    const movesFilter1FirstValue = document.createElement("option");
    movesFilter1FirstValue.value = "";
    movesFilter1FirstValue.innerHTML = "All moves...";
    movesFilter1.appendChild(movesFilter1FirstValue);
    const movesFilter2 = document.createElement("select");
    movesFilter2.setAttribute("id", "game", "name", "game");
    const movesFilter2FirstValue = document.createElement("option");
    movesFilter2FirstValue.value = "";
    movesFilter2FirstValue.innerHTML = "All Games...";
    movesFilter2.appendChild(movesFilter2FirstValue);
    const movesFilter3 = document.createElement("select");
    movesFilter3.setAttribute("id", "method", "name", "method");
    const movesFilter3FirstValue = document.createElement("option");
    movesFilter3FirstValue.value = "";
    movesFilter3FirstValue.innerHTML = "All Methods...";
    movesFilter3.appendChild(movesFilter3FirstValue);

    const movesTable = document.createElement("table");
    movesTable.classList.add("moves-table");
    fillMovesTable(singlePoke.moves);

    function filtersCombined () {
        if (!movesFilter1.value && !movesFilter2.value && !movesFilter3.value) {
            fillMovesTable(singlePoke.moves);
        } else {
            for (let i = 0; i < singlePoke.moves.length; i++) {
                if (movesFilter1.value === singlePoke.moves[i].move.name) {
                    for (let j = 0; j < singlePoke.moves[i].version_group_details.length; j++) {
                        if ((movesFilter2.value === singlePoke.moves[i].version_group_details[j].version_group.name && movesFilter3.value === singlePoke.moves[i].version_group_details[j].move_learn_method.name)
                        || (movesFilter2.value === singlePoke.moves[i].version_group_details[j].version_group.name && !movesFilter3.value)
                        || (!movesFilter2.value && movesFilter3.value === singlePoke.moves[i].version_group_details[j].move_learn_method.name)
                        || (!movesFilter2.value && !movesFilter3.value)) {
                            fillTable(singlePoke.moves[i], singlePoke.moves[i].version_group_details[j]);
                        }
                    }
                } else if (!movesFilter1.value) {
                    for (let j = 0; j < singlePoke.moves[i].version_group_details.length; j++) {
                        if ((movesFilter2.value === singlePoke.moves[i].version_group_details[j].version_group.name && movesFilter3.value === singlePoke.moves[i].version_group_details[j].move_learn_method.name)
                        || (movesFilter2.value === singlePoke.moves[i].version_group_details[j].version_group.name && !movesFilter3.value)
                        || (!movesFilter2.value && movesFilter3.value === singlePoke.moves[i].version_group_details[j].move_learn_method.name)) {
                            fillTable(singlePoke.moves[i], singlePoke.moves[i].version_group_details[j]);
                        }
                    }
                }
            }
        }
    }


    //*   fill move filter select
    



    for (let i = 0; i < singlePoke.moves.length; i++) {
        const moveSelectOption = document.createElement("option");
        moveSelectOption.value = singlePoke.moves[i].move.name;
        moveSelectOption.innerHTML = displayNicely(singlePoke.moves[i].move.name);
        movesFilter1.appendChild(moveSelectOption);
    }
    movesFilter1.addEventListener("change", () => {
        movesTable.innerHTML = "";
        createMoveTableHeaders();
        filtersCombined(); 
    });

    //*   fill game filter select
    const versionGroupDetails = [];
    for (let i = 0; i < singlePoke.moves.length; i++) {
        for (let j = 0; j < singlePoke.moves[i].version_group_details.length; j++) {
            versionGroupDetails.push(singlePoke.moves[i].version_group_details[j].version_group.name);
        }
    }
    const featuredGames = [...new Set(versionGroupDetails)];
    for (let i = 0; i < featuredGames.length; i++) {
        const forDisplay = displayGameNames(featuredGames[i]);
        const gameSelectOption = document.createElement("option");
        gameSelectOption.value = featuredGames[i];
        gameSelectOption.innerHTML = forDisplay;
        movesFilter2.appendChild(gameSelectOption);
    }
    movesFilter2.addEventListener("change", () => {
        movesTable.innerHTML = "";
        createMoveTableHeaders();
        filtersCombined();  
    });       

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

    movesFilter3.addEventListener("change", () => {
        movesTable.innerHTML = "";
        createMoveTableHeaders();
        filtersCombined();
    });


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

    function fillTable (loop1, loop2) { 
        const newRow = document.createElement("tr");
        movesTable.appendChild(newRow);
        const nameCell = document.createElement("td");
        nameCell.innerHTML = displayNicely(loop1.move.name);
        const gameCell = document.createElement("td");
        gameCell.innerHTML = displayGameNames(loop2.version_group.name);
        const methodCell = document.createElement("td");
        whichLevel(loop2, methodCell);
        newRow.append(nameCell, gameCell, methodCell);
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
            whichLevel(moveArray[i].version_group_details[0], learnedBy);
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
                    whichLevel(moveArray[i].version_group_details[j], nextMethod);
                    nextRow.append(nextVer, nextMethod);
                    movesTable.appendChild(nextRow);
                }
            }
        }
    }

    //*                                                  sprites div...........................................
    const spriteSection = document.createElement("div");
    spriteSection.setAttribute("style", "padding-left: 1em; padding-right: 1em;");
    const spriteHeader = document.createElement("div");
    const spriteH3 = document.createElement("h3");
    spriteH3.innerHTML = "Sprites: ";
    const spriteFilterSection = document.createElement("span");
    spriteFilterSection.setAttribute("style", "display: flex; flex-flow: row wrap; gap: 1em; margin: 0.3em;")
    spriteFilterSection.classList.add("checkbox-wrapper");

    let spriteCheckbox1 = document.createElement("input");
    spriteCheckbox1.type = "checkbox";
    spriteCheckbox1.id = "front";
    const spriteCheckbox1Label = document.createElement("label");
    checkboxHover(spriteCheckbox1, spriteCheckbox1Label);
    spriteCheckbox1Label.innerHTML = "Front ";
    spriteCheckbox1.addEventListener("input", () => {
        spriteDisplay.innerHTML = "";
        if (!spriteCheckbox1.checked && !spriteCheckbox2.checked && !spriteCheckbox3.checked && !spriteCheckbox4.checked) {
            displayAllSprites(cleanSpritesList);
        } else if (spriteCheckbox1.checked) {
            spriteCheckbox2.checked = false;
            if (spriteCheckbox3.checked) {
                shinyFront();
            } else if (spriteCheckbox4.checked) {
                defaultFront();
            } else {
                front();
            }
        } else {
            if (spriteCheckbox3.checked) {
                shiny();
            } else {
                defaultAll();
            }
        }
    });

    let spriteCheckbox2 = document.createElement("input");
    spriteCheckbox2.type = "checkbox";
    spriteCheckbox2.id = "back";
    const spriteCheckbox2Label = document.createElement("label");
    checkboxHover(spriteCheckbox2, spriteCheckbox2Label);
    spriteCheckbox2Label.innerHTML = "Back ";
    spriteCheckbox2.addEventListener("input", () => {
        spriteDisplay.innerHTML = "";
        if (!spriteCheckbox1.checked && !spriteCheckbox2.checked && !spriteCheckbox3.checked && !spriteCheckbox4.checked) {
            displayAllSprites(cleanSpritesList);
        } else if (spriteCheckbox2.checked) {
            spriteCheckbox1.checked = false;
            if (spriteCheckbox3.checked) {
                shinyBack();
            } else if (spriteCheckbox4.checked) {
                defaultBack();
            } else {
                back();
            }
        } else {
            if (spriteCheckbox3.checked) {
                shiny();
            } else {
                defaultAll();
            }
        }
    });

    let spriteCheckbox3 = document.createElement("input");
    spriteCheckbox3.type = "checkbox";
    spriteCheckbox3.id = "shiny";
    const spriteCheckbox3Label = document.createElement("label");
    checkboxHover(spriteCheckbox3, spriteCheckbox3Label);
    spriteCheckbox3Label.innerHTML = "Shiny ";
    spriteCheckbox3.addEventListener("input", () => {
        spriteDisplay.innerHTML = "";
        if (!spriteCheckbox1.checked && !spriteCheckbox2.checked && !spriteCheckbox3.checked && !spriteCheckbox4.checked) {
            displayAllSprites(cleanSpritesList);
        } else if (spriteCheckbox3.checked) {
            spriteCheckbox4.checked = false;
            if (spriteCheckbox1.checked) {
                shinyFront();
            } else if (spriteCheckbox2.checked) {
                shinyBack();
            } else {
                shiny();
            } 
        } else {
            if (spriteCheckbox1.checked) {
                front();
            } else if (spriteCheckbox2.checked) {
                back();
            }
        }
    });

    let spriteCheckbox4 = document.createElement("input");
    spriteCheckbox4.type = "checkbox";
    spriteCheckbox4.id = "default";
    const spriteCheckbox4Label = document.createElement("label");
    checkboxHover(spriteCheckbox4, spriteCheckbox4Label);
    spriteCheckbox4Label.innerHTML = "Default ";
    spriteCheckbox4.addEventListener("input", () => {
        spriteDisplay.innerHTML = "";
        if (!spriteCheckbox1.checked && !spriteCheckbox2.checked && !spriteCheckbox3.checked && !spriteCheckbox4.checked) {
            displayAllSprites(cleanSpritesList);
        } else if (spriteCheckbox4.checked) {
            spriteCheckbox3.checked = false;
            if (spriteCheckbox1.checked) {
                defaultFront();
            } else if (spriteCheckbox2.checked) {
                defaultBack();
            } else {
                defaultAll();
            } 
        } else {
            if (spriteCheckbox1.checked) {
                front();
            } else if (spriteCheckbox2.checked) {
                back();
            }
        }
    });

    function spritesFiltered(spriteURL) {
        const spriteImg = document.createElement("img");
        spriteImg.src = spriteURL
        spriteImg.alt = singlePoke.name;
        spriteImg.title = findGen(spriteURL);
        spriteDisplay.appendChild(spriteImg);
        spriteImg.onload = () => {
            if (spriteImg.width < 128) {
                let difference = 128 - spriteImg.width;
                difference = difference / 2 + "px";
                spriteImg.style.margin = difference;
            }
        }
    }

    function front () {
        for (let i = 0; i < cleanSpritesList.length; i++) {
            if (!cleanSpritesList[i].includes("/back")) {
                spritesFiltered(cleanSpritesList[i]);
            }
        }
    }

    function back () {
        for (let i = 0; i < cleanSpritesList.length; i++) {
            if (cleanSpritesList[i].includes("/back")) {
                spritesFiltered(cleanSpritesList[i]);
            }
        }
    }

    function shiny () {
        for (let i = 0; i < cleanSpritesList.length; i++) {
            if (cleanSpritesList[i].includes("/shiny")) {
                spritesFiltered(cleanSpritesList[i]);
            }
        }
    }

    function shinyFront () {
        for (let i = 0; i < cleanSpritesList.length; i++) {
            if (!cleanSpritesList[i].includes("/back") && (cleanSpritesList[i].includes("/shiny"))) {
                spritesFiltered(cleanSpritesList[i]);
            }
        }
    }

    function shinyBack () {
        for (let i = 0; i < cleanSpritesList.length; i++) {
            if (cleanSpritesList[i].includes("/back") && (cleanSpritesList[i].includes("/shiny"))) {
                spritesFiltered(cleanSpritesList[i]);
            }
        }
    }

    function defaultAll () {
        for (let i = 0; i < cleanSpritesList.length; i++) {
            if (!cleanSpritesList[i].includes("/shiny")) {
                spritesFiltered(cleanSpritesList[i]);
            }
        }
    }

    function defaultFront () {
        for (let i = 0; i < cleanSpritesList.length; i++) {
            if (!cleanSpritesList[i].includes("/back") && !cleanSpritesList[i].includes("/shiny")) {
                spritesFiltered(cleanSpritesList[i]);
            }
        }
    }

    function defaultBack () {
        for (let i = 0; i < cleanSpritesList.length; i++) {
            if (cleanSpritesList[i].includes("/back") && !cleanSpritesList[i].includes("/shiny")) {
                spritesFiltered(cleanSpritesList[i]);
            }
        }
    }
    
    const spriteDisplay = document.createElement("div");
    spriteDisplay.classList.add("sprite-display");
    
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
    const allGameSprites = [].concat(icons, redBlue, yellow, crystal, gold, silver, emerald, fireRedLeafGreen, rubySapphire, diamondPearl, heartGoldSoulSilver, platinum, blackWhite, blackWhiteAnimated, omegaRubyAlphaSapphire, xY, ultraSunUltraMoon);
    const cleanSpritesList = [];
    for (let i = 0; i < allGameSprites.length; i++) {
        if (allGameSprites[i] !== null) {
                cleanSpritesList.push(allGameSprites[i]);
            }
    }
    displayAllSprites(cleanSpritesList);

    function displayAllSprites (spritesURLS) {
        if (spritesURLS.length === 0) {
            const replaceImg = document.createElement("img");
            replaceImg.setAttribute("src", "assets/images/sleeping.png");
            spriteDisplay.appendChild(replaceImg);
            spriteDisplay.style.justifyContent = "center";
            spriteCheckbox1.disabled = true;
            spriteCheckbox2.disabled = true;
            spriteCheckbox3.disabled = true;
            spriteCheckbox4.disabled = true;
        } else {
            const checkForBack = [];
            for (let i = 0; i < spritesURLS.length; i++) {
                const spriteImg = document.createElement("img");
                spriteImg.src = spritesURLS[i]
                spriteImg.alt = singlePoke.name;
                spriteImg.title = findGen(spritesURLS[i]);
                spriteDisplay.appendChild(spriteImg);
                spriteImg.onload = () => {
                    if (spriteImg.width < 128) {
                        let difference = 128 - spriteImg.width;
                        difference = difference / 2 + "px";
                        spriteImg.style.margin = difference;
                    }
                }
                if (spritesURLS[i].includes("/back")) {
                    checkForBack.push(spritesURLS[i])
                }
            }
            if (checkForBack.length === 0) {
                spriteCheckbox2.disabled = true;
            }  
        }
    }

    const closeModelButton = document.createElement("button");
    closeModelButton.setAttribute("style", "align-self: center; margin: 1em;")
    closeModelButton.innerHTML = "Close";
    closeModelButton.addEventListener("click", () => {
        modalBackground.style.display = "none";
        body.style.overflow = "initial";
    });

    spriteCheckbox4Label.appendChild(spriteCheckbox4);
    spriteCheckbox1Label.appendChild(spriteCheckbox1);
    spriteCheckbox2Label.appendChild(spriteCheckbox2);
    spriteCheckbox3Label.appendChild(spriteCheckbox3);
    spriteFilterSection.append(spriteCheckbox1Label, spriteCheckbox2Label, spriteCheckbox3Label, spriteCheckbox4Label);
    spriteHeader.append(spriteH3, spriteFilterSection, spriteDisplay);
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
    modalDiv.appendChild(modalBackground);

    cardDiv.addEventListener("click", () => {
        modalBackground.style.display = "block";
        body.style.overflow = "hidden";
    });
}
//*................................................end create card function .............................................

function displayNicely(string) {
    let noHyphens = string.replace("-", " ");
    noHyphens = noHyphens.replace("-", " ");
    let final = "";
    for (let i = 0; i < noHyphens.length; i++) {
        if (i === 0 || noHyphens.charAt(i - 1) === " ") {
            final += noHyphens.charAt(i).toUpperCase();
        } else {
            final += noHyphens.charAt(i);
        }
    } return final;
}

function whichLevel(para, cell) {
    if (para.move_learn_method.name === "level-up") {
        cell.innerHTML = displayNicely(para.move_learn_method.name) + " (lvl " + para.level_learned_at + ")";
    } else { 
        cell.innerHTML = displayNicely(para.move_learn_method.name);
    }
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

function findGen (spriteURL) {
    let  generation = [];
    for (let i = 82; i < spriteURL.length; i++) {
        generation.push(spriteURL[i])
        if (spriteURL[i] === "/") {
            break;
        }
    }
    generation.length = generation.length - 1;
    generation = generation.join("").replace("-", " ");
    return generation;
}

function checkboxHover (checkbox, label) {
    label.addEventListener("mouseenter", () => {
        if (checkbox.disabled === true) {
            label.setAttribute("style", "background-color: #dc7475; cursor: not-allowed;")
            checkbox.style.cursor = "not-allowed";
        } else {
            label.setAttribute("style", "background-color: #dc7475; cursor: pointer");
        }
    });
    label.addEventListener("mouseleave", () => {
        if (checkbox.disabled === true) {
            label.setAttribute("style", "background-color: #dc7475; cursor: not-allowed;");
            checkbox.style.cursor = "not-allowed";
        } else {
            label.setAttribute("style", "background-color: #fc8485; cursor: initial;");
        }
    });
}