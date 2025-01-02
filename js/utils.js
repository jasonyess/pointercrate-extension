export function createPanel(name, text, heading = "h3") {
    const newPanel = document.createElement("section")
    newPanel.className = "panel fade"
    newPanel.style = "overflow: initial"

    if (name !== undefined) {
        const panelName = document.createElement(heading)
        panelName.className = (heading == "h1" || heading == "h2") ? "underlined pad" : "underlined"
        panelName.textContent = name
        newPanel.appendChild(panelName)
    }

    if (text !== undefined) {
        const panelText = document.createElement("p")
        panelText.style = "font-size: .8em"
        panelText.textContent = text
        newPanel.appendChild(panelText)
    }

    return newPanel
}

export function createCheckbox(name, id, checked) {
    const cbContainer = document.createElement("div")
    cbContainer.className = "cb-container flex no-stretch"
    cbContainer.style = "margin-bottom: 10px"

    const cbName = document.createElement("i")
    cbName.textContent = name

    const cbInput = document.createElement("input")
    cbInput.id = id
    cbInput.type = "checkbox"

    if (checked == true) {
        cbInput.checked = true
    }

    const cbCheckmark = document.createElement("span")
    cbCheckmark.className = "checkmark"

    // Assemble the created elements
    cbContainer.appendChild(cbName)
    cbContainer.appendChild(cbInput)
    cbContainer.appendChild(cbCheckmark)

    return cbContainer
}

// wtf am i doing
// this lacks filtering but i dont need it for now
export function createDropdown(items, defaultIndex, id) {
    items = items.slice()

    const container = document.createElement("div")
    container.className = "dropdown-menu js-search no-stretch"
    container.id = id

    const inputWrapper = document.createElement("div")
    const input = document.createElement("input")
    input.value = items[defaultIndex]
    input.type = "text"
    input.autocomplete = "off"
    input.style = "color: #444446; font-weight: bold;"
    input.setAttribute("data-default", items[defaultIndex])

    const itemsWrapper = document.createElement("div")
    itemsWrapper.className = "menu"
    itemsWrapper.style = "opacity: 0.95; display: none;"

    // Dropdown logic and list item initialization goes here
    let selected = items[defaultIndex]

    const createItem = (value, isDefault) => {
        let item = document.createElement("li")
        item.className = isDefault ? "white underlined hover" : "white hover"
        item.setAttribute("data-value", value)
        item.setAttribute("data-display", value)

        let itemValueText = document.createElement("b")
        itemValueText.textContent = value

        item.appendChild(itemValueText)

        // Change selected variable when item is clicked
        // TODO: this will dispatch the `selecteditemchange` again, even if the value is the same. fix this
        item.addEventListener("click", () => {
            selected = item.getAttribute("data-value")
            input.value = selected
            input.dispatchEvent(new Event("selecteditemchange")) // `selecteditemchange` event will alert any event listeners when a new value was selected (the name could be better)
        })

        return item
    }

    const itemsList = document.createElement("ul")
    itemsList.appendChild(createItem(items[defaultIndex], true))
    items.splice(defaultIndex, 1)

    items.forEach(item => {
        itemsList.appendChild(createItem(item))
    });

    let dropdownFocused = false // spamming the dropdown wont break it
    input.addEventListener("focus", () => {
        dropdownFocused = true
        itemsWrapper.style = "opacity: 0.95; display: block;"
        input.value = ""
    })
    input.addEventListener("focusout", () => {
        dropdownFocused = false
        itemsWrapper.style = "opacity: 0; display: block; transition: opacity 0.5s ease;"
        input.value = selected
        setTimeout(() => {
            if (dropdownFocused == false) {
                itemsWrapper.style = "display: none;"
            }
        }, 500);
    })

    // Assemble the created elements
    inputWrapper.appendChild(input)
    itemsWrapper.appendChild(itemsList)

    container.appendChild(inputWrapper)
    container.appendChild(itemsWrapper)

    return container
}

export function waitForObject(objectGetter, rate = 10) {
    const _exec = (resolve, reject) => {
        let fetchedResult = objectGetter()
        if (fetchedResult !== undefined && fetchedResult !== null) {
            console.log(objectGetter())
            resolve()
        }
        else {
            setTimeout(_exec.bind(this, resolve, reject), rate)
        }
    }
    return new Promise(_exec)
}

export function clearErrorFrame() {
    document.getElementById("error").remove()
}

export function createMainContainer() {
    const mainContainer = document.createElement("div")
    mainContainer.className = "flex m-center container"

    const contentContainer = document.createElement("main")
    contentContainer.style = "max-width: 70%"

    const sideContainer = document.createElement("aside")
    sideContainer.style = "max-width: 30%"

    // Panels for the side container
    const brandPanel = createPanel("Pointercrate Pro", "This page is brought to you by Pointercrate Pro. Thank you for using the extension!", "h2")
    
    sideContainer.appendChild(brandPanel)

    // Main container
    mainContainer.appendChild(contentContainer)
    mainContainer.appendChild(sideContainer)

    return mainContainer
}

