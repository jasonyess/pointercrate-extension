import { createPanel, createDropdown, waitForObject } from "./utils.js"

function createSortingOptionsPanel() {
    const panelContainer = document.querySelector("aside.right")
    const newPanel = createPanel("Sorting Options", "The method of sorting a player's demons.")

    const sortingModeDropdown = createDropdown([
        "Alphabetical",
        "Position"
    ], 0, "demons-sort-dropdown")

    newPanel.appendChild(sortingModeDropdown)

    panelContainer.insertBefore(newPanel, panelContainer.firstChild)
}

function clearProfileDemons() {
    ["beaten", "created", "published", "verified"].forEach(category => {
        const categoryContainer = document.getElementById(category)
        categoryContainer.innerHTML = "" // clear all demon elements
    })
}

function createDemonNode(demon, video) {
    let node = document.createElement(
        demon.position <= 75 ? "b" // the demon is main list
        : demon.position <= 150 ? "span" // the demon is extended list
        : "i" // the demon is legacy
    )

    if (demon.position > 150) {
        node.style = "opacity: 0.5"
    }

    let nodeLink = document.createElement("a")
    nodeLink.href = video ?? `/demonlist/permalink/${demon.id}/`
    nodeLink.textContent = demon.name

    node.appendChild(nodeLink)

    return node
}

// TODO: clean up this code
function generateSortedDemons(container, records, demons) {
    if (records) {
        records.forEach(record => {
            let demonNode = createDemonNode(record.demon, record.video)
            container.appendChild(demonNode)
            container.innerHTML += " - "
        })
    }
    if (demons) {
        demons.forEach(demon => {
            let demonNode = createDemonNode(demon)
            container.appendChild(demonNode)
            container.innerHTML += " - "
        })
    }
    container.removeChild(container.lastChild)
}

// this code could use some cleaning
function sortProfileDemons(mode) {
    clearProfileDemons()
    if (mode == "Alphabetical") { 
        statsViewer.selectionListeners.splice(1, 1)
        statsViewer.onSelect(statsViewer.currentlySelected)
        setTimeout(() => statsViewer.addSelectionListener(() => individualSelectionListener(mode)), 50)
    }
    else if (mode == "Position") {
        let sortedRecords = statsViewer.currentObject.records.slice().filter(item => item.progress == 100 && item.status == "approved")
        sortedRecords.sort((a, b) => a.demon.position - b.demon.position)

        generateSortedDemons(document.querySelector("#beaten"), sortedRecords)
    }
}

function individualSelectionListener(mode) {
    waitForObject(() => (statsViewer._beaten.innerHTML)).then(() => {
        sortProfileDemons(mode)
    })
}

function main() {
    createSortingOptionsPanel()

    const sortDropdownInput = document.querySelector("#demons-sort-dropdown").querySelector("input")
    sortDropdownInput.addEventListener("selectchange", () => {
        sortProfileDemons(sortDropdownInput.value)
    })

    statsViewer.addSelectionListener(() => individualSelectionListener(sortDropdownInput.value))
}

waitForObject(() => (window.statsViewer)).then(() => {
    main()
})