<script lang="ts">
    import { TEST_DATA } from "../../backend/dev.svelte";

</script>

<div class="yourVault">
    <p id='titleText'>Your Vault</p>
    {#each TEST_DATA as project}
        <div class="projectLabel">
            <img alt='bleh' src='{project}'>
            <div class="projectLabelText">
                <p class='text1'>{project}</p>
                <p class='text2'>67m 2s</p>
            </div>
        </div>

        {#each {length: 3} as _, i}
            <div class="songDataContainer {project == "/bart.png" && i == 0 ? "playing" : ""}">
                <p>{i + 1}</p>
                <div class="songData">
                    <div class="songDataText">
                        <p class='text1'>Example song</p>
                        <p class='text2'>67s</p>

                    </div>
                </div>
            </div>
        {/each}

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
    }

    .songDataText .text2 {
        color: var(--text5);
        font-size: 14px;
    }

    .songData {
        height: 100%;
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        padding-left: 10px;
        transition: background-color .25s;
    }


    .songDataContainer {
        width: 100%;
        display: flex;
        flex-direction: row;
        height: 60px;
        align-items: center;
        padding: 0px 0px 0px 30px;
        box-sizing: border-box;
        gap: 20px;
        cursor: pointer;
    }

    .songDataContainer > p {
        color: var(--text5);
        font-size: 16px;
        transition: color .25s;
    }

    .songDataContainer:hover > p {
        color: var(--text1);
    }

    .songDataContainer:hover .songData {
        background-color: var(--bg2);
    }

    .playing > p {
        color: var(--main5) !important;
    }

    .playing .songData {
        background-color: var(--main3) !important;
    }

    #titleText {
        font-size: 20px;
    }

    .yourVault {
        width: 100%;
        height: fit-content;
        gap: 10px;
        background-color: var(--bg1);
        border-radius: var(--border-radius);
        padding: var(--medPadding);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .projectLabel {
        width: 100%;
        display: flex;
        margin-top: 30px;
    }

    .projectLabel img {
        width: 120px;
        height: auto;
        aspect-ratio: 1/1;
    }

    .projectLabelText {
        width: 100%;
        display: flex;
        padding: 0px 10px 10px 10px;
        box-sizing: border-box;
        flex-direction: column;
    }

    .projectLabelText .text1 {
        font-size: 32px;
        font-weight: bold;
    }

    .projectLabel .text2 {
        font-size: 14px;
        color: var(--text4);
    }

</style>
