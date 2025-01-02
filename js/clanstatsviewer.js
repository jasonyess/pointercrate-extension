import { clearErrorFrame, createMainContainer, createSelectionsList, createInfoGroup, createInfoBlock, createDemonNode, createSelectionListItem, getScore, addStatsViewerTab } from "./utils";

function updateSelectedClan(clan, score, rank) {
    document.getElementById("viewer-welcome").style = "display: none;"
    document.getElementById("viewer-content").style = "display: block;"

    document.getElementById("clan-name").textContent = `[${clan}]`
    document.getElementById("clan-score").textContent = Number(score).toFixed(2)
    document.getElementById("clan-rank").textContent = rank
    document.getElementById("players").innerHTML = ""

    fetch(`https://raw.githubusercontent.com/jasonyess/pointercrate-pro/main/live/clans/${clan}.json`, {
        cache: "no-store"
    }) // Fetch JSON of pending demons from the github repo
        .then(response => response.json())
        .then(data => {
            console.log(data)

            let hardest = null
            let hardestPosition = 99999

            let main = 0
            let extended = 0
            let legacy = 0

            let completed = []
            let published = []
            let created = []
            let progress = []

            data.forEach(player => {
                const playerTooltip = document.createElement("span")
                playerTooltip.style = "font-size: 90%;"
                playerTooltip.textContent = player.name.slice(clan.length + 2)

                document.getElementById("players").appendChild(playerTooltip)
                document.getElementById("players").innerHTML += " - "

                player.published.forEach(publishedDemon => {
                    published.push(publishedDemon)
                })

                player.created.forEach(createdDemon => {
                    if (!created.some(idkwhattonamethis => idkwhattonamethis.id == createdDemon.id)) {
                        created.push(createdDemon)
                    }
                })

                player.records.forEach(record => {
                    if (!completed.some(completedDemon => completedDemon.id == record.demon.id)) { // check if it's already in the completed list
                        if (record.progress == 100) {
                            completed.push(record.demon)
    
                            if (record.demon.position < hardestPosition) {
                                hardest = record.demon
                                hardestPosition = record.demon.position
                            }
    
                            if (record.demon.position <= 75) {
                                main += 1
                            }
                            else if (record.demon.position <= 150) {
                                extended += 1
                            }
                            else {
                                legacy += 1
                            }
                        }
                        else {
                            let dupeProgress = progress.some(progressRecord => progressRecord.demon.id == record.demon.id)

                            if (!dupeProgress) { progress.push(record) }
                            else if (dupeProgress.progress < record.progress) {
                                progress.splice(progress.indexOf(dupeProgress), 1)
                                progress.push(record)
                            }
                        }
                    }
                })
            })

            document.getElementById("clan-players").textContent = data.length
            document.getElementById("clan-stats").textContent = `${main} Main, ${extended} Extended, ${legacy} Legacy`
            
            document.getElementById("clan-hardest").innerHTML = ""
            if (hardestPosition <= 75) {
                let b = document.createElement("b")
                b.textContent = hardest.name
                document.getElementById("clan-hardest").appendChild(b)
            }
            else if (hardestPosition > 150 && hardestPosition < 99999) {
                let i = document.createElement("i")
                i.textContent = hardest.name
                document.getElementById("clan-hardest").appendChild(i)
            }
            else {
                document.getElementById("clan-hardest").textContent = hardest ? hardest.name : "N/A"
            }

            if (completed.length > 0) {
                generateTooltips(document.getElementById("beaten"), completed)
            } else { document.getElementById("beaten").textContent = "N/A" }
            
            if (created.length > 0) {
                generateTooltips(document.getElementById("created"), created)
            } else { document.getElementById("created").textContent = "N/A" }

            if (progress.length > 0) {
                generateTooltips(document.getElementById("progress"), null, progress)
            } else { document.getElementById("progress").textContent = "N/A" }

            if (document.getElementById("players").lastChild) {
                document.getElementById("players").removeChild(document.getElementById("players").lastChild)
            }
        })
}

function loadClanSelectionList(ul) {
    fetch("https://raw.githubusercontent.com/jasonyess/pointercrate-pro/main/live/clans.json", {
        cache: "no-store"
    }) // Fetch JSON of pending demons from the github repo
        .then(response => response.json())
        .then(data => {
            console.log(data)

            const sortedData = Object.entries(data).sort((a, b) => a[1].position - b[1].position);
            
            for (const [clanName, clanData] of sortedData) {
                const li = createSelectionListItem(`#${clanData.position} `, clanName, clanData.score.toFixed(2))
                li.setAttribute("data-clan", clanName)
                li.setAttribute("data-score", clanData.score)
                li.setAttribute("data-rank", clanData.position)
                li.addEventListener("click", (event) => {
                    updateSelectedClan(event.target.getAttribute("data-clan"), event.target.getAttribute("data-score"), event.target.getAttribute("data-rank"))
                })
                ul.appendChild(li)
            }
        })
}

