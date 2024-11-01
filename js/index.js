function editNavbar() {
    const navbar = document.querySelector("header").querySelector("nav")

    // Add link to Pending Demons page under Demonlist tab
    let demonlistTabGroup = navbar.querySelector("a[href=\"/demonlist/\"]").parentElement
    console.log(demonlistTabGroup)

    const demonlistDropdown = demonlistTabGroup.querySelector("ul")
    console.log(demonlistDropdown)
    
    const pendingDemonsListItem = document.createElement("li")
    const pendingDemonsAnchor = document.createElement("a")
    pendingDemonsAnchor.className = "white hover"
    pendingDemonsAnchor.textContent = "Pending Demons"
    pendingDemonsAnchor.href = "https://pointercrate.com/demonlist/pending/"
    pendingDemonsListItem.appendChild(pendingDemonsAnchor)

    // Score Calculator
    const scoreCalcListItem = document.createElement("li")
    const scoreCalcAnchor = document.createElement("a")
    scoreCalcAnchor.className = "white hover"
    scoreCalcAnchor.textContent = "Score Calculator"
    scoreCalcAnchor.href = "https://pointercrate.com/demonlist/scorecalculator/"
    scoreCalcListItem.appendChild(scoreCalcAnchor)

    demonlistDropdown.insertBefore(pendingDemonsListItem, demonlistDropdown.querySelector("a[href=\"/demonlist/?submitter=true\"]").parentElement)
    demonlistDropdown.appendChild(scoreCalcListItem)
}

function main() {
    editNavbar()
}

main()