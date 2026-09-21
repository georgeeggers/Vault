import PlayerControls from "../lib/mainpageModules/playerControls.svelte"
import { appState } from "./appState.svelte"
import { addNotification, getID } from "./appUtils.svelte"
import { debug } from "./dev.svelte"
import { shuffle, startPlaybarTracking, stopPlaybarTracking } from "./playerUtils.svelte"
import { loadSongData, type PlayerProject, type PlayerSongContainer, type PlayerSongData } from "./sql.svelte"

export type HowlInstanceV2 = {
    howl: null | Howl,
    duration: number,
    loaded: boolean,
    id: string
}

export type LoadInstance = {
    playing: boolean,
    howlInstance: HowlInstanceV2 | null,
    song: PlayerSongContainer,
    songData: PlayerSongData | null,
}

export type LoadManager = {
    maxSize: number,
    preloads: LoadInstance[],
    currentSong: LoadInstance | null,
    maxTimeToWaitForLoad: number,
    retryInterval: number,
    playing: boolean,
}

export let loadManager: LoadManager = $state({
    maxSize: 3,
    preloads: [],
    currentSong: null,
    maxTimeToWaitForLoad: 10000,
    retryInterval: 100,
    playing: false,
});

export const getHowlInstanceV2 = (songData: PlayerSongData, songContainer: PlayerSongContainer) => {
    // if there is no song data, return
    if(!songData){
        return null
    }

    // default howl instance
    const howlContainer: HowlInstanceV2 = $state({
        howl: null,
        duration: 0,
        loaded: false,
        id: "howl_" + getID()
    });

    // being howl instantiation
    const howl = new Howl({
        src: songData.content,
        format: songContainer.extension,
        volume: appState.player.volume,
        html5: true,
    }).on('load', () => {
        // only initialize the rest of this when the howl instance is actually loaded
        howlContainer.duration = howl.duration();
        howlContainer.loaded = true;
        howlContainer.howl = howl;
    }).on('end', () => {
        // when the song ends, just select the next song in the queue
        stopSong(songContainer);
        unloadSong(songContainer);
    }).load();

    return howlContainer;
}

// lots of toomfoolery here to stop memory leaks and random howler instances causing issues
export const unloadSongAtStart = () => {
    const p = loadManager.preloads.shift();
    if(p){
        if(p.howlInstance){
            p.howlInstance.howl?.unload();
            p.howlInstance.howl = null;
            p.howlInstance = null;
        }

        if(p.songData){
            URL.revokeObjectURL(p.songData.content);
        }

    }
}

export const unloadSong = (songContainer : PlayerSongContainer) => {
    let index = 0;
    for(let i of loadManager.preloads){
        if(i.song.id == songContainer.id){
            break;
        }
        index++;
    }

    const p = loadManager.preloads.splice(index, 1)[0];
    if(p){
        if(p.howlInstance){
            p.howlInstance.howl?.unload();
            p.howlInstance.howl = null;
            p.howlInstance = null;
        }

        if(p.songData){
            URL.revokeObjectURL(p.songData.content);
        }
    }

}

export const isSongAlreadyLoaded = (songContainer: PlayerSongContainer) => {
    for(let i of loadManager.preloads){
        if(i.song.id == songContainer.id){
            return true;
        }
    }
    return false;
}

export const loadSong = async (songContainer: PlayerSongContainer) => {
    if(isSongAlreadyLoaded(songContainer)){
        return;
    }

    let temp: LoadInstance = $state({
        playing: false,
        howlInstance: null,
        song: songContainer,
        songData: null
    });
    
    if(loadManager.preloads.length >= loadManager.maxSize){
        unloadSongAtStart();
    }

    loadManager.preloads.push(temp);

    const songData: PlayerSongData | null = await loadSongData(songContainer);
    temp.songData = songData;
    if(!songData){
        addNotification("Could not load song data :(", 'fail');
    } else {
        const howlInstanceV2 = getHowlInstanceV2(songData, songContainer);
        temp.howlInstance = howlInstanceV2
    }
}

// this will not actually remove songs from the queue, and will just try to load enough items from the queue to fill the loadManager.preloads array
export const loadNextSongsFromQueue = (queue: PlayerSongContainer[]) => {
    for(let i = 0; i < loadManager.maxSize; i++){
        if(queue[i]){
            loadSong(queue[i]);
        }
    }
}

