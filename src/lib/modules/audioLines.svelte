<script lang='ts'>
    import { onDestroy, onMount } from "svelte";
    import { getRandomInt } from "../../backend/appUtils.svelte";
    type props = {
        numOfLines: number,
        speed: number,
        playing: boolean
    }
    let { numOfLines = 7, speed = 250, playing = $bindable()}: props = $props();
    let lines: number[] = $state([]);


let intervalID = $state(0);

const processTick = () => {
    if(!playing){
        for(let i = 0; i < numOfLines; i++){
            lines[i] = 20;
        } 
        return;
    }
    for(let i = 0; i < numOfLines; i++){
        lines[i] = getRandomInt(80) + 20;
    }
}

onMount(() => {
    for(let i = 0; i < numOfLines; i++){
        lines.push(20);
    }
    intervalID = setInterval(() => {
        processTick()
    }, speed);
});

onDestroy(() => {
    clearInterval(intervalID);
});


</script>



<div class="audioLines">
    {#each lines as l}
        <div class="line" style='transition: height {speed}ms linear; height: {l}%;'>

        </div>
    {/each}
</div>

<style>
    .line {
        width: 100%;
        display: flex;
        background-color: var(--text1);
        height: 20px;
    }

    .audioLines {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        justify-content: space-between;
        padding: 10%;
        gap: 10%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>