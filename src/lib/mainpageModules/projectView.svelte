<script lang='ts'>
    import { Plus, Settings2 } from "@lucide/svelte";
    import { appState } from "../../backend/appState.svelte";
    import { formatSeconds, loadQueueFromProject } from "../../backend/playerUtils.svelte";
    import { replace } from "svelte-spa-router";
    import { addNotification } from "../../backend/appUtils.svelte";
    import PlaceholderImage from "../modules/placeholderImage.svelte";

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
            </div>

            <button id='edit{p.id}' onclick={() => loadQueueFromProject(p)} class='invis'>Edit project</button>
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
    }

    .imgContainer {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
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


</style>