<script lang='ts'>
    import { Disc3, Music} from "@lucide/svelte";
    import {  type PlayerSongContainer, type PlayerSongData } from "../../../backend/sql.svelte";
    import { getID } from "../../../backend/appUtils.svelte";
    import type { UploadDataContainer, UploadProject } from "./modules/uploading.svelte";
    import SongEditor from "./modules/songEditor.svelte";

    let stage = $state(0);

    let newProject: UploadProject = $state({
        songData: [],
        thumbnail: "",
        projectId: getID(),
        projectType: "single",
        projectName: "",
        saving: false,
        errors: {
            valid: true,
            projectName: false,
            projectLength: false,
        }
    })

    const selectProjectType = (pType: "single" | "multiple") => {
        if(newProject.saving){
            return
        }
        newProject.songData.length = 0;
        newProject.projectType = pType;
        if(pType == "single"){
            const id = getID("S_");
            const temp: PlayerSongContainer = {
                id: id,
                name: "",
                duration: 0,
                extension: "",
                ordering: 0,
                bpm: 0,
                parentProject: newProject.projectId
            }

            const temp2: PlayerSongData = {
                id: getID("D_"),
                content: "",
                parentContainer: id
            }

            const uploadDataContainer: UploadDataContainer = {
                song: temp,
                songData: temp2,
                errors: {
                    name: false,
                    content: false,
                },
                fullyReady: false,
                uploadInitiated: false,
            }

            newProject.songData.push(uploadDataContainer);
        }
        stage = 1;
    }

</script>

<div class="newProjectPopup">

    {#if stage == 0}
        <div class="projectTypeSelector">
            <button class="typeButton" onclick={() => selectProjectType('single')}>
                <div class="svgWrapper">
                    <Music size=64 />
                </div>
                <p>Single</p>
            </button>

            <button class="typeButton" onclick={() => selectProjectType('multiple')}>
                <div class="svgWrapper">
                    <Disc3 size=64 />
                </div>
                <p>Multiple</p>
            </button>

        </div>

    {:else if stage == 1}
        <SongEditor bind:projectData={newProject} />
    {/if}
</div>



<style>

    .typeButton {
        width: 100%;
        height: 100%;
        background-color: var(--bg1);
        border: 1px solid var(--bg2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        transition: background-color .25s, border .25s;
    }

    .typeButton * {
        transition: color .25s;
        color: var(--text5);
    }

    .typeButton:hover {
        border: 1px solid var(--main5);
        background-color: var(--bg2);
    }

    .typeButton:hover * {
        color: var(--text1);
    }

    .projectTypeSelector {
        display: flex;
        width: 100%;
        height: 100%;
        width: 390px;
        height: 200px;

        padding: 10px;
        gap: 10px;
        box-sizing: border-box;
        background-color: var(--bg0);
        border: 1px solid var(--bg1);
    }


    .newProjectPopup {
        display: flex;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 500px){
        .projectTypeSelector {
            flex-direction: column;
            max-width: 200px;
            max-height: 390px;
        }
    }
</style>