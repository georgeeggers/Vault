import { appState } from "./appState.svelte"
import { addNotification } from "./appUtils.svelte"
import { getSongPath, type SongContainer } from "./songUtils.svelte"

export type Queue = {
    data: SongContainer[]
}

export type HowlInstance = {
    howl: Howl | null,
    songData: SongContainer,
    duration: number,
    loaded: boolean,
}

export type Player = {
    songContainer1: HowlInstance | null,
    songContainer2: HowlInstance | null,
    currentSong: Howl | null,
    selectedSong: boolean,
    progress: number,
    duration: number,
    sliderProgress: number,
    playing: boolean,
    volume: number,
    intervalID: number,
}

const getHowlContainer = (song: SongContainer) => {
    const howlContainer: HowlInstance = {
        howl: null,
        songData: song,
        duration: 0,
        loaded: false,
    }

    const howl = new Howl({
        src: [getSongPath(song)],
        volume: appState.player.volume
    }).on('load', () => {
        howlContainer.duration = howl.duration();
        // howlContainer.loaded = true;
        howlContainer.howl = howl;
    });

    return howlContainer;
}

export const loadSong = (song: SongContainer) => {
    // selectedSong being true indicates the app is playing song 2, and false is song 1. Switch it here because we're preloading

    // these conditionals ensure that null space is replaced first
    if(!appState.player.songContainer1){
        appState.player.songContainer1 = getHowlContainer(song);
    } else if (!appState.player.songContainer2){
        appState.player.songContainer2 = getHowlContainer(song);
    } else {
        if(appState.player.selectedSong){
            appState.player.songContainer1 = getHowlContainer(song);
        } else {
            appState.player.songContainer2 = getHowlContainer(song);
        }
    }
}

export const getSelectedSong = () => {
    return appState.player.selectedSong ? appState.player.songContainer2 : appState.player.songContainer1;
}

export const stopSong = () => {
    appState.player.playing = false;
    if(appState.player.currentSong){
        appState.player.currentSong.stop();
        clearInterval(appState.player.intervalID);
    }
}

export const playSong = () => {
    if(appState.player.currentSong){
        appState.player.playing = true;
        appState.player.currentSong.seek(appState.player.sliderProgress / 100);
        appState.player.currentSong.play();
        startPlaybarTracking();
    }
}

export const playPause = () => {
    console.log("Test");
    if(appState.player.playing){
        stopSong();
    } else {
        playSong();
    }
}

export const startPlaybarTracking = () => {
    if(appState.player.currentSong){
        appState.player.duration = appState.player.currentSong.duration();
        appState.player.progress = appState.player.currentSong.seek();
        appState.player.intervalID = setInterval(() => {
            if(appState.player.currentSong){
                appState.player.progress = appState.player.currentSong.seek();
                appState.player.sliderProgress = appState.player.progress * 100;
            }
        }, 1000);
    }
}

export const stopPlaybarTracking = () => {
    clearInterval(appState.player.intervalID);
}

export const formatSeconds = (input: number) => {
    input = Math.round(input);
    const seconds = input % 60;
    input -= seconds;
    return `${input / 60}:${seconds <= 9 ? `0${seconds}` : seconds}`
}

export const seek = (e: any) => {
    stopPlaybarTracking();
    appState.player.progress = appState.player.sliderProgress / 100;
}

export const stopSeek = (e: any) => {
    if(appState.player.currentSong){
        appState.player.currentSong.seek(appState.player.sliderProgress / 100);
        startPlaybarTracking();
    }
}

export const selectNext = () => {
    appState.player.selectedSong = !appState.player.selectedSong;

}

export const selectSong = (instance: HowlInstance | null) => {
    if(instance){
        if(instance.loaded){
            appState.player.currentSong = instance.howl;
            appState.player.duration = instance.duration;
            appState.player.progress = 0;
            appState.player.sliderProgress = 0;
        } else {
            let retries = 50;
            let retryID = setInterval(() => {
                console.log("Not loaded!");
                if(instance.loaded){
                    appState.player.currentSong = instance.howl;
                    appState.player.duration = instance.duration;
                    appState.player.progress = 0;
                    appState.player.sliderProgress = 0;
                    clearInterval(retryID);
                    return;
                } else {
                    retries--;
                    if(retries == 0){
                        addNotification("Song did not load in a reasonable time :(", "fail");
                        clearInterval(retryID);
                        return;
                    }
                }
            }, 100)
        }

    }
}


