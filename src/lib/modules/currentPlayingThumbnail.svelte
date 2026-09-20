<script lang='ts'>
    import { appState } from "../../backend/appState.svelte";
    import { getProjectByID } from "../../backend/collectionUtils.svelte";
    import Ghost from "./ghost.svelte";
    import PlaceholderImage from "./placeholderImage.svelte";

    export let size: string;

</script>

<div class="imageContainer" style='width: {size}; min-width: {size}; height: {size}; min-height: {size};'>
    {#if !appState.player.selectedSong}
        {#if appState.player.songContainer1?.loaded}
            {@const url = getProjectByID(appState.player.songContainer1.songData.parentProject)?.thumbnail}
            {#if url && url != ""}
                <img src='{url}' alt='bleh' />
            {:else}
                <PlaceholderImage />
            {/if}
        {:else}
            <Ghost />
        {/if}
    {:else}
        {#if appState.player.songContainer2?.loaded}
            {@const url = getProjectByID(appState.player.songContainer2.songData.parentProject)?.thumbnail}
            {#if url && url != ""}
                <img src='{url}' alt='bleh' />
            {:else}
                <PlaceholderImage />
            {/if}
        {:else}
            <Ghost />
        {/if}
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