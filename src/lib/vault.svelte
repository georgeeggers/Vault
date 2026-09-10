<script>
    import { Settings2 } from "@lucide/svelte";


const TEST_DATA = ["/bart.png", "/deadPlants.png", "/mood.png", "/randomStuff.png", "/ratherbdead.png"]
let selected = $state("");

</script>

<div class="vault">
    <div class="containers">
        {#each TEST_DATA as t}
            <label class="song" for='{t}'>
                <img src="{t}" alt='poop'>
                <div class="text">
                    <p>{t}</p>
                    <div class="informationArea">
                        <p>67m 2s</p>
                        <div class="svgWrapper">
                            <Settings2 size=12 />
                        </div>
                    </div>
                </div>
                <button onclick={() => {selected=t}} id="{t}" class='invis'>{t}</button>
            </label>
        {/each}
    </div>

    <div class="nowPlaying">
        <img src='{selected}' alt='bleh'>
    </div>
</div>

<style>

    .nowPlaying {
        width: 400px;
        height: 100%;
        border-radius: calc(var(--border-radius) + 10px);
        padding: 10px;
        background-color: var(--bg2);
        box-sizing: border-box;
    }

    .nowPlaying img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        border-radius: var(--border-radius);
    }

    .informationArea {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .vault {
        width: 100%;
        height: 100%;

        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 10px
    }   

    .containers {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 30px;
        justify-content: center;
        flex-wrap: wrap;
        background-color: var(--bg2);
        border-radius: calc(var(--border-radius) + 10px);
        padding: 10px;
        box-sizing: border-box;
    }

    .song {
        width: 160px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--bg2);
        border-radius: var(--border-radius);
        height: fit-content;
    }

    .song img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        border-radius: 15px;
    }

    .text {
        width: 100%;
        height: fit-content;
        padding: 10px;
        box-sizing: border-box;
    }

    .text > p {
        text-wrap: anywhere;
    }

    .informationArea {
        display: flex;
        flex-direction: row;
    }

    .informationArea p {
        color: var(--text4);
        font-size: 12px;

    }

</style>