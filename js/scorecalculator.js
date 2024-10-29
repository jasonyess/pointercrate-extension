import { clearErrorFrame, createMainContainer, getScore, createPanel, createInput, waitForObject, createInfoBlock } from "./utils.js"

function createDemonSelectionList(demons, onSelect) {
    const listWrapper = document.createElement("div")
    listWrapper.style = "min-height: 400px; position: relative; flex-grow: 1;"

    const selectionList = document.createElement("ul")
    selectionList.className = "selection-list"
    selectionList.style = "position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"

    demons.forEach(demon => {
        let listItem = document.createElement("li")
        listItem.className = "white hover"
        listItem.setAttribute("data-id", demon.id)
        listItem.setAttribute("data-position", demon.position)

        let positionText = document.createElement("b")
        positionText.textContent = `#${demon.position} `

        let scoreText = document.createElement("i")
        scoreText.style = "color: #444; padding-left: 5px; font-size: 70%; font-variant: small-caps;"
        scoreText.textContent = getScore(100, demon.position, demon.requirement).toFixed(2)

        listItem.appendChild(positionText)
        listItem.innerHTML += demon.name
        listItem.appendChild(scoreText)

        listItem.addEventListener("click", () => {
            onSelect(demon)
        })

        selectionList.appendChild(listItem)
    })

    listWrapper.appendChild(selectionList)
    return listWrapper
}

function createDemonsContainer(onSelect) {
    const container = document.createElement("div")
    container.style = "min-width: 35%;"

    // fetch main list demons
    fetch("https://pointercrate.com/api/v2/demons/listed?limit=75")
        .then(response => response.json())
        .then(demons => {
            let demonSelectionList = createDemonSelectionList(demons, onSelect)
            demonSelectionList.id = "mainlist-demons"
            container.appendChild(demonSelectionList)
        })

    // fetch extended list demons
    fetch("https://pointercrate.com/api/v2/demons/listed?limit=75&after=75")
        .then(response => response.json())
        .then(demons => {
            waitForObject(() => document.getElementById("mainlist-demons")) // make sure list of mainlists are created first
                .then(() => {
                    container.appendChild(createDemonSelectionList(demons, onSelect))
                })
        })

    return container
}

function createDemonItem(demon, onProgressChange, onDelete) {
    let score = getScore(100, demon.position, demon.requirement)

    let demonItem = document.createElement("li")
    demonItem.className = "flex"
    demonItem.style = "justify-content: space-between; align-items: center; min-height: 40px;"
    demonItem.setAttribute("data-score", score)
    
    // demon info elements
    let demonInfoContainer = document.createElement("div")
    demonInfoContainer.className = "flex"
    demonInfoContainer.style = "width: 60%; align-items: center;"

    let demonInfoPosition = document.createElement("b")
    demonInfoPosition.style = "max-width: 50px;"
    demonInfoPosition.textContent = `#${demon.position} `

    let demonInfoScore = document.createElement("i")
    demonInfoScore.textContent = score.toFixed(2)
    demonInfoScore.style = "font-size: 80%; right: 0; text-align: right;"

    demonInfoContainer.appendChild(demonInfoPosition)
    demonInfoContainer.innerHTML += demon.name
    demonInfoContainer.appendChild(demonInfoScore)

    // selection edit elements
    let controlsContainer = document.createElement("div")
    controlsContainer.className = "flex"
    controlsContainer.style = "min-height: 40px;"

    let controlsProgress = createInput("number", "progress", "100", {min: demon.requirement, max: 100})
    controlsProgress.style = "max-width: 100px;"
    controlsProgress.querySelector("input").value = 100
    controlsProgress.querySelector("input").addEventListener("focusout", (event) => {
        event.currentTarget.value = Math.round(event.currentTarget.value)
        let value = Number(event.currentTarget.value)

        if (value < demon.requirement) {
            event.currentTarget.value = demon.requirement
        }
        else if (value > 100) {
            event.currentTarget.value = 100
        }
        if (value < 100 && demon.position > 75) {
            event.currentTarget.value = 100
        }

        score = getScore(event.currentTarget.value, demon.position, demon.requirement)
        demonInfoScore.textContent = score.toFixed(2)
        demonItem.setAttribute("data-score", score)

        onProgressChange()
    })

    let controlsDelete = document.createElement("span")
    controlsDelete.className = " plus cross hover"
    controlsDelete.addEventListener("click", () => onDelete(demon))

    controlsContainer.appendChild(controlsProgress)
    controlsContainer.appendChild(controlsDelete)

    // assemble containers
    demonItem.appendChild(demonInfoContainer)
    demonItem.appendChild(controlsContainer)

    return demonItem
}

function createSelectionsList() {
    const listWrapper = document.createElement("div")
    listWrapper.id = "selected-demons"
    listWrapper.style = "height: 600px; position: relative; flex-grow: 1;"

    const selectionsList = document.createElement("ul")
    selectionsList.style = "border: 1px solid #999; margin: 10px 0; overflow-y: scroll; height: 100%;"

    listWrapper.appendChild(selectionsList)
    return listWrapper
}

function createSelectionsResults() {
    const container = document.createElement("div")
    container.id = "selection-results"
    container.className = "flex space"
    container.style = "margin-top: 15px;"

    const scoreInfo = createInfoBlock("Demonlist score", "0", "demonlist-score")
    const rankInfo = createInfoBlock("Demonlist rank", "N/A", "demonlist-rank")

    container.appendChild(scoreInfo)
    container.appendChild(rankInfo)
    return container
}

