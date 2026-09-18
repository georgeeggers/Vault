<script lang="ts">
    import { Ellipsis, Files, Folder, FolderPlus, Plus, Spool } from "@lucide/svelte";
    import { TEST_DATA } from "../../backend/dev.svelte";
    import { appState } from "../../backend/appState.svelte";
    import type { SongContainer } from "../../backend/songUtils.svelte";
    import { formatSeconds, getPlayingID, getSelectedSong, getSelectedSongProject, playSongInstantly } from "../../backend/playerUtils.svelte";

    let vaultSearchTerm = $state("")
    let vaultSearchMode = $state(false);

    let expanded: SongContainer | null = $state(null);

    const toggleExpanded = (s: SongContainer) => {
        if(s == expanded){
            expanded = null;
        } else {
            expanded = s;
        }
    }

</script>

<div class="yourVault">
    <div class="vaultSearchControls">
        <label class="vaultSearchContainer" for='vaultInput'>
            <input bind:value={vaultSearchTerm} placeholder="{vaultSearchMode ? "Search for a song" : "Search for a project"}" id='vaultInput'/>
            <div class="spacer" style='height: 20px; border-left: 2px solid var(--text7);'>
            </div>
            <button class="searchTypeToggle" onclick={() => {vaultSearchMode = !vaultSearchMode}}>
                <div class="svgWrapper">
                    {#if !vaultSearchMode}
                        <div class="svgWrapper">
                            <Folder size=20 />
                        </div>
                    {:else}
                        <div class="svgWrapper">
                            <Files size=20 />
                        </div>
                    {/if}
                </div>
            </button>
        </label>
        <button class='btn main'>
            <div class="svgWrapper">
                <Plus size=16 />
            </div>
            New Project
        </button>

    </div>
    {#each appState.projects as project}
        <div class="projectLabel {getSelectedSongProject() == project ? "playing" : ""}">
            <img alt='bleh' src='{project.thumbnail ? project.thumbnail : "/default.png"}'>
            <div class="projectLabelText">
                <p class='text1' contenteditable="true" bind:textContent={project.name} autocapitalize="off">{project.name}</p>
                <p class='text2'>{formatSeconds(project.totalLength, true)}</p>
                {#if project.projectType == "single"}
                    <p class='text2'>Single</p>
                {:else}
                    <p class='text2'>{project.content.length} tracks</p>
                {/if}
            </div>
        </div>
        {#if project.projectType == 'multiple'}
            {#each project.content as songContainer, i}
                <label class="songDataContainer {getPlayingID() == songContainer.id ? "playing" : ""}" for='play{songContainer.id}'>
                    <p>{i + 1}</p>
                    <div class="songData">
                        <div class="songDataText">
                            <p class='text1' contenteditable="true" bind:textContent={songContainer.name} autocapitalize="off"></p>
                            <p class='text2'>{formatSeconds(songContainer.duration, true)}</p>
                        </div>

                        <button class='songDataButton' onclick={() =>toggleExpanded(songContainer)}>
                            <div class="svgWrapper">
                                <Ellipsis size=20 />
                            </div>
                        </button>
                    </div>
                </label>
                <button class='invis' id='play{songContainer.id}' onclick={() => playSongInstantly(songContainer)}>play{songContainer.id}</button>
            {/each}
        {:else}
             <label class="songDataContainer {getPlayingID() == project.content.id  ? "playing" : ""}" for='play{project.content.id}'>
                <p>1</p>
                <div class="songData">
                    <div class="songDataText">
                        <p class='text1'>{project.content.name}</p>
                        <p class='text2'>{formatSeconds(project.content.duration, true)}</p>
                    </div>

                    <button class='songDataButton' onclick={() =>toggleExpanded(project.content)}>
                        <div class="svgWrapper">
                            <Ellipsis size=20 />
                        </div>
                    </button>

                </div>
            </label>

            <button class='invis' id='play{project.content.id}' onclick={() => playSongInstantly(project.content)}>play{project.content.id}</button>


        {/if}

    {/each}
</div>

<style>

    .editContainer {
        display: flex;
        flex-direction: column;
        margin-left: 60px;
        background-color: white;
        height: 40px;
        padding: 10px;
        box-sizing: border-box;
    }


    .btn.main {
        align-items: center;
        justify-content: center;
        font-size: 16px;
        height: 40px;
        max-height: 40px;
    }

    .searchTypeToggle {
        min-width: 40px;
        min-height: 40px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
    }

    .searchTypeToggle * {
        color: var(--text7);
        transition: color .25s;
    }

    .searchTypeToggle:hover * {
        color: var(--main5);
    }

    .vaultSearchControls {
        width: 100%;
        display: flex;
        flex-direction: row;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        box-sizing: border-box;
    }

    .vaultSearchContainer {
        max-width: 200px;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        height: 100%;
        background-color: var(--bg1);
    }

    .vaultSearchContainer input {
        padding: 10px;
        box-sizing: border-box;
        background: none;
        border: none;
        font-size: 16px;
        width: 100%;
        outline: none;
        color: var(--text1);
    }

    .vaultSearchContainer input::placeholder {
        color: var(--text7);
    }

    .songDataText {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .text1 {
        outline: none;
        cursor: text;
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

    .songData {
        height: 100%;
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        padding: 0px 10px 0px 10px;
        transition: background-color .25s;
    }

    .songDataButton {
        background: none;
        border: none;
        margin-left: auto;
        cursor: pointer;
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

    .songDataContainer > p, .songDataButton * {
        color: var(--text7);
        font-size: 16px;
        transition: color .25s;
    }



    .songDataContainer:hover > p, .songDataContainer:hover .songDataButton * {
        color: var(--text1);
    }

    .songDataButton:hover * {
        color: var(--main5) !important;
    }

    .playing .songDataButton:hover * {
        color: var(--main6) !important;
    }

    .songDataContainer:hover .songData {
        background-color: var(--bg1);
    }

    .playing > p {
        color: var(--main5) !important;
    }

    .playing .songDataButton * {
        color: var(--text1) !important;
    }

    .playing .songData {
        background-color: var(--main3) !important;
    }

    .playing .songData * {
        color: var(--text1);
    }

    .yourVault {
        width: 100%;
        height: fit-content;
        gap: 10px;
        background-color: var(--bg0);
        border: 1px solid var(--bg1);
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
        align-items: center;
    }

    .projectLabel.playing {
        background-color: var(--main5) !important;
    }

    .projectLabel img {
        width: 128px;
        height: auto;
        max-height: 128px;
        aspect-ratio: 1/1;
    }

    .projectLabelText {
        width: 100%;
        display: flex;
        padding: 0px 10px 10px 20px;
        box-sizing: border-box;
        flex-direction: column;
        justify-content: center;
        
    }

    .projectLabelText .text1 {
        font-size: 32px;
        font-weight: bold;
    }

    .projectLabel .text2 {
        font-size: 14px;
        color: var(--text4);
    }

    @media (max-width: 675px){
        .vaultSearchControls {
            flex-direction: column;
            height: fit-content;
        }
    }

</style>
