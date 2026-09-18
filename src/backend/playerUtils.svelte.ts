import { Shuffle } from "@lucide/svelte"
import { appState } from "./appState.svelte"
import { addNotification } from "./appUtils.svelte"
import type { Project } from "./collectionUtils.svelte"
import { getSongPath, type SongContainer } from "./songUtils.svelte"
import { debug } from "./dev.svelte"

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
    shuffle: boolean,
    currentQueue: SongContainer[],
    shuffleQueue: SongContainer[],
    recentlyPlayed: SongContainer[],
}

// for some reason, this just doesnt want to function if you already have content loaded. Why? Who knows.
// nevermind I know now. turns out the freaking
const getHowlContainer = (song: SongContainer) => {
    if(!song){
        return null
    }
    debug("🚨🚨🚨 instantiating new howl instance 🚨🚨🚨")
    const howlContainer: HowlInstance = $state({
        howl: null,
        songData: song,
        duration: 0,
        loaded: false,
        id: "howl_" + song.id
    });
    debug("Howl is this before instantiation", $state.snapshot(howlContainer));

    const howl = new Howl({
        src: [getSongPath(song)],
        volume: appState.player.volume
    }).on('load', () => {
        debug(`😄 onload callback triggered on ${howlContainer.id}. Everything is dandy!`)
        howlContainer.duration = howl.duration();
        howlContainer.loaded = true;
        howlContainer.howl = howl;
    }).on('end', () => {
        selectNext();
        if(appState.player.playing){
            playSong();
        }
    }).load();

    debug("HOWL ITSELF IS", howl)
    return howlContainer;
}

export const loadSong = (song: SongContainer) => {
    // selectedSong being true indicates the app is playing song 2, and false is song 1. Switch it here because we're preloading
    // these conditionals ensure that null space is replaced first

    // one off for when loading a new project

    if(appState.player.selectedSong || !appState.player.songContainer1 && !appState.player.songContainer2){
        appState.player.songContainer1 = getHowlContainer(song);
    } else {
        appState.player.songContainer2 = getHowlContainer(song);

    }
}

export const loadNextFromQueue = () => {
    if(appState.player.shuffle && appState.player.shuffleQueue.length > 0){
        debug("\nAdding from shuffle");
        loadSong(appState.player.shuffleQueue[0]);
        appState.player.shuffleQueue.splice(0, 1);
    } else if (appState.player.currentQueue.length > 0) {
        debug("\n🤯🤯🤯 Adding from queue", $state.snapshot(appState.player.currentQueue[0]));
        loadSong(appState.player.currentQueue[0]);
        appState.player.currentQueue.splice(0, 1);
    } else {
        addNotification("[DEBUG] No data found for queue", "warn", 2000);
        if(appState.player.selectedSong){
            appState.player.songContainer1 = null
        } else {
            appState.player.songContainer2 = null

        }
    }
}

export const getSelectedSong = () => {
    return appState.player.selectedSong ? appState.player.songContainer2 : appState.player.songContainer1;
}

export const getSelectedSongProject = () => {
    const d = getSelectedSong();
    if(d){
        for(let i of appState.projects){
            if(i.id == d.songData.songData.containerId){
                return i; 

            }
        }
    }
    debug("Project not found");

    return null;
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


export const selectNext = (fromSongEnd: boolean = true) => {
    if(appState.player.currentSong){
        stopSong(appState.player.playing);
    }

    appState.player.selectedSong = !appState.player.selectedSong;
    if(!(appState.player.selectedSong ? appState.player.songContainer2 : appState.player.songContainer1)){
        stopSong();
    } else {
        selectSong(appState.player.selectedSong ? appState.player.songContainer2 : appState.player.songContainer1);
    }
    appState.player.selectedSong ? appState.player.songContainer1 : appState.player.songContainer2 = null;
    loadNextFromQueue();

    if(appState.player.playing){
        playSong();
    }

}

export const selectSong = (instance: HowlInstance | null) => {
    debug("Attempting to instantiate ", $state.snapshot(instance));
    if(instance){
        if(instance.loaded){
            debug("Instance is loaded!!!");
            appState.player.currentSong = instance.howl;
            appState.player.duration = instance.duration;
            appState.player.progress = 0;
            appState.player.sliderProgress = 0;
        } else {
            debug("Selecting song!");
            let retries = 50;
            let retryID = setInterval(() => {
                if(instance.loaded){
                    debug(`Instance loaded after ${50 - retries} retries`)
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

const shuffle = (queueData: SongContainer[]) => {
  for (let i = queueData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queueData[i], queueData[j]] = [queueData[j], queueData[i]];
  }
  return queueData;
}   

export const toggleShuffle = () => {
    appState.player.shuffle = !appState.player.shuffle;
    if(appState.player.shuffle){
        appState.player.shuffleQueue = shuffle([...appState.player.currentQueue]);
    }
}

export const loadQueueFromProject = (project: Project) => {
    debug("\n\n\nInstantiating from project!!!!\n\n\n");
    appState.player.recentlyPlayed.length = 0;
    stopSong();

    if(project.projectType == "multiple"){
        appState.player.currentQueue = [...project.content];
    } else {
        appState.player.currentQueue.length = 0;
        appState.player.currentQueue.push($state.snapshot(project.content));
    }

    if(appState.player.shuffle){
        appState.player.shuffleQueue = shuffle([...appState.player.currentQueue]);
    }

    appState.player.selectedSong = false;
    appState.player.songContainer1 = null;
    appState.player.songContainer2 = null;
    loadNextFromQueue();
    loadNextFromQueue();
    debug(`\nSong container has at time of load`, $state.snapshot(appState.player.songContainer1));
    selectSong(appState.player.songContainer1);
}

export const getPlayingID = () => {
    if(appState.player.currentSong){
        const song = appState.player.selectedSong ? appState.player.songContainer2 : appState.player.songContainer1;
        if(song){
            return song.songData.id
        }
    }
    return "";
}

export const playSongInstantly = (s: SongContainer) => {

    if(!appState.player.selectedSong){
        appState.player.songContainer1 = null;
        loadSong(s);
        selectSong(appState.player.songContainer1);
    } else {
        appState.player.songContainer2 = null;
        loadSong(s);
        selectSong(appState.player.songContainer2);
    }


    if(appState.player.currentSong){
        stopSong(appState.player.playing);
    }


    if(!(appState.player.selectedSong ? appState.player.songContainer2 : appState.player.songContainer1)){
        stopSong();
    } else {
        selectSong(appState.player.selectedSong ? appState.player.songContainer2 : appState.player.songContainer1);
    }

    if(appState.player.playing){
        playSong();
    }
}