export function getScore(progress, position, requirement) {
    if (progress == 100) {
        if (55 < position && position <= 150) { // between 56 and 150
            return 1.039035131 * ((185.7 * Math.exp((-0.02715 * position))) + 14.84)
        }
        else if (35 < position && position <= 55) { // between 36 and 55
            return 1.0371139743 * ((212.61 * Math.pow(1.036, 1 - position)) + 25.071)
        }
        else if (20 < position && position <= 35) { // between 21 and 35
            return (((250 - 83.389) * Math.pow(1.0099685, 2 - position) - 31.152)) * 1.0371139743
        }
        else if (3 < position && position <= 20) { // between 4 and 20
            return ((326.1 * Math.exp((-0.0871 * position))) + 51.09) * 1.037117142
        }
        else { // between 1 and 3
            return (-18.2899079915 * position) + 368.2899079915
        }
    }
    else if (progress < requirement) {
        return 0
    }
    else {
        if (55 < position && position <= 150) { // between 56 and 150
            return 1.039035131 * ((185.7 * Math.exp((-0.02715 * position))) + 14.84) * (Math.exp(Math.log(5) * (progress - requirement) / (100 - requirement))) / 10
        }
        else if (35 < position && position <= 55) { // between 36 and 55
            return (1.0371139743 * ((212.61 * Math.pow(1.036, 1 - position)) + 25.071)) * (Math.exp(Math.log(5) * (progress - requirement) / (100 - requirement))) / 10
        }
        else if (20 < position && position <= 35) { // between 21 and 35
            return (((250 - 83.389) * Math.pow(1.0099685, 2 - position) - 31.152)) * 1.0371139743 * (Math.exp(Math.log(5) * (progress - requirement) / (100 - requirement))) / 10
        }
        else if (3 < position && position <= 20) { // between 4 and 20
            return (((326.1 * Math.exp((-0.0871 * position))) + 51.09) * 1.037117142) * (Math.exp(Math.log(5) * (progress - requirement) / (100 - requirement))) / 10
        }
        else { // between 1 and 3
            return ((-18.2899079915 * position) + 368.2899079915) * (Math.exp(Math.log(5) * (progress - requirement) / (100 - requirement))) / 10
        }
    }
}

export function createInput(type, name, placeholder, details) { // the content of details varies depending on `type`
    const inputWrapper = document.createElement("span")
    inputWrapper.className = "form-input flex col"

    const input = document.createElement("input")

    input.type = type
    input.name = name
    input.placeholder = placeholder

    if (input.type == "number") {
        input.min = details.min
        input.max = details.max
    }

    inputWrapper.appendChild(input)
    return inputWrapper
}

export function createInfoBlock(name, text, id) {
    const container = document.createElement("span")

    const spanName = document.createElement("b")
    spanName.textContent = name

    const spanContent = document.createElement("span")
    spanContent.id = id
    if (text) { spanContent.textContent = text }

    container.appendChild(spanName)
    container.appendChild(document.createElement("br"))
    container.appendChild(spanContent)
    return container
}

export function createInfoGroup(infoBlocks) {
    const container = document.createElement("div")
    container.className = "stats-container flex space"

    infoBlocks.forEach(infoBlock => {
        container.appendChild(infoBlock)
    })

    return container
}

export function createSelectionsList(id) {
    const listWrapper = document.createElement("div")
    listWrapper.id = id
    listWrapper.style = "height: 600px; position: relative; flex-grow: 1;"

    const selectionsList = document.createElement("ul")
    selectionsList.className = "selection-list"
    selectionsList.style = "border: 1px solid #999; margin: 10px 0; overflow-y: scroll; height: 100%;"

    listWrapper.appendChild(selectionsList)
    return listWrapper
}

export function createDemonNode(demon, video, progress) { // demon should be {position, id, name}
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
    nodeLink.textContent = demon.name + (progress ? ` (${progress}%)` : "")

    if (progress) {
        console.log(demon, progress)
    }

    node.appendChild(nodeLink)

    return node
}

export function createSelectionListItem(bold, regular, small) {
    let listItem = document.createElement("li")
    listItem.className = "white hover"

    let boldText = document.createElement("b")
    boldText.style = "pointer-events: none;"
    boldText.textContent = bold

    let smallText = document.createElement("i")
    smallText.style = "color: #444; padding-left: 5px; font-size: 70%; font-variant: small-caps; pointer-events: none;"
    smallText.textContent = small

    listItem.appendChild(boldText)
    listItem.innerHTML += regular
    listItem.appendChild(smallText)

    return listItem
}

export function addStatsViewerTab(name, href) {
    const a = document.createElement("a")
    a.className = "button white hover no-shadow"
    a.href = href

    const b = document.createElement("b")
    b.textContent = name

    a.appendChild(b)
    document.getElementById("statsviewers").appendChild(a)
}