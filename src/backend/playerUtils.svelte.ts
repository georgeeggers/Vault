import { Shuffle } from "@lucide/svelte"
import { appState } from "./appState.svelte"
import { addNotification } from "./appUtils.svelte"
import { debug } from "./dev.svelte"
import { loadSongData, type PlayerProject, type PlayerSongContainer } from "./sql.svelte"
import { getProjectByID } from "./collectionUtils.svelte"

export type HowlInstance = {
    howl: Howl | null,
    songData: PlayerSongContainer,
    duration: number,
    loaded: boolean,
    id: string,
}

export type QueueManager = {
    currentQueue: PlayerSongContainer[],
    shuffleQueue: PlayerSongContainer[],
    recentlyPlayed: PlayerSongContainer[],
    shuffle: boolean,
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
    queueManager: QueueManager
}

export type PlayerV2 = {
    preloads: HowlInstance[],
    loadIndex: number,
    currentSong: Howl,

}

// for some reason, this just doesnt want to function if you already have content loaded. Why? Who knows.
// nevermind I know now. turns out the freaking
const getHowlContainer = async (song: PlayerSongContainer) => {
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

    const bleh = await loadSongData(song);
    const howl = new Howl({
        // @ts-ignore
        src: bleh.content,
        format: song.extension,
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
    console.log(howl);

    debug("HOWL ITSELF IS", howl)
    return howlContainer;
}

export const loadSong = async (song: PlayerSongContainer) => {
    // selectedSong being true indicates the app is playing song 2, and false is song 1. Switch it here because we're preloading
    // these conditionals ensure that null space is replaced first

    // one off for when loading a new project

    if(appState.player.selectedSong || !appState.player.songContainer1 && !appState.player.songContainer2){
        appState.player.songContainer1 = await getHowlContainer(song);
    } else {
        appState.player.songContainer2 = await getHowlContainer(song);

    }
}

export const loadNextFromQueue = async () => {
    if(appState.player.queueManager.shuffle && appState.player.queueManager.shuffleQueue.length > 0){
        debug("\nAdding from shuffle");
        await loadSong(appState.player.queueManager.shuffleQueue[0]);
        appState.player.queueManager.shuffleQueue.splice(0, 1);
    } else if (appState.player.queueManager.currentQueue.length > 0) {
        debug("\n🤯🤯🤯 Adding from queue", $state.snapshot(appState.player.queueManager.currentQueue[0]));
        await loadSong(appState.player.queueManager.currentQueue[0]);
        appState.player.queueManager.currentQueue.splice(0, 1);
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
            if(i.id == d.songData.parentProject){
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
    debug("!!!!!!!! instance is not loaded");
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

const shuffle = (queueData: PlayerSongContainer[]) => {
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

export const loadQueueFromProject = async (project: PlayerProject) => {
    debug("\n\n\nInstantiating from project!!!!\n\n\n");
    appState.player.queueManager.recentlyPlayed.length = 0;
    stopSong();

    appState.player.queueManager.currentQueue.length = 0;
    appState.player.queueManager.currentQueue = [...project.songs];

    if(appState.player.queueManager.shuffle){
        appState.player.queueManager.shuffleQueue = shuffle([...appState.player.queueManager.currentQueue]);
    }

    appState.player.selectedSong = false;
    appState.player.songContainer1 = null;
    appState.player.songContainer2 = null;
    await loadNextFromQueue();
    await loadNextFromQueue();
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

export const playSongInstantly = async (s: PlayerSongContainer) => {

    appState.player.queueManager.currentQueue.length = 0;
    appState.player.queueManager.shuffleQueue.length = 0;
    appState.player.queueManager.recentlyPlayed.length = 0;


    if(!appState.player.selectedSong){
        appState.player.songContainer1 = null;
        await loadSong(s);
        selectSong(appState.player.songContainer1);
    } else {
        appState.player.songContainer2 = null;
        await loadSong(s);
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