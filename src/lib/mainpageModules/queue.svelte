<script>
    import { appState } from "../../backend/appState.svelte";
    import { getProjectByID } from "../../backend/collectionUtils.svelte";
    import CurrentPlayingThumbnail from "../modules/currentPlayingThumbnail.svelte";

</script>
<div id="queue" class='scrollOverflow'>
    {#each appState.player.queueManager.shuffle ? appState.player.queueManager.shuffleQueue : appState.player.queueManager.currentQueue as s}
        <div class="song">
            <div class="thumbnail">
                <CurrentPlayingThumbnail size='64px' id='{s.parentProject}' />
            </div>
            <div class="songDataText">
                <p class='text1'>{s.name}</p>
                <p class='text2'>{getProjectByID(s.parentProject)?.name}</p>
            </div>
        </div>
    {/each}
</div>




<style>

    .songDataText {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .songDataText .text1 {
        color: var(--text1);
        font-size: 16px;

        min-width: 40px;
    }

    .songDataText .text2 {
        color: var(--text7);
        font-size: 14px;
    }

    .song {
        width: 100%;
        display: flex;
        gap: 10px;
        box-sizing: border-box;
        align-items: center;
    }

    #queue {
        height: 100%;
        width: 100%;
        gap: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .thumbnail {
        width: 64px;
        height: 64px;
        box-sizing: border-box;
    }

</style>