<script>
    import { appState } from "../backend/appState.svelte";
    import { loadManager } from "../backend/howlManagers.svelte";
    import PlayerControls from "./mainpageModules/playerControls.svelte";
    import CurrentPlayingThumbnail from "./modules/currentPlayingThumbnail.svelte";
    import Topbar from "./topbar.svelte";


</script>



<div class="miniplayer">

    <div class="topbarContainer hideTillHover">
        <Topbar />
    </div>

    <div class="blocker" style='transform: translate(calc(-50vw * {(appState.player.sliderProgress / appState.player.duration) / 100}), -50%);'>
        <CurrentPlayingThumbnail size="max(150vw, 150vh);"/>
    </div>
    <div class="playerArea">
        {#if loadManager.currentSong}
            <p class='songName hideTillHover'>{loadManager.currentSong.song.name}</p>
        {:else}
            <p class='songName hideTillHover'>Loading...</p>
        {/if}


        <CurrentPlayingThumbnail size="100%" />
        <div class="controlContainer hideTillHover">
            <div class="controls">
                <PlayerControls />
            </div>
        </div>
    </div>
</div>



<style>

    .topbarContainer {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        z-index: 2;
    }

    .songName {
        position: absolute;
        left: 10px;
        bottom: 90px;
        font-size: 16px;
        font-weight: bold;
        backdrop-filter: blur(5px) brightness(0.5);
        padding: 10px;
    }

    .controlContainer {
        width: 100%;
        height: 80px;
        padding: 10px;
        box-sizing: border-box;
        position: absolute;
        background-color: #00000080;
        backdrop-filter: blur(5px);
        bottom: 0px;
    }

    .miniplayer {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .playerArea {
        width: min(50vw, 50vh);
        height: min(50vw, 50vh);
        display: flex;
        position: relative;
    }


    .hideTillHover {
        opacity: 0;
        transition: opacity .5s;
    }

    .miniplayer:hover > .hideTillHover {
        opacity: 1.0;
    }


    .playerArea:hover .hideTillHover {
        opacity: 1.0;
    }

    .blocker {
        position: fixed;
        filter: blur(20px);
        top: 50%;
        left: 0px;
        z-index: -1;
        transition: transform 1s linear;
    }

    @media (max-width: 750px){


        .playerArea {
            width: min(100vw, 100vh);
            height: min(100vw, 100vh);
            background-color: red;
            display: flex;
            position: relative;
        }

    }

    @media (max-height: 750px){


        .playerArea {
            width: min(100vw, 100vh);
            height: min(100vw, 100vh);
            background-color: red;
            display: flex;
            position: relative;
        }

    }


</style>

