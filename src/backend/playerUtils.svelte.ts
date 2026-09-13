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
    id: string,
}

export type Player = {
    songContainer1: HowlInstance | null,
    songContainer2: HowlInstance | null,
    currentSong: Howl | null,
    selectedSong: boolean,
    progress: number,
    duration: number,
    sliderProgress: number,
    playingID: string,
    playing: boolean,
    volume: number,
    intervalID: number,
}

const getHowlContainer = (song: SongContainer) => {
    const howlContainer: HowlInstance = $state({
        howl: null,
        songData: song,
        duration: 0,
        loaded: false,
        id: "howl_" + song.id
    });

    const howl = new Howl({
        src: [getSongPath(song)],
        volume: appState.player.volume
    }).on('load', () => {
        howlContainer.duration = howl.duration();
        howlContainer.loaded = true;
        console.log("Instance should be loaded");
        howlContainer.howl = howl;
    }).on('end', () => {
        selectNext();
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

export const stopSong = (playStatus: boolean = false) => {
    appState.player.playing = playStatus;
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

export const formatSeconds = (input: number, mode: boolean = false) => {
    input = Math.round(input);
    const seconds = input % 60;
    input -= seconds;
    if(mode){
        return `${input / 60}m ${seconds}s`
    }
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
    console.log("Switch this to be from queue");
    addNotification("Switch this to be from queue", "warn", 2000);
    if(appState.player.currentSong){
        stopSong(appState.player.playing);
    }
    appState.player.selectedSong = !appState.player.selectedSong;
    selectSong(appState.player.selectedSong ? appState.player.songContainer2 : appState.player.songContainer1);
    if(appState.player.playing){
        playSong();
    }
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
                console.log(instance.loaded);
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

export const updateVolume = () => {
    if(appState.player.songContainer1){
        appState.player.songContainer1.howl?.volume(appState.player.volume)
    }

    if(appState.player.songContainer2){
        appState.player.songContainer2.howl?.volume(appState.player.volume)
    }

    if(appState.player.currentSong){
        appState.player.currentSong.volume(appState.player.volume)
    }
}
