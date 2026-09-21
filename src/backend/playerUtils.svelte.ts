import { Shuffle } from "@lucide/svelte"
import { appState } from "./appState.svelte"
import { addNotification } from "./appUtils.svelte"
import { debug } from "./dev.svelte"
import { type PlayerSongContainer } from "./sql.svelte"
import { replace } from "svelte-spa-router"
import { loadManager, loadNextSongsFromQueue } from "./howlManagers.svelte"

export type QueueManager = {
    currentQueue: PlayerSongContainer[],
    shuffleQueue: PlayerSongContainer[],
    recentlyPlayed: PlayerSongContainer[],
    shuffle: boolean,
}

export type Player = {
    progress: number,
    duration: number,
    sliderProgress: number,
    volume: number,
    intervalID: number,
    queueManager: QueueManager
}

export const formatSeconds = (input: number, mode: boolean = false) => {
    input = Math.round(input);
    const seconds = input % 60;
    input -= seconds;
    if(mode){
        return `${input / 60}m ${seconds}s`
    }
    return `${input / 60}:${seconds <= 9 ? `0${seconds}` : seconds}`

}


export const startPlaybarTracking = () => {
    if(loadManager.currentSong){
        if(loadManager.currentSong.howlInstance?.howl){
            appState.player.duration = loadManager.currentSong.howlInstance.howl.duration();
            appState.player.progress = loadManager.currentSong.howlInstance.howl.seek();
            appState.player.intervalID = setInterval(() => {
                if(loadManager.currentSong){
                    if(loadManager.currentSong.howlInstance?.howl){
                        appState.player.progress = loadManager.currentSong.howlInstance.howl.seek();
                        appState.player.sliderProgress = appState.player.progress * 100;
                    }
                }
            }, 1000);
        }
 
    }
}

export const stopPlaybarTracking = () => {
    clearInterval(appState.player.intervalID);
}

export const seek = (e: any) => {
    stopPlaybarTracking();
    appState.player.progress = appState.player.sliderProgress / 100;
}

export const stopSeek = (e: any) => {
    if(loadManager.currentSong){
        if(loadManager.currentSong.howlInstance?.howl){
            loadManager.currentSong.howlInstance.howl.seek(appState.player.sliderProgress / 100);
            if(loadManager.playing){
                startPlaybarTracking();
            }
        }
    }
}

export const shuffle = (queueData: PlayerSongContainer[]) => {
  for (let i = queueData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queueData[i], queueData[j]] = [queueData[j], queueData[i]];
  }
  return queueData;
}   

export const toggleShuffle = () => {
    appState.player.queueManager.shuffle = !appState.player.queueManager.shuffle;
    if(appState.player.queueManager.shuffle){
        appState.player.queueManager.shuffleQueue = shuffle([...appState.player.queueManager.currentQueue]);
    }
}

export const toggleMiniplayer = () => {
    appState.miniPlayer = !appState.miniPlayer;
    if(appState.miniPlayer){
        replace("/miniplayer");
    } else {
        replace("/")
    }
}