<script>
    import { appState } from "../backend/appState.svelte";
    import { deleteAllLocal, getDBDataFromProject, loadProjects, saveOrUpdateProject, saveOrUpdateSong } from "../backend/sql.svelte";
    import LyricSyncTest from "./mainpageModules/lyricSyncTest.svelte";
    import NewProjectPopup from "./mainpageModules/newProjectPopup.svelte";
    import ProjectView from "./mainpageModules/projectView.svelte";
    import YourVault from "./mainpageModules/yourVault.svelte";
    import CurrentPlayingThumbnail from "./modules/currentPlayingThumbnail.svelte";


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

            <button class='btn main' onclick={loadProjects}>Test load</button>
            <button class='btn fail' onclick={deleteAllLocal}>Delete Everything</button>
            <p>{appState.player.queueManager.currentQueue.length}</p>
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