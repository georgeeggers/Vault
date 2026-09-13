<script lang='ts'>
    import { onMount } from "svelte";
    import { getProjectByID, type Project } from "../backend/collectionUtils.svelte";
    import Ghost from "./modules/ghost.svelte";

    let { params = {}} = $props();

    let selectedProject: Project | null= $state(null)
    onMount(() => {
        selectedProject = getProjectByID(params.id);
    });
</script>

<div class="editProjectContainer scrollOverflow">
    <div class="node">
        <div class="projectInformation">
            <div class="projectThumbnail">
                {#if selectedProject}
                    {#if selectedProject.thumbnail}
                        <img alt='thumbnail' src='{selectedProject.thumbnail}'>
                    {:else}
                        <img alt='thumbnail' src='/default.png'>
                    {/if}
                {:else}
                    <Ghost />
                {/if}
            </div>

        </div>
    </div>

    <div class="node">
        {#if selectedProject}
            {#if selectedProject.projectType == "multiple"}
                {#each selectedProject.content as p}
                    <div class="songContainer">

                    </div> 
                {/each}
            {/if}
        {:else}
            <div class="songContainer">

            </div>
        {/if}


    </div>

</div>


<style>

    .projectThumbnail {
        width: 256px;
        height: 256px;
    }

    .projectThumbnail img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
    }

    .editProjectContainer {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .node {
        background-color: var(--bg1);
        display: flex;
        flex-direction: column;
        width: 100%;
        height: fit-content;
        box-sizing: border-box;
        gap: 10px;
        padding: 10px;

    }



</style>

