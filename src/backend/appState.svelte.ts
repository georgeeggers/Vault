import type { Player } from "./playerUtils.svelte"

export type AppState = {
    searchTerm: string,
    displayPlaybar: boolean,
    player: Player
}

export const appState: AppState = $state({
    searchTerm: "",
    displayPlaybar: true,
    player: {
        songContainer1: null,
        songContainer2: null,
        currentSong: null,
        selectedSong: false,
        sliderProgress: 0,
        progress: 0,
        duration: 0,
        playing: false,
        volume: .25,
        intervalID: -1
    }
})