function updateSelectionsResults(selectionsContainer) {
    const selectionsList = selectionsContainer.querySelector("#selected-demons").querySelector("ul")
    const resultsContainer = selectionsContainer.querySelector("#selection-results")

    const scoreInfo = resultsContainer.querySelector("#demonlist-score")
    const rankInfo = resultsContainer.querySelector("#demonlist-rank")

    let score = 0
    selectionsList.querySelectorAll("li").forEach(element => {
        score += Number(element.getAttribute("data-score"))
    })
    console.log(score)
    scoreInfo.textContent = score.toFixed(2)

    // demonlist rank logic, need to optimize requests
    // idea: optimize this code it's so dumb
    let baseQuery // base `after` query data
    if (score >= 1100) { // 1 - 100
        baseQuery = 0
    }
    else if (score >= 650) { // >101
        baseQuery = 100
    }
    else if (score >= 450) { // >201
        baseQuery = 200
    }
    else if (score >= 320) { // >301
        baseQuery = 300
    }
    else if (score >= 250) { // >401
        baseQuery = 400
    }
    else if (score >= 150) { // >601
        baseQuery = 600
    }
    else if (score >= 100) { // >801
        baseQuery = 800
    }
    else if (score >= 90) { // >1101
        baseQuery = 1100
    }
    else if (score >= 70) { // >1201
        baseQuery = 1200
    }
    else if (score >= 50) { // >1401
        baseQuery = 1400
    }
    else if (score >= 40) { // >1601
        baseQuery = 1600
    }
    else if (score >= 30) { // >1701
        baseQuery = 1700
    }
    else if (score >= 20) { // >1901
        baseQuery = 1900
    }
    else { // 2601 to -
        baseQuery = 2600
    }

    getDemonlistRank(score, baseQuery, (rank) => {
        rankInfo.textContent = rank
    })
}

function getDemonlistRank(score, baseQuery, callback) {
    if (score == 0) {
        callback("N/A")
        return
    }
    // this might be the worst piece of code i have ever written
    fetch(`https://pointercrate.com/api/v1/players/ranking/?after=${baseQuery}&limit=100`)
            .then(response => response.json())
            .then(players => {
                if (players.length == 0) {
                    fetch(`https://pointercrate.com/api/v1/players/ranking/?after=${baseQuery - 100}&limit=100`)
                        .then(response => response.json())
                        .then(players => {
                            callback(players[players.length - 1].rank + 1)
                        })
                }

                let maxScore = players[0].score
                let minScore = players[players.length - 1].score
                console.log(maxScore, minScore)

                if (score > maxScore) { // the score is too high
                    if (baseQuery == 0) {
                        callback(1)
                        return
                    }
                    baseQuery -= 100
                    console.log("reduce", baseQuery)
                    getDemonlistRank(score, baseQuery, callback)
                    return
                }
                else if (score < minScore) { // the score is too low
                    baseQuery += 100
                    console.log("increase", baseQuery)
                    getDemonlistRank(score, baseQuery, callback)
                    return
                }
                else { // the score falls between the min and max of the players array, meaning we can get the exact rank
                    console.log(score, maxScore, score > maxScore)
                    console.log(score, minScore, score < minScore)
                    if (score == minScore) {
                        callback(players[0].rank)
                        return
                    }
                    if (score == maxScore) {
                        callback(players[players.length - 1].rank)
                        return
                    }

                    for (let i = 1; i < players.length - 1; i++) {
                        if (score == players[i].score) {
                            callback(players[i].rank)
                            return
                        }
                        if (score < players[i - 1].score && score > players[i + 1].score) {
                            callback(players[i - 1].rank + 1)
                            return
                        }
                    }
                }
            })
}

function createSelectionsContainer() {
    const container = document.createElement("div")
    container.style = "width: 65%; gap: 15px;"

    const selectionsList = createSelectionsList()
    const selectionsResults = createSelectionsResults()

    container.appendChild(selectionsList)
    container.appendChild(selectionsResults)
    
    return container
}

function main() {
    clearErrorFrame()
    document.title = "Score Calculator"

    const mainContainer = createMainContainer()
    const contentContainer = mainContainer.querySelector("main")

    const contentPanel = createPanel("Score Calculator", undefined, "h2")
    const panelContentContainer = document.createElement("div")
    panelContentContainer.className = "flex"
    panelContentContainer.style = "gap: 10px;"

    let selectedDemons = []

    const selectionsContainer = createSelectionsContainer()
    const selectionsList = selectionsContainer.querySelector("ul")

    const demonSelectContainer = createDemonsContainer((demon) => {
        console.log("selected", demon.position, demon.name)
        if (!selectedDemons.find((selectedDemon) => selectedDemon.position == demon.position)) {
            selectedDemons.push(demon)

            let demonItem = createDemonItem(demon,
                () => { // onProgressChange
                    updateSelectionsResults(selectionsContainer)
                },
                () => { // onDelete
                    selectedDemons = selectedDemons.filter(selectedDemon => selectedDemon.position !== demon.position)
                    demonItem.remove()
                    updateSelectionsResults(selectionsContainer)
                }
            )
            selectionsList.appendChild(demonItem)
            updateSelectionsResults(selectionsContainer)
        }
    })

    // assembly of created elements
    panelContentContainer.appendChild(demonSelectContainer)
    panelContentContainer.appendChild(selectionsContainer)

    contentPanel.appendChild(panelContentContainer)
    contentContainer.appendChild(contentPanel)
    document.body.insertBefore(mainContainer, document.querySelector("footer"))
}

main()