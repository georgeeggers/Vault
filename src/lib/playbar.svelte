<script lang="ts">
    import { SELECTED_SONG } from "../backend/dev.svelte";
    import PlayerControls from "./mainpageModules/playerControls.svelte";




</script>



<div class="playbar">
    <div class="songInfo">
        <img alt='bleh' src="{SELECTED_SONG}">
        <div class="songInfoText">
            <p class='text1'>Song name</p>
            <p class='text2'>Song collection</p>
        </div>
    </div>

    <PlayerControls />

</div>



<style>



.songInfo {
    display: flex;
    flex-direction: row;
    gap: 10px;
    box-sizing: border-box;
    align-items: center;
}

.songInfo img {
    height: 100%;
    width: auto;
    aspect-ratio: 1/1;
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

</style>