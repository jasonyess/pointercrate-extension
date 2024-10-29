import { waitForObject, createPanel, clearErrorFrame, createMainContainer } from "./utils.js"

const placementProjections = [
    "Projected to be main list",
    "Projected to be extended list",
    "Unknown projection, could be main or extended",
    "Unknown projection, could be extended or not list worthy"
]

function generateDemons(demons, container) {
    const createVideoElement = (video, thumbnail) => {
        let videoThumbnail = document.createElement("div")
        videoThumbnail.style = `position: relative; height: 116.165px; background-image: url("${thumbnail}"); max-width: 30%; min-width: 30%; background-size: cover;`
        videoThumbnail.setAttribute("data-property", "background-image")
        videoThumbnail.setAttribute("data-property-value", `url('${thumbnail}')`)

        return videoThumbnail
    }

    const createInfoElement = (name, placement_date, projection, video) => {
        const createSubheading = (text) => {
            let subheading = document.createElement("h3")
            subheading.style = "text-align: left"

            let subheadingText = document.createElement("i")
            subheadingText.textContent = text

            subheading.appendChild(subheadingText)
            return subheading
        }

        let infoContainer = document.createElement("div")
        infoContainer.style = "padding-left: 15px"

        let demonName = document.createElement("h2")
        demonName.style = "text-align: left; margin-bottom: 0px;"

        let demonVideoAnchor = document.createElement("a")
        demonVideoAnchor.href = video
        demonVideoAnchor.innerText = name

        demonName.appendChild(demonVideoAnchor)

        let demonPlacementTime = createSubheading(`To be placed ${placement_date}`)
        let demonProjection = createSubheading(placementProjections[projection])

        // Assemble the created elements
        infoContainer.appendChild(demonName)
        infoContainer.appendChild(demonPlacementTime)
        infoContainer.append(demonProjection)

        return infoContainer
    }

    demons.forEach(demon => {
        let demonContainer = document.createElement("section")
        demonContainer.className = "panel fade"
        demonContainer.style = "overflow: hidden"

        let contentWrapper = document.createElement("div")
        contentWrapper.className = "flex"
        contentWrapper.style = "align-items: center"

        let videoElement = createVideoElement(demon.video, demon.thumbnail)
        let infoElement = createInfoElement(demon.name, demon.placement_date, demon.projection, demon.video)

        // Assemble the created elements
        contentWrapper.appendChild(videoElement)
        contentWrapper.appendChild(infoElement)

        demonContainer.appendChild(contentWrapper)
        container.appendChild(demonContainer)
    })
}

function main() {
    clearErrorFrame()
    document.title = "Pending Demons"

    const mainContainer = createMainContainer()
    const demonListContainer = mainContainer.querySelector("main")

    fetch("https://raw.githubusercontent.com/jasonyess/pointercrate-pro/main/live/pending_demons.json", {
        cache: "no-store"
    }) // Fetch JSON of pending demons from the github repo
        .then(response => response.json())
        .then(data => {
            console.log(data)
            generateDemons(data, demonListContainer)
        })

    document.body.insertBefore(mainContainer, document.querySelector("footer"))
}

main()