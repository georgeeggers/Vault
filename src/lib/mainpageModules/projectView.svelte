<script lang='ts'>
    import { Pause, Play, Plus, Settings2 } from "@lucide/svelte";
    import { appState } from "../../backend/appState.svelte";
    import { formatSeconds } from "../../backend/playerUtils.svelte";
    import { replace } from "svelte-spa-router";
    import { addNotification } from "../../backend/appUtils.svelte";
    import PlaceholderImage from "../modules/placeholderImage.svelte";
    import { loadManager, loadQueueFromProjectV2, playPause } from "../../backend/howlManagers.svelte";
    import { getProjectByID } from "../../backend/collectionUtils.svelte";
    import AudioLines from "../modules/audioLines.svelte";
    import type { PlayerProject } from "../../backend/sql.svelte";

    let playingProject = $derived(loadManager.currentSong ? getProjectByID(loadManager.currentSong.song.parentProject) : null);

    const processClick = (p: PlayerProject) => {
        if(playingProject){
            if(p.id != playingProject.id){
                loadQueueFromProjectV2(p);
            } else {
                playPause();
            }
        } else {
            loadQueueFromProjectV2(p);
        }
    }

</script>
<div class="containers">
    {#each appState.projects as p}
        <label class="song" for='edit{p.id}'>
            <div class="imgContainer">
                {#if p.thumbnail}
                    <img src="{p.thumbnail}" alt='bleh'>
                {:else}
                    <PlaceholderImage />
                {/if}

                {#if playingProject}
                    {#if playingProject.id == p.id}
                        <div class="playingBlocker">
                            <AudioLines numOfLines={5} speed={250} bind:playing={loadManager.playing} />
                        </div>
                    {/if}
                {/if}
                <div class="hoverPlayPauseButton">
                    {#if playingProject}
                        {#if p.id == playingProject.id && loadManager.playing}
                            <div class="svgWrapper">
                                <Pause size="100%" fill='currentColor' strokeWidth={0}/>
                            </div>
                        {:else}
                            <div class="svgWrapper">
                                <Play size="100%" fill='currentColor' strokeWidth={0}/>
                            </div>        
                        {/if}
                    {:else}
                        <div class="svgWrapper">
                            <Play size="100%" fill='currentColor' strokeWidth={0}/>
                        </div>
                    {/if}
                </div>



            </div>

            <button id='edit{p.id}' onclick={() => processClick(p)} class='invis'>Edit project</button>

            <div class="text">
                <p>{p.name}</p>
                <div class="informationArea">
                    <p>{formatSeconds(p.totalLength, true)}</p>
                    {#if p.projectType == "single"}
                        <p>Single</p>
                    {:else}
                        <p>{p.songs.length} tracks</p>

                    {/if}
                </div>
            </div>
        </label>
    {/each}



</div>

<style>




    .informationArea {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .containers {
        width: 100%;
        height: fit-content;
        gap: 10px;
        background-color: var(--bg0);
        border: 1px solid var(--bg1);
        border-radius: var(--border-radius);
        padding: 10px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }

    .song {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--bg1);
        border-radius: var(--border-radius);
        height: fit-content;
        cursor: pointer;
        transition: scale .25s;
    }

    .song:hover {
        scale: 1.05;
    }

    .imgContainer {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        position: relative;
    }

    .imgContainer img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        border-radius: var(--border-radius);
    }

    .text {
        width: 100%;
        height: fit-content;
        padding: 10px;
        box-sizing: border-box;
    }

    .text > p {
        text-wrap: anywhere;
    }

    .informationArea {
        display: flex;
        flex-direction: row;
    }

    .informationArea p {
        color: var(--text4);
        font-size: 12px;

    }

    @media (max-width: 1000px){
        .containers {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 800px){
        .containers {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px){
        .containers {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .playingBlocker {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: #00000080;
        transition: opacity .25s;
    }

    .hoverPlayPauseButton {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: #00000080;
        transition: opacity .25s;
        opacity: 0.0;
        align-items: center;
        justify-content: center;
        display: flex;
    }

    .song:hover .playingBlocker {
        opacity: 0.0;
    }

    .song:hover .hoverPlayPauseButton {
        opacity: 1.0;
    }

</style>