export const loadQueueFromProjectV2 = async (project: PlayerProject) => {
    debug("\n\n\nInstantiating from project!!!!\n\n\n");

    if(loadManager.currentSong){
        stopSong(loadManager.currentSong.song);
        loadManager.currentSong = null;
    }

    appState.player.queueManager.currentQueue.length = 0;
    appState.player.queueManager.currentQueue = [...project.songs];

    if(appState.player.queueManager.shuffle){
        appState.player.queueManager.shuffleQueue = shuffle([...appState.player.queueManager.currentQueue]);
        loadNextSongsFromQueue(appState.player.queueManager.shuffleQueue);
        playNextSongFromQueue(appState.player.queueManager.shuffleQueue);
    } else {
        loadNextSongsFromQueue(appState.player.queueManager.currentQueue);
        playNextSongFromQueue(appState.player.queueManager.currentQueue);
    }


}

export const selectSong = (songContainer: PlayerSongContainer) => {
    // load the container. This wont do anything if the data is already loaded :)
    loadSong(songContainer);
    for(let i of loadManager.preloads){
        if(i.song.id == songContainer.id){
            loadManager.currentSong = i;
            break;
        }
    }
}

export const stopSong = (song: PlayerSongContainer) => {
    stopPlaybarTracking();
    for(let i of loadManager.preloads){
        if(i.song.id == song.id){
            i.playing = false;
            loadManager.playing = false;
            i.howlInstance?.howl?.pause();
        }
    }
}

export const playSong = (song: PlayerSongContainer) => {
    for(let i of loadManager.preloads){
        // stop songs other than the one we want
        if(i.song.id != song.id && i.playing){
            i.playing = false;
            loadManager.playing = false;
            i.howlInstance?.howl?.stop();
        } else if (i.song.id == song.id && !i.playing){
            if(i.howlInstance?.howl){
                i.playing = true;
                loadManager.playing = true;
                i.howlInstance.howl.seek(appState.player.sliderProgress / 100);
                i.howlInstance.howl.play();
                startPlaybarTracking();
            } else {
                let elapsedTime = 0;
                let intervalID = setInterval(() => {

                    if(i.howlInstance?.howl){
                        if(loadManager.currentSong){
                            if(loadManager.currentSong.song == song){
                                i.playing = true;
                                loadManager.playing = true;
                                i.howlInstance.howl.seek(appState.player.sliderProgress / 100);
                                i.howlInstance.howl.play();
                                startPlaybarTracking();
                                debug(`Song loaded after ${elapsedTime}ms`)
                            }
                        } else {
                            unloadSong(song);
                        }

                        clearInterval(intervalID);
                    }

                    if(elapsedTime >= loadManager.maxTimeToWaitForLoad){
                        debug("Failed to load song in reasonable time");
                        addNotification('Failed to load song in reasonable time', 'fail');
                        clearInterval(intervalID);
                    }

                    elapsedTime += loadManager.retryInterval;
                }, loadManager.retryInterval);
            }
        }
    }
}

export const playNextSongFromQueue = (queue: PlayerSongContainer[]) => {

    if(loadManager.currentSong){
        stopSong(loadManager.currentSong.song);
        stopPlaybarTracking();
        if(loadManager.preloads.length == loadManager.maxSize){
            unloadSong(loadManager.currentSong.song);
            loadNextSongsFromQueue(queue);
        }
        
    }

    const current = queue.shift();
    if(current){

        appState.player.duration = current.duration;
        appState.player.progress = 0;
        appState.player.sliderProgress = 0;

        selectSong(current);
        if(loadManager.currentSong){ 
            playSong(loadManager.currentSong.song);
        } else {
            debug("Current song not instantiated");
        }
    } else {
        debug("No more songs in queue!");
        loadManager.currentSong = null;
    }
}

export const updateVolume = () => {
    

    if(loadManager.currentSong){
        loadManager.currentSong.howlInstance?.howl?.volume(appState.player.volume)
    }

    for(let i of loadManager.preloads){
        if(i.howlInstance?.howl){
            i.howlInstance.howl.volume(appState.player.volume)
        }
    }
}

export const getPlayingID = () => {
    if(loadManager.currentSong){
        return loadManager.currentSong.song.id;
    }
}

export const playSongInstantly = (songContainer: PlayerSongContainer) => {
    if(loadManager.currentSong){
        if(loadManager.currentSong.song == songContainer){
            return;
        }
    }
    appState.player.duration = 0;
    appState.player.sliderProgress = 0;

    stopPlaybarTracking();
    loadSong(songContainer);
    selectSong(songContainer);
    playSong(songContainer);
}

export const playPause = () => {
    if(loadManager.currentSong){
        if(loadManager.currentSong.howlInstance?.loaded){
            if(loadManager.playing){
                stopSong(loadManager.currentSong.song);
            } else {
                playSong(loadManager.currentSong.song);
            }
        }
    }

}










