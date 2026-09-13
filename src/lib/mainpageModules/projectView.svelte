<script lang='ts'>
    import { Plus, Settings2 } from "@lucide/svelte";
    import { TEST_DATA } from "../../backend/dev.svelte";
    import { appState } from "../../backend/appState.svelte";
    import { formatSeconds } from "../../backend/playerUtils.svelte";
    import { replace } from "svelte-spa-router";
    import type { Project } from "../../backend/collectionUtils.svelte";

    const startEdit = (project: Project) => {
        replace("/editProject/" + project.id)
    }

</script>
<div class="containers">
    {#each appState.projects as p}
        <label class="song" for='edit{p.id}'>
            {#if p.thumbnail}
                <img src="{p.thumbnail}" alt='poop'>
            {:else}
                <img src="/mood.png" alt='poop'>
            {/if}
            <button id='edit{p.id}' onclick={() => startEdit(p)} class='invis'>Edit project</button>
            <div class="text">
                <p>{p.name}</p>
                <div class="informationArea">
                    <p>{formatSeconds(p.totalLength)}</p>
                    <div class="svgWrapper">
                        <Settings2 size=12 />
                    </div>
                </div>
            </div>
        </label>
    {/each}

    <button class='btn main'>
        <div class="svgWrapper">
            <Plus size=16 />
        </div>
        New Project
    </button>

</div>

<style>

    .btn.main {
        align-items: center;
        justify-content: center;
        font-size: 16px;
    }

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
        background-color: var(--bg1);
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
        background-color: var(--bg2);
        border-radius: var(--border-radius);
        height: fit-content;
    }

    .song img {
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