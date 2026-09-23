<script>
    import { appState } from "../backend/appState.svelte";
    import { loadManager } from "../backend/howlManagers.svelte";
    import LyricSyncTest from "./mainpageModules/lyricSyncTest.svelte";
    import NewProjectPopup from "./mainpageModules/newProjectPopup.svelte";
    import ProjectView from "./mainpageModules/projectView.svelte";
    import Queue from "./mainpageModules/queue.svelte";
    import YourVault from "./mainpageModules/yourVault.svelte";
    import AudioLines from "./modules/audioLines.svelte";
    import CurrentPlayingThumbnail from "./modules/currentPlayingThumbnail.svelte";
    import PositionalAudioSelector from "./modules/positionalAudioSelector.svelte";


</script>

<div class="vault">

    {#if appState.popupShowing}
        <label class="blocker" for='hidePopup'>
            <button onclick={() => {appState.popupShowing = false}} class='invis' id='hidePopup'>hide poppup</button>
        </label>
        <div class="popup">
            {#if appState.popupType == "createNew"}
                <NewProjectPopup />
            {/if}
        </div>
    {/if}

    <div class="mainModulesContainer">

        <div class="mainModules scrollOverflow">

            <PositionalAudioSelector />

            <div class="audioLinesContainer" style='width: 140px; height: 140px; min-width: 140px; min-height: 140px;'>
                <AudioLines numOfLines={10} speed={250} bind:playing={loadManager.playing} />
            </div>

            <ProjectView />
            <YourVault />
            <LyricSyncTest />
        </div>
    </div>

    <div class="nowPlayingContainer">
        <div class="nowPlaying">

            <div class="thumbnail">
                <CurrentPlayingThumbnail size='280px' />
            </div>

            <p>{loadManager.currentSong ? loadManager.currentSong.song.name : ""}</p>

            <div class="queueContainer">
                <Queue />
            </div>


        </div>

    </div>
</div>

<style>

    .queueContainer {
        width: 100%;
        height: calc(100% - 305px);
    }

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
        max-width: 300px;
        height: 100%;
        border-radius: var(--border-radius);
        padding: 10px;
        background-color: var(--bg0);
        border: 1px solid var(--bg1);
        box-sizing: border-box;
    }

    .vault {
        width: 100%;
        height: 100%;

        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        gap: 10px;
        position: relative;
    }   

    .blocker {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        display: flex;
        background-color: #00000080;
        backdrop-filter: blur(20px);
    }

    .popup {
        
        z-index: 1;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        position: absolute;
    }
</style>