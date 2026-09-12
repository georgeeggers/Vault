<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { TEST_SONG_DATA } from "../../backend/dev.svelte";
    import { Howl, Howler } from "howler";
    import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Cylinder, FastForward, Pause, Play, Rewind, SkipBack, SkipForward } from "@lucide/svelte";

let songLength = $state(67);
let progress = $state(0);
let sliderProgress = $state(0);


const formatSeconds = (input: number) => {
    input = Math.round(input);
    const seconds = input % 60;
    input -= seconds;
    return `${input / 60}:${seconds <= 9 ? `0${seconds}` : seconds}`
}

let currentSong: Howl | null = $state(null);
let preloadedSong: Howl | null = $state(null);
let intervalID = 0;

const startPlaybarTracking = (song: Howl | null) => {
    if(song){
        songLength = song.duration();
        progress = song.seek();
        intervalID = setInterval(() => {
            progress = song.seek();
            sliderProgress = progress * 100;
        }, 1000);
    }
}

const stopPlaybarTracking = () => {
    clearInterval(intervalID);
}

onMount(() => {
    currentSong = new Howl({
        src: ['/test.mp3']
    })

    currentSong.volume(0.1);
    currentSong.on("play", () => startPlaybarTracking(currentSong));
    
    currentSong.play();

});

const stopSong = () => {
    if(currentSong){
        currentSong.stop();
        clearInterval(intervalID);
    }
}

onDestroy(() => {
    clearInterval(intervalID);
    if(currentSong){
        currentSong.stop();
    }
})

const seek = (e: any) => {
    stopPlaybarTracking();
    progress = sliderProgress / 100;
}

const stopSeek = (e: any) => {
    if(currentSong){
        currentSong.seek(sliderProgress / 100);
        startPlaybarTracking(currentSong);
    }
}

let playing = $state(false);

</script>



    <div class="playerControls">
        <div class="playerButtons">

            <button id="previous">
                <div class="svgWrapper">
                    <Rewind size=20 fill='currentColor' strokeWidth={0}/>
                </div>
            </button>

            <button id="playPause" onclick={() => {playing = !playing}}>
                {#if playing}
                    <div class="svgWrapper">
                        <Play size=20 fill='currentColor' strokeWidth={0}/>
                    </div>
                {:else}
                    <div class="svgWrapper">
                        <Pause size=20 fill='currentColor' strokeWidth={0}/>
                    </div>
                {/if}
            </button>

            <button id="skip">
                <div class="svgWrapper">
                    <FastForward size=20 fill='currentColor' strokeWidth={0}/>
                </div>
            </button>



            {#if currentSong}
                <button onclick={stopSong}>Stop</button>
            {/if}
        </div>



        <div class="playerDurationSlider">
            <div class="durationIndicatorContainer left">
                <p>
                    {formatSeconds(progress)}
                </p>
            </div>

            
            <div class="sliderInputContainer">
                <input id='playerSliderInput' type='range' min="0" max="{songLength * 100}" bind:value={sliderProgress} oninput={(e) => seek(e)} onmousedown={(e) => seek(e)} onmouseup={(e) => stopSeek(e)}>
                
                <div id="background">

                </div>
                <div id="progressIndicator" style='width: calc((100% - 16px) * {(sliderProgress / songLength) / 100});'>

                </div>
            </div>

            <div class="durationIndicatorContainer right">
                <p>
                    {formatSeconds(songLength)}
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
        background-color: var(--bg2);
    }

    #playPause * {
        color: var(--main5);
    }

    #skip *, #previous * {
        color: var(--text5);
        transition: color .1s;
    }

    #skip:hover *, #previous:hover * {
        color: var(--main5);
    }

    .playerControls {
        width: 400px;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        padding: 5px;
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

    #playerSliderInput {
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

    #background {
        width: calc(100% - 16px);
        display: flex;
        height: 10px;
        background-color: var(--bg1);
        position: absolute;
        left: 8px;
        pointer-events: none;
        z-index: 1;
    }

    #progressIndicator {
        position: absolute;
        left: 8px;
        height: 10px;
        box-sizing: border-box;
        display: flex;
        background-color: var(--main3);
        z-index: 2;
        pointer-events: none;
    }

    .sliderInputContainer {
        width: calc(100% - 90px);
        display: flex;
        position: relative;
        height: 20px;
        align-items: center;
        justify-content: center;
    }

    .durationIndicatorContainer {
        width: 40px;
        box-sizing: border-box;
    }

    .durationIndicatorContainer p {
        color: var(--text5);
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