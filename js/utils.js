export function createPanel(name, text, heading = "h3") {
    const newPanel = document.createElement("section")
    newPanel.className = "panel fade"
    newPanel.style = "overflow: initial"

    const panelName = document.createElement(heading)
    panelName.className = "underlined"
    panelName.textContent = name

    const panelText = document.createElement("p")
    panelText.style = "font-size: .8em"
    panelText.textContent = text

    // Assemble the created elements
    newPanel.appendChild(panelName)
    newPanel.appendChild(panelText)

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
        if (objectGetter() !== undefined) {
            resolve()
        }
        else {
            setTimeout(_exec.bind(this, resolve, reject), rate)
        }
    }
    return new Promise(_exec)
}