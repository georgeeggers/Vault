<script>
    import { SELECTED_SONG } from "../backend/dev.svelte";
    import LyricSyncTest from "./mainpageModules/lyricSyncTest.svelte";
    import ProjectView from "./mainpageModules/projectView.svelte";
    import YourVault from "./mainpageModules/yourVault.svelte";

</script>

<div class="vault">

    <div class="mainModulesContainer">

        <div class="mainModules scrollOverflow">
            <ProjectView />
            <YourVault />
            <LyricSyncTest />
        </div>
    </div>

    <div class="nowPlayingContainer">
        <div class="nowPlaying">
            <img src='{SELECTED_SONG}' alt='bleh'>
        </div>
    </div>

</div>

<style>

    .mainModulesContainer {
        width: 100%;
        display: flex;
        height: 100%;
        padding-left: 10px;
    }

    .mainModules {
        padding: 10px 0px 10px 0px;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        gap: 10px;
    }

    .nowPlayingContainer {
        max-width: 400px;
        height: 100%;
        padding: 10px 10px 10px 0px;
        box-sizing: border-box;
    }

    .nowPlaying {
        max-width: 400px;
        height: 100%;
        border-radius: var(--border-radius);
        padding: 10px;
        background-color: var(--bg1);
        box-sizing: border-box;
    }

    .nowPlaying img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        border-radius: var(--border-radius);
    }



    .vault {
        width: 100%;
        height: 100%;

        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        gap: 10px;
    }   

</style>