function generateTooltips(container, demons, records) { // demon should be {position, id, name}, records is optional and are used when progress < 100
    container.innerHTML = ""

    if (demons) {
        demons.forEach(demon => {
            let demonNode = createDemonNode(demon)
            container.appendChild(demonNode)
            container.innerHTML += " - "
        })
    }

    if (records) {
        records.forEach(record => {
            let demonNode = createDemonNode(record.demon, null, record.progress)
            container.appendChild(demonNode)
            container.innerHTML += " - "
        })
    }
    
    if (container.lastChild !== null) {
        container.removeChild(container.lastChild)
    }
}

function createStatsViewerContent() {
    const container = document.createElement("div")
    container.className = "flex viewer"

    const clansList = createSelectionsList("clan-selections")

    const welcome = document.createElement("p")
    welcome.className = "viewer-welcome"
    welcome.id = "viewer-welcome"
    welcome.textContent = "Click on a clan's name on the left to get started!"
    welcome.style = "display: block;"

    const contentWrapper = document.createElement("div")
    contentWrapper.className = "viewer-content"
    contentWrapper.id = "viewer-content"
    contentWrapper.style = "display: none;"

    const contentContainer = document.createElement("div")
    contentContainer.className = "flex col"

    const clanName = document.createElement("h3")
    clanName.id = "clan-name"
    clanName.style = "font-size: 1.4em; overflow: hidden;"
    clanName.textContent = "[CLAN]"

    contentContainer.appendChild(clanName)
    contentContainer.appendChild(
        createInfoGroup([
            createInfoBlock("Demonlist rank", "12", "clan-rank"),
            createInfoBlock("Players", "4", "clan-players"),
            createInfoBlock("Demonlist score", "473.51", "clan-score"),
        ])
    )
    contentContainer.appendChild(
        createInfoGroup([
            createInfoBlock("Demonlist stats", "0 Main, 0 Extended, 0 Legacy", "clan-stats"),
            createInfoBlock("Hardest demon", "N/A", "clan-hardest"),
        ])
    )

    const completedWrapper = document.createElement("div")
    completedWrapper.className = "stats-container flex space"

    const completedContainer = createInfoBlock("Demons completed", null, "beaten")
    completedWrapper.appendChild(completedContainer)

    const createdWrapper = document.createElement("div")
    createdWrapper.className = "stats-container flex space"

    const createdContainer = createInfoBlock("Demons created", null, "created")
    createdWrapper.appendChild(createdContainer)

    const progressWrapper = document.createElement("div")
    progressWrapper.className = "stats-container flex space"

    const progressContainer = createInfoBlock("Progress on", null, "progress")
    progressWrapper.appendChild(progressContainer)

    const playersWrapper = document.createElement("div")
    playersWrapper.className = "stats-container flex space"

    const playersContainer = createInfoBlock("Players", null, "players")
    playersWrapper.appendChild(playersContainer)

    contentContainer.appendChild(completedWrapper)
    contentContainer.appendChild(createdWrapper)
    contentContainer.appendChild(progressWrapper)
    contentContainer.appendChild(playersWrapper)
    contentWrapper.appendChild(contentContainer)

    container.appendChild(clansList)
    container.appendChild(welcome)
    container.appendChild(contentWrapper)
    return container
}

function createStatsViewerPanel() {
    const container = document.createElement("section")
    container.className = "panel fade"
    container.id = "statsviewer"

    const heading = document.createElement("h2")
    heading.className = "underlined pad"
    heading.textContent = "Stats Viewer"

    const content = createStatsViewerContent()

    container.appendChild(heading)
    container.appendChild(content)
    return container
}

function loadStatsViewer() {
    const mainContainer = createMainContainer()

    const statsViewer = createStatsViewerPanel()

    mainContainer.querySelector("main").appendChild(statsViewer)
    document.body.insertBefore(mainContainer, document.body.querySelector("footer"))
}

function createStatsViewerNavbar() {
    const nav = document.createElement("nav")
    nav.className = "flex wrap m-center fade"
    nav.id = "statsviewers"
    nav.style = "text-align: center;"

    document.body.insertBefore(nav, document.body.querySelector("footer"))
}

function main() {
    document.title = "Clan Stats Viewer"
    clearErrorFrame()

    createStatsViewerNavbar()
    addStatsViewerTab("Individual", "/demonlist/statsviewer/")
    addStatsViewerTab("Nations", "/demonlist/statsviewer/nations/")
    addStatsViewerTab("Clans", "/demonlist/statsviewer/clans/")

    // fetch main list demons
        fetch("https://pointercrate.com/api/v2/demons/listed?limit=75")
            .then(response => response.json())
            .then(demons => {
                window.mainList = demons;
            })
    
    loadStatsViewer()

    loadClanSelectionList(document.getElementById("clan-selections").querySelector("ul"))
}

main()