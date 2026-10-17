<script lang="ts">
    import { Dot, Ellipsis, PenLine } from "@lucide/svelte";
    import { getProjectByID } from "../../backend/collectionUtils.svelte";
    import { getPlayingID, loadManager, loadQueueFromProjectV2, playPause, playSongInstantly } from "../../backend/howlManagers.svelte";
    import { addToQueue, formatSeconds } from "../../backend/playerUtils.svelte";
    import { type PlayerProject, type PlayerSongContainer } from "../../backend/sql.svelte";
    import CurrentPlayingThumbnail from "./currentPlayingThumbnail.svelte";
    import { beginEdit } from "../mainpageModules/songEditing/editSongs.svelte";


    type Props = {
        displayType: "project",
        data: PlayerProject,
        index?: number
    } | {
        displayType: "song",
        data: PlayerSongContainer,
        index?: number
    }

    let props: Props = $props();

    let playingProject = $derived(loadManager.currentSong ? getProjectByID(loadManager.currentSong.song.parentProject) : null);

    const processClick = () => {
        if(props.displayType == "project"){
            if(playingProject){
                if(props.data.id != playingProject.id){
                    loadQueueFromProjectV2(props.data);
                } else {
                    playPause();
                }
            } else {
                loadQueueFromProjectV2(props.data);
            }
        } else {
            playSongInstantly(props.data);
        }

    }

    const handleRightClick = () => {
        if(props.displayType == "song"){
            addToQueue(props.data);
        }
    }

</script>


<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<label class="contentDisplay {getPlayingID() == props.data.id ? "playing" : ""}" for='process_click:{props.data.id}'
    onmousedown={(e) => e.button == 2 && handleRightClick()}
>

    {#if props.index}
        <div class="thumbnail">
            <p>{props.index}</p>
        </div>
    {:else}
        <div class="thumbnail">
            <CurrentPlayingThumbnail size="60px" id={props.displayType == "project" ? props.data.id : props.data.parentProject} />
        </div>
    {/if}

    <div class="text">
        <p class='title'>{props.data.name}</p>
        <div class="subtext">
            {#if props.displayType == "project"}
                <p>{props.data.projectType == "multiple" ? "Multiple" : "Single"}</p>
                <div class="svgWrapper">
                    <Dot size=20 />
                </div>
                <p>{formatSeconds(props.data.totalLength, true)}</p>
            {:else}
                <p>{formatSeconds(props.data.duration, true)}</p>
            {/if}
        </div>
    </div>

    {#if props.displayType == "project"}
        <button class='songDataButton' onclick={() => beginEdit(props.data)} style='margin-left: auto; margin-right: 15px;'>
            <div class="svgWrapper">
                <PenLine size=16 />
            </div>
        </button>
    {/if}

    <button class="invis" onclick={() => processClick()} id='process_click:{props.data.id}'>
        process click
    </button>
</label>

<style>

    .text {
        display: flex;
        flex-direction: column;
    }

    .title {
        font-size: 16px;
        color: var(--text1);
    }

    .subtext {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .thumbnail p {
        color: var(--text5);
        transition: color .25s;
    }

    .subtext * {
        color: var(--text5);
        font-size: 14px;
    }

    .contentDisplay {
        width: 100%;
        display: flex;
        flex: row;
        cursor: pointer;
        gap: 10px;
        align-items: center;
        background-color: var(--bg0);
        transition: background-color .25s ease;
    }    

    .contentDisplay:hover {
        background-color: var(--bg1);
    }

    .contentDisplay:hover .thumbnail p {
        color: var(--text1);
    }

    .thumbnail {
        width: 60px;
        height: 60px;
        min-height: 60px;
        min-width: 60px;
        align-items: center;
        justify-content: center;
        display: flex;
    }

    .playing {
        background-color: var(--bg1) !important;
    }

    .playing .thumbnail * {
        color: var(--text1);
    }

</style>