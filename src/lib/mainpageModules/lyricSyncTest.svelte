<script lang="ts">
    import { onMount } from "svelte";


type Lyric = {
  lyric: string,
  time: number,
  totalTime: number,
}

let testLyrics: Lyric[] = $state([]);

onMount(() => {
  for(let i = 0; i < 20; i++){
    testLyrics.push(getRandomLyric());
  }
});

const times = [1000, 2000, 3000, 4000];

const getRandomLyric = () => {
  return {
    lyric: ["Test lyric", "Test lyric 2", "Test lyric 3", "test lyric 4 (lyric)"][testLyrics.length % 4],
    time: times[testLyrics.length % 4],
    totalTime: (testLyrics.length > 0 ? testLyrics[testLyrics.length - 1].totalTime : 0) + times[testLyrics.length % 4]
  }
}

let timeoutID = $state(0);
let lyricIndex = $state(-1);

const processLyric = (index: number) => {
  if(testLyrics.length > lyricIndex + 1){
    lyricIndex += 1;
    const currentLyric = testLyrics[lyricIndex];
    scrollToLyric(lyricIndex)

    timeoutID = setTimeout(() => {
      processLyric(lyricIndex);
    }, currentLyric.time)
  }
}

let targetDiv: HTMLDivElement | null = $state(null);

let testNumber: number = $state(0);
const startLyricSync = (timeElapsed: number) => {
  let index = 0;
  clearTimeout(timeoutID);
  for(let i of testLyrics){
    if(i.totalTime > timeElapsed){
      lyricIndex = index - 1;
      scrollToLyric(lyricIndex);
      timeoutID = setTimeout(() => {processLyric(lyricIndex)}, i.totalTime - timeElapsed);
      break;
    }
    index++;
  }
}

const scrollToLyric = (index: number) => {
  if(targetDiv){
    const target = document.getElementById(`lyric_${index}`);
    if(target){
      targetDiv.scrollTo({
        top: target.offsetTop - targetDiv.offsetHeight / 2,
        behavior: 'smooth'
      })
    }
  }
}



</script>



<div id="lyricDisplay" class='scrollOverflow' bind:this={targetDiv}>
  {#each testLyrics as l, i}
    <label for='jumpto_lyric_{i}' class='lyricContainer'>
      <p id="lyric_{i}" class='{lyricIndex == i ? "active" : ""}'>{l.lyric}<i style='font-size: 10px;'>{l.totalTime}</i></p>
    </label>
    <button class='invis' id='jumpto_lyric_{i}' onclick={() => startLyricSync(l.totalTime)}>bleh</button>
  {/each}
</div>

<input bind:value={testNumber}>
<button class='btn main' onclick={() => startLyricSync(testNumber)}>Process</button>



<style>
  #lyricDisplay {
    width: 100%;
    background-color: var(--bg1);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    min-height: 450px;
  }

  #lyricDisplay p {
    color: var(--text5);
    font-size: 30px;
  }



  .lyricContainer *, .lyricContainer {
    cursor: pointer;
    transition: color .25s;
  }

  .lyricContainer:hover *:not(.active){
    color: var(--text3) !important;
  }

  .active {
    color: var(--text1) !important;
  }

</style>