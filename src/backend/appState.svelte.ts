import type { Player } from "./playerUtils.svelte"
import type { PlayerProject } from "./sql.svelte"

export type AppState = {
    searchTerm: string,
    displayPlaybar: boolean,
    popupShowing: boolean,
    popupType: "createNew",
    miniPlayer: boolean,
    player: Player,
    projects: PlayerProject[],
}

export const appState: AppState = $state({
    searchTerm: "",
    displayPlaybar: true,
    popupShowing: false,
    popupType: "createNew",
    miniPlayer: false,
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
    projects: []
})