<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { TEST_SONG_DATA, testContainer1, testContainer2 } from "../../backend/dev.svelte";
    import { Howl, Howler } from "howler";
    import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Cylinder, FastForward, Pause, Play, Rewind, Shuffle, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX } from "@lucide/svelte";
    import { appState } from "../../backend/appState.svelte";
    import { formatSeconds, getSelectedSong, loadSong, playPause, seek, selectNext, selectSong, stopSeek, stopSong, updateVolume, type HowlInstance } from "../../backend/playerUtils.svelte";


onMount(() => {
    // in the actual app, this loading will be handled by the queue system
    loadSong(testContainer1);
    loadSong(testContainer2);
    setTimeout(() => {
        selectSong(appState.player.songContainer1);
    }, 500);
});



onDestroy(() => {
    if(appState.player.currentSong){
        stopSong();
    }
})






</script>



    <div class="playerControls">
        <div class="playerButtons">

            <button id="shuffle" style='margin-left: auto;'>
                <div class="svgWrapper">
                    <Shuffle size=18 />
                </div>
            </button>

            <button id="previous">
                <div class="svgWrapper">
                    <Rewind size=20 fill='currentColor' strokeWidth={0}/>
                </div>
            </button>

            <button id="playPause" onclick={playPause}>
                {#if !appState.player.playing}
                    <div class="svgWrapper">
                        <Play size=20 fill='currentColor' strokeWidth={0}/>
                    </div>
                {:else}
                    <div class="svgWrapper">
                        <Pause size=20 fill='currentColor' strokeWidth={0}/>
                    </div>
                {/if}
            </button>

            <button id="skip" onclick={selectNext}>
                <div class="svgWrapper">
                    <FastForward size=20 fill='currentColor' strokeWidth={0}/>
                </div>
            </button>

            <div id="volumeController">
                <div class="svgWrapper">
                    {#if appState.player.volume > .66}
                        <Volume2 size=20 />
                    {:else if appState.player.volume > .33}
                        <Volume1 size=20 />
                    {:else if appState.player.volume > 0}
                        <Volume size=20 />
                    {:else}
                        <VolumeX size=20 />
                    {/if}
                </div>
                <div id="volumeInputContainer">

                    <div class="background">

                    </div>
                    <div class="progressIndicator" style='width: calc((100% - 16px) * {appState.player.volume});'>

                    </div>

                    <input id='volumeControllerSlider' bind:value={appState.player.volume} min="0" max="1" step="0.01" type='range' oninput={updateVolume}>
                </div>

            </div>
        </div>



        <div class="playerDurationSlider">
            <div class="durationIndicatorContainer left">
                <p>
                    {formatSeconds(appState.player.progress)}
                </p>
            </div>

            
            <div class="sliderInputContainer">
                <input id='playerSliderInput' type='range' min="0" max="{appState.player.duration * 100}" bind:value={appState.player.sliderProgress} oninput={(e) => seek(e)} onmousedown={(e) => seek(e)} onmouseup={(e) => stopSeek(e)}>
                
                <div class="background">

                </div>
                <div class="progressIndicator" style='width: calc((100% - 16px) * {(appState.player.sliderProgress / appState.player.duration) / 100});'>

                </div>
            </div>

            <div class="durationIndicatorContainer right">
                <p>
                    {formatSeconds(appState.player.duration)}
                </p>
            </div>
        </div>



    </div>

<style>



    .playerButtons {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 10px;
        height: calc(100% - 20px);
        align-items: center;
        justify-content: center;
        padding: 5px 20px 5px 20px;
        box-sizing: border-box;
    }

    .playerButtons button {
        background: none;
        border: none;
        outline: none !important;
        cursor: pointer;
        transition: scale .1s;
    }

    .playerButtons button:hover {
        scale: 1.05;
    }

    #playPause {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg1);
    }

    #playPause * {
        color: var(--main5);
    }

    #skip *, #previous *, #shuffle * {
        color: var(--text7);
        transition: color .1s;
    }

    #skip:hover *, #previous:hover *, #shuffle:hover * {
        color: var(--main5);
    }

    .playerControls {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .playerDurationSlider {
        width: 100%;
        height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    #playerSliderInput, #volumeControllerSlider {
        width: 100%;
        z-index: 3;
    }



    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        height: 10px;
        background: transparent;
        align-items: center;
        display: flex;
        padding: 0px;
        margin: 0px;
        outline: none !important;
        cursor: pointer;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        padding: 0px;
        margin: 0px;
        height: 16px;
    }

    input[type="range"]::-webkit-slider-thumb {
        visibility: hidden;
        pointer-events: none;
        z-index: 5;
    }

    input[type="range"]:hover::-webkit-slider-thumb {
        visibility: visible;
        pointer-events: all;
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: var(--border-radius);
        background: var(--main5);
    }

    .background {
        width: calc(100% - 16px);
        display: flex;
        height: 10px;
        background-color: var(--bg1);
        position: absolute;
        left: 8px;
        pointer-events: none;
        z-index: 1;
    }

    .progressIndicator {
        position: absolute;
        left: 8px;
        height: 10px;
        box-sizing: border-box;
        display: flex;
        background-color: var(--main3);
        z-index: 2;
        pointer-events: none;
    }

    .sliderInputContainer, #volumeInputContainer {
        width: calc(100% - 90px);
        display: flex;
        position: relative;
        height: 20px;
        align-items: center;
        justify-content: center;
    }

    #volumeInputContainer {
        width: 100%;
    }

    #volumeController {
        display: flex;
        flex-direction: row;
        margin-left: auto;
        gap: 2px;

    }

    #volumeController .svgWrapper {
        color: var(--text7);
    }


    .durationIndicatorContainer {
        width: 40px;
        box-sizing: border-box;
    }

    .durationIndicatorContainer p {
        color: var(--text7);
        font-size: 14px;
    }

    .durationIndicatorContainer.left {
        justify-content: right;
        text-align: right;
    }
    .durationIndicatorContainer.right {
        justify-content: left;
        text-align: left;
    }


</style>