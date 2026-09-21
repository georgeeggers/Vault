<script lang="ts">
    import { appState } from "../backend/appState.svelte";
    import { getProjectByID } from "../backend/collectionUtils.svelte";
    import { loadManager } from "../backend/howlManagers.svelte";
    import PlayerControls from "./mainpageModules/playerControls.svelte";
    import CurrentPlayingThumbnail from "./modules/currentPlayingThumbnail.svelte";
    import Ghost from "./modules/ghost.svelte";
    import PlaceholderImage from "./modules/placeholderImage.svelte";




</script>



<div class="playbar">
    <div class="songInfo">
        
        <div class="imageContainer">
            <CurrentPlayingThumbnail size='80px' />
        </div>


        <div class="songInfoText">
            {#if loadManager.currentSong}
                {@const parentProject = getProjectByID(loadManager.currentSong.song.parentProject)}
                <p class='text1'>{loadManager.currentSong.song.name}</p>
                <p class='text2'>{parentProject?.name}</p>
            {:else}
                <p class='text1'>Loading...</p>
                <p class='text2'>Loading...</p>
            {/if}
        </div>
    </div>

    <div class="playerControlsContainer">
        <PlayerControls />
    </div>

</div>



<style>



.songInfo {
    display: flex;
    flex-direction: row;
    gap: 10px;
    box-sizing: border-box;
    align-items: center;
    width: 33%;
}

.songInfoText .text1 {
    color: var(--text1);
    font-size: 16px;
}

.songInfoText .text2 {
    color: var(--text5);
    font-size: 14px;
}

.playbar {
    width: 100%;
    height: 100%;
    background-color: var(--bg0);
    border-top: 1px solid var(--bg2);
    display: flex;
    box-sizing: border-box;
    padding: 10px;
    flex-direction: row;
}

.playerControlsContainer {
    width: 67%; /* hehe 67 */
    display: flex;
    flex-direction: row;
}

</style>