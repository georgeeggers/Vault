import { Howl } from "howler"
import PlayerControls from "../lib/mainpageModules/playerControls.svelte"
import { appState } from "./appState.svelte"
import { addNotification, createDebounce, getID } from "./appUtils.svelte"
import { debug } from "./dev.svelte"
import { getCurrentQueue, seek, shuffle, startPlaybarTracking, stopPlaybarTracking, stopSeek } from "./playerUtils.svelte"
import { loadSongData, type PlayerProject, type PlayerSongContainer, type PlayerSongData } from "./sql.svelte"
import { settingsMirror } from "./settings.svelte"

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
    preloads: LoadInstance[],
    currentSong: LoadInstance | null,
    playing: boolean,

}

export let loadManager: LoadManager = $state({
    preloads: [],
    currentSong: null,
    playing: false
});

export let loadedHowls: {songID: string, howl: Howl, url: string}[] = $state([]);

export const unloadLeakedHowls = () => {
    for(let i = loadedHowls.length - 1; i >= 0; i--){

        let valid = false;

        for(let preload of loadManager.preloads){
            if(preload.song.id == loadedHowls[i].songID){
                valid = true;
                break;
            }
        }

        if(!valid){
            console.log('cleaning up leaked howl!');
            let thing: {songID: string, howl: Howl, url: string }|null = loadedHowls.splice(i, 1)[0];

            thing.howl.unload();

            URL.revokeObjectURL(thing.url);
            thing.url = "";

            thing = null;


        }

    }
}

export const getHowlInstanceV2 = (songData: PlayerSongData, songContainer: PlayerSongContainer) => {
    // if there is no song data, return
    if(!songData.content){
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
        volume: appState.player.volume
    }).on('load', () => {
        // only initialize the rest of this when the howl instance is actually loaded
        howlContainer.duration = howl.duration();
        if(songData.id == loadManager.currentSong?.song.id){
            appState.player.duration = howlContainer.duration;
        }
        howlContainer.loaded = true;
        
        loadedHowls.push({songID: songContainer.id, howl: howl, url: songData.content});
        unloadLeakedHowls();
    }).on('end', () => {

        appState.player.progress = 0;
        appState.player.sliderProgress = 0;

        // when the song ends, just select the next song in the queue
        playNextSongFromQueue();
    }).load();

    if(settingsMirror.positional){
        howl.pos(settingsMirror.positionX, 0, settingsMirror.positionY);
    }
    howlContainer.howl = howl;
    return howlContainer;
}

export const indexOfID = (id: string, songs: PlayerSongContainer[]) => {
    let index = 0;
    for(let i of songs){
        if(i.id == id){
            return index;
        }
        index++;
    }
    return -1;
}

// lots of toomfoolery here to stop memory leaks and random howler instances causing issues
// there is 100% a better way to do this, but we ball
export const unloadLeastLikelySong = () => {

    let nextSongs: PlayerSongContainer[] = [];
    // remove the ids of everything loaded
    for(let i = 0; i < settingsMirror.maxPreloadSize - 1; i++){
        const thing = getCurrentQueue()[i];
        if(thing){
            nextSongs.push(thing);
        }
    }

    // fetch next X songs in queue, and current playing song
    for(let i of loadManager.preloads){
        if(i.song.id == loadManager.currentSong?.song.id || indexOfID(i.song.id, nextSongs) != -1){
            continue;
        }

        unloadSong(i.song);
        break;
    }

}

export const unloadSong = (songContainer : PlayerSongContainer) => {
    const s = loadQueue.indexOf(songContainer.name);
    if(s != -1){
        loadQueue.splice(s, 1);
    } else {
        addNotification('Attemping to unload song that doesnt exist', 'fail');
    }

    let index = 0;
    for(let i of loadManager.preloads){
        if(i.song.id == songContainer.id){
            break;
        }
        index++;
    }

    let p = loadManager.preloads.splice(index, 1)[0];
    if(p){

        for(let i of loadedHowls){
            if(i.songID == songContainer.id){
                let thing: {songID: string, howl: Howl }|null = loadedHowls.splice(loadedHowls.indexOf(i), 1)[0];

                thing.howl.unload();
                thing = null;
            }
        }

        const howl = p.howlInstance?.howl;

        // Clear application references even if no Howl exists.
        p.howlInstance = null;

        howl?.unload();

        if(p.songData){
            URL.revokeObjectURL(p.songData.content);
            p.songData.content = "";
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
export let loadQueue: string[] = $state([]);

export const loadSong = async (songContainer: PlayerSongContainer) => {
    if(isSongAlreadyLoaded(songContainer)){
        return;
    }

    loadQueue.push(songContainer.name);

    const snapshot =  $state.snapshot(songContainer);
    let temp: LoadInstance = $state({
        playing: false,
        howlInstance: null,
        song: snapshot,
        songData: null
    });
    
    if(loadManager.preloads.length >= settingsMirror.maxPreloadSize){
        unloadLeastLikelySong();
    }

    loadManager.preloads.push(temp);

    const songData: PlayerSongData | null = await loadSongData(snapshot);
    temp.songData = songData;
    if(!songData){
        addNotification("Could not load song data :(", 'fail');
    } else {
        const howlInstanceV2 = getHowlInstanceV2(songData, snapshot);
        temp.howlInstance = howlInstanceV2
    }
}

// this will not actually remove songs from the queue, and will just try to load enough items from the queue to fill the loadManager.preloads array
export const loadNextSongsFromQueue = (queue: PlayerSongContainer[]) => {
    let size = 0; 
    if(loadManager.currentSong){
        size = 1;
    }
    for(let i = 0; i < settingsMirror.maxPreloadSize - size; i++){
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
        playNextSongFromQueue();
    } else {
        loadNextSongsFromQueue(appState.player.queueManager.currentQueue);
        playNextSongFromQueue();
    }


}


export const selectSong = (songContainer: PlayerSongContainer) => {
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
    addSongToRecentlyPlayed(song);
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
                            if(loadManager.currentSong.song.id == song.id){
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

                    if(elapsedTime >= settingsMirror.maxTimeToWaitForLoad){
                        debug(`Failed to load song ${song.name} in reasonable time`);
                        addNotification('Failed to load song in reasonable time', 'fail');
                        clearInterval(intervalID);
                        unloadSong(song);
                    }

                    elapsedTime += settingsMirror.retryInterval;
                }, settingsMirror.retryInterval);
            }
        }
    }
}

const loadSongDebounce = createDebounce(loadNextSongsFromQueue, 500);

export const playNextSongFromQueue = async (queueDebouce: boolean = false) => {
    if(loadManager.currentSong){
        
        stopSong(loadManager.currentSong.song);
        stopPlaybarTracking();
        if(loadManager.preloads.length == settingsMirror.maxPreloadSize){
            unloadSong(loadManager.currentSong.song);
            loadManager.currentSong = null;
            loadNextSongsFromQueue(getCurrentQueue());

        }
    }

    const current = getCurrentQueue().shift();
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
        if(loadManager.currentSong){
            stopSong(loadManager.currentSong.song);
        }
        appState.player.progress = 0;
        appState.player.sliderProgress = 0;
        
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
        if(loadManager.currentSong.song.id == songContainer.id){
            // this exits early in the event the song you want to play is already playing
            return;
        } else {
            stopSong(loadManager.currentSong.song); 
        }
    }

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

export const addSongToRecentlyPlayed = (p: PlayerSongContainer) => {

    if(appState.player.queueManager.recentlyPlayed.length == 0 || appState.player.queueManager.recentlyPlayed[0].id != p.id){
        appState.player.queueManager.recentlyPlayed.unshift(p);
    }
}

export const backTrack = () => {
    if(loadManager.currentSong){
        if(appState.player.progress > 5 || appState.player.queueManager.recentlyPlayed.length <= 1){
            seek();
            appState.player.sliderProgress = 0;
            stopSeek();
        } else if(appState.player.queueManager.recentlyPlayed.length > 0){

            if(loadManager.currentSong){
                stopSong(loadManager.currentSong.song);
            }
            // the first song on recently played will always be the currently playing song. 
            getCurrentQueue().unshift(appState.player.queueManager.recentlyPlayed.splice(0, 1)[0]);
            playSongInstantly( appState.player.queueManager.recentlyPlayed[0])



        }
    }
}

export const unloadAllSongs = () => {
    for(let i of loadManager.preloads){
        unloadSong(i.song);
    }
}








