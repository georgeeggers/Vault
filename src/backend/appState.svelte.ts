import type { Player } from "./playerUtils.svelte"
import type { Settings } from "./settings.svelte"
import type { PlayerProject } from "./sql.svelte"

export type AppState = {
    searchTerm: string,
    displayPlaybar: boolean,

    miniPlayer: boolean,
    player: Player,
    projects: PlayerProject[],
    showSearchResults: boolean,
    popupData: {
        popupShowing: boolean,
        popupType: string,
        canClosePopup: boolean
    },
}

export const appState: AppState = $state({
    searchTerm: "",
    displayPlaybar: true,
    miniPlayer: false,
    showSearchResults: false,
    player: {
        songContainer1: null,
        songContainer2: null,
        currentSong: null,
        selectedSong: false,
        sliderProgress: 0,
        progress: 0,
        duration: 0,
        playingID: "",
        playing: false,
        volume: 1.0,
        intervalID: -1,
        queueManager: {
            shuffle: false,
            currentQueue: [],
            shuffleQueue: [],
            recentlyPlayed: [],
        }
    },
    projects: [],
    popupData: {
        popupShowing: false,
        popupType: "createNew",
        canClosePopup: true,
    },
})

export const openPopup = (popup: string) => {
    appState.showSearchResults = false;
    appState.popupData.popupType = popup;
    appState.popupData.popupShowing = true;
}

export const closePopup = () => {
    if(appState.popupData.canClosePopup){
        appState.popupData.popupShowing = false;
    }
}

export const lockPopup = () => {
    appState.popupData.canClosePopup = false;
}

export const unlockPopup = () => {
    appState.popupData.canClosePopup = true;
}