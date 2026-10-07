<script lang="ts">
    import { Ellipsis, Files, Folder, FolderPlus, Pause, Play, Plus, Search, Spool } from "@lucide/svelte";
    import { appState, openPopup } from "../../backend/appState.svelte";
    import { formatSeconds } from "../../backend/playerUtils.svelte";
    import PlaceholderImage from "../modules/placeholderImage.svelte";
    import { getPlayingID, loadManager, loadQueueFromProjectV2, playPause, playSongInstantly } from "../../backend/howlManagers.svelte";
    import type { PlayerProject, PlayerSongContainer } from "../../backend/sql.svelte";
    import { debug } from "../../backend/dev.svelte";
    import { beginEdit, editData } from "./songEditing/editSongs.svelte";
    import { getProjectByID } from "../../backend/collectionUtils.svelte";
    import AudioLines from "../modules/audioLines.svelte";

    let vaultSearchTerm = $state("");

    const sortProjects = (projects: PlayerProject[], searchTerm: string) => {
        return projects.filter((a) => {
            for(let i of searchTerm.split(" ")){
                if(a.name.toLowerCase().includes(searchTerm.toLowerCase())){
                    return true;
                } else if (i.toLowerCase().startsWith('totallength>')){
                    try {
                        const part = i.split(">")[1];
                        if(a.totalLength >= parseInt(part)){
                            return true;
                        }
                    } catch {
                        debug("No parts found");
                    }
                } else if (i.startsWith('totalLength<')){
                    try {
                        const part = i.split("<")[1];
                        if(a.totalLength <= parseInt(part)){
                            return true;
                        }
                    } catch {
                        debug("No parts found");
                    }
                } else if (i.startsWith('tracks>')){
                    try {
                        const part = i.split(">")[1];
                        if(a.songs.length >= parseInt(part)){
                            return true;
                        }
                    } catch {
                        debug("No parts found");
                    }
                } else if (i.startsWith('tracks<')){
                    try {
                        const part = i.split("<")[1];
                        if(a.songs.length >= parseInt(part)){
                            return true;
                        }
                    } catch {
                        debug("No parts found");
                    }
                }
            }
            return false;
        })
    }

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

<div class="yourVault">
    <div class="vaultSearchControls">
        <label class="vaultSearchContainer" for='vaultInput'>
                <div class="svgWrapper" style='color: var(--text7);'>
                    <Search size=20 />
                </div>
            <input bind:value={vaultSearchTerm} placeholder="Search..." id='vaultInput' autocapitalize="off" autocomplete="off" autocorrect="off"/>
        </label>
        <button class='btn main' onclick={() => openPopup("createNew")}>
            <div class="svgWrapper">
                <Plus size=16 />
            </div>
            New Project
        </button>

    </div>
    {#each sortProjects(appState.projects, vaultSearchTerm) as project}
        {#if project.id != "yourVault"}
            <div class="projectLabel">
                <div class="imgContainer">
                    {#if project.thumbnail}
                        <img alt='bleh' src='{project.thumbnail}'>
                    {:else}
                        <PlaceholderImage  />
                    {/if}
                </div>

                <div class="projectLabelText">
                    <p class='text1'>{project.name}</p>
                    <p class='text2'>{formatSeconds(project.totalLength, true)}</p>
                    {#if project.projectType == "single"}
                        <p class='text2'>Single</p>
                    {:else}
                        <p class='text2'>{project.songs.length} tracks</p>
                    {/if}
                </div>

                <button class="playButton" onclick={() => processClick(project)}>
                    <div class="hoverPlayPauseButton">
                        {#if playingProject}
                            {#if project.id == playingProject.id && loadManager.playing}
                                <div class="svgWrapper">
                                    <Pause size=37 fill='currentColor' strokeWidth={0}/>
                                </div>
                            {:else}
                                <div class="svgWrapper">
                                    <Play size=37 fill='currentColor' strokeWidth={0}/>
                                </div>        
                            {/if}
                        {:else}
                            <div class="svgWrapper">
                                <Play size=37 fill='currentColor' strokeWidth={0}/>
                            </div>
                        {/if}
                    </div>
                </button>

                <button class='songDataButton' onclick={() => beginEdit(project)}>
                    <div class="svgWrapper">
                        <Ellipsis size=20 />
                    </div>
                </button>
            </div>
            {#each project.songs as songContainer, i}
                <label class="songDataContainer {getPlayingID() == songContainer.id ? "playing" : ""}" for='play{songContainer.id}'>
                    <p>{i + 1}</p>
                    <div class="songData">
                        <div class="songDataText">
                            <p class='text1'>{songContainer.name}</p>
                            <p class='text2'>{formatSeconds(songContainer.duration, true)}</p>
                        </div>
                    </div>
                </label>
                <button class='invis' id='play{songContainer.id}' onclick={() => playSongInstantly(songContainer)}>play{songContainer.id}</button>
            {/each}

        {/if}
    {/each}
</div>

<style>



    .playButton {
        width: 60px;
        height: 60px;
        min-width: 60px;
        min-height: 60px;
        background-color: var(--bg1);
        align-items: center;
        justify-content: center;
        display: flex;
        border: none;
        cursor: pointer;
        transition: scale .1s;
    }

    .playButton:hover {
        scale: 1.05;
    }

    .playButton * {
        color: var(--main5);
    }

    .btn.main {
        align-items: center;
        justify-content: center;
        font-size: 16px;
        height: 40px;
        max-height: 40px;
    }

    .vaultSearchControls {
        width: 100%;
        display: flex;
        flex-direction: row;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        box-sizing: border-box;
    }

    .vaultSearchContainer {
        max-width: 200px;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        height: 100%;
        background-color: var(--bg1);
        padding-left: 10px;
    }

    .vaultSearchContainer input {
        padding: 10px;
        box-sizing: border-box;
        background: none;
        border: none;
        font-size: 16px;
        width: 100%;
        outline: none;
        color: var(--text1);
    }

    .vaultSearchContainer input::placeholder {
        color: var(--text7);
    }

    .songDataText {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .songDataText .text1 {
        color: var(--text1);
        font-size: 16px;

        min-width: 40px;
    }

    .songDataText .text2 {
        color: var(--text7);
        font-size: 14px;
    }

    .songData {
        height: 100%;
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        padding: 0px 10px 0px 10px;
        transition: background-color .25s;
        box-sizing: border-box;
    }

    .songDataButton {
        background: none;
        border: none;
        margin-left: auto;
        cursor: pointer;
        margin-left: 10px;
        margin-right: 10px;
    }

    .songDataContainer {
        width: 100%;
        display: flex;
        flex-direction: row;
        height: 60px;
        align-items: center;
        padding: 0px 0px 0px 30px;
        box-sizing: border-box;
        gap: 20px;
        cursor: pointer;
    }

    .songDataContainer > p, .songDataButton * {
        color: var(--text7);
        font-size: 16px;
        transition: color .25s;
    }



    .songDataContainer:hover > p, .songDataContainer:hover .songDataButton * {
        color: var(--text1);
    }

    .songDataButton:hover * {
        color: var(--main5) !important;
    }

    .playing .songDataButton:hover * {
        color: var(--main6) !important;
    }

    .songDataContainer:hover .songData {
        background-color: var(--bg1);
    }

    .playing > p {
        color: var(--main5) !important;
    }

    .playing .songDataButton * {
        color: var(--text1) !important;
    }

    .playing .songData {
        background-color: var(--main3) !important;
    }

    .playing .songData * {
        color: var(--text1);
    }

    .yourVault {
        width: 100%;
        height: fit-content;
        gap: 10px;
        background-color: var(--bg0);
        border: 1px solid var(--bg1);
        border-radius: var(--border-radius);
        padding: var(--medPadding);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .projectLabel {
        width: 100%;
        display: flex;
        margin-top: 30px;
        align-items: center;
    }

    .projectLabel .imgContainer {
        max-width: 128px;
        max-height: 128px;
        min-width: 128px;
        min-height: 128px;
    }

    .projectLabel .imgContainer img {
        aspect-ratio: 1/1;
        width: 100%;
        height: auto;
    }

    .projectLabelText {
        width: 100%;
        display: flex;
        padding: 0px 10px 10px 20px;
        box-sizing: border-box;
        flex-direction: column;
        justify-content: center;
        
    }

    .projectLabelText .text1 {
        font-size: 32px;
        font-weight: bold;
    }

    .projectLabel .text2 {
        font-size: 14px;
        color: var(--text4);
    }

    @media (max-width: 715px){
        .vaultSearchControls {
            flex-direction: column;
            height: fit-content;
        }
    }

</style>
