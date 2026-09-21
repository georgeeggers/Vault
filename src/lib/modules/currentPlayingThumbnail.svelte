<script lang='ts'>
    import { appState } from "../../backend/appState.svelte";
    import { getProjectByID } from "../../backend/collectionUtils.svelte";
    import { loadManager } from "../../backend/howlManagers.svelte";
    import Ghost from "./ghost.svelte";
    import PlaceholderImage from "./placeholderImage.svelte";

    export let size: string;
    export let id: string = "";
</script>

<div class="imageContainer" style='width: {size}; min-width: {size}; height: {size}; min-height: {size};'>
    {#if id != ""}
        {@const url = getProjectByID(id)?.thumbnail}
        {#if url && url != ""}
            <img src='{url}' alt='bleh' />
        {:else}
            <PlaceholderImage />
        {/if}
    {:else if loadManager.currentSong}
        {@const url = getProjectByID(loadManager.currentSong.song.parentProject)?.thumbnail}
        {#if url && url != ""}
            <img src='{url}' alt='bleh' />
        {:else}
            <PlaceholderImage />
        {/if}
    {:else}
        <Ghost />
    {/if}
</div>

<style>


    .imageContainer {
        height: auto;
        aspect-ratio: 1/1;
        overflow: hidden;
        border-radius: var(--border-radius);
    }

    .imageContainer img {
        height: 100%;
        width: auto;
        aspect-ratio: 1/1;
    }

</style>