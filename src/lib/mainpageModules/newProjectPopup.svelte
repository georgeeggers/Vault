<script lang='ts'>
    import { ChevronDown, ChevronUp, Disc3, FrownIcon, Music, Plus, SaveCheck, Trash2, Upload, X } from "@lucide/svelte";
    import { formatSeconds } from "../../backend/playerUtils.svelte";
    import { getDBDataFromProject, loadProjects, saveOrUpdateProject, saveOrUpdateSong, saveOrUpdateSongData, uInt8ArrayToUrl, type PlayerProject, type PlayerSongContainer, type PlayerSongData } from "../../backend/sql.svelte";
    import { addNotification, getID } from "../../backend/appUtils.svelte";
    import { onDestroy, onMount } from "svelte";
    import PlaceholderImage from "../modules/placeholderImage.svelte";
    import { appState } from "../../backend/appState.svelte";
    import { calcTempo } from "../../backend/bpmGuessing";


    let stage = $state(0);
    let projectType: "single" | "multiple" = $state("single");
    let thumbnailUrl: string = $state("");
    let projectName = $state("");
    let projectID = $state("");

    let URLS: string[] = $state([]);

    onDestroy(() => {

        // attempt to clean up as many object urls as we can to help prevent memory leaks :)
        for(let i of URLS){
            URL.revokeObjectURL(i);
            console.log(i);
            uploadData.length = 0;
        }
    });

    type UploadDataContainer = {
        song: PlayerSongContainer,
        songData: PlayerSongData,
        errors: {
            name: boolean,
            content: boolean,
        },
        fullyReady: boolean
    }



    let uploadData: UploadDataContainer[] = $state([]);

    onMount(async () => {
        projectID = getID("P_");
    })




    const selectProjectType = (pType: "single" | "multiple") => {
        if(saving){
            return
        }
        uploadData.length = 0;
        projectType = pType;
        if(pType == "single"){
            addSong();
        }
        stage = 1;
    }

    const updateSongInformation = async (target: number, file: any) => {
        uploadData[target].songData.content = URL.createObjectURL(file);
        URLS.push(uploadData[target].songData.content)
        uploadData[target].song.extension = file.type.split("/")[1];
        if(uploadData[target].song.name == ""){
            uploadData[target].song.name = file.name;
        }
        // all this just gets the duration of the song
        var audio = document.createElement('audio');
        var reader = new FileReader();
        if (file) {
            reader.onload = function (e) {
                // @ts-ignore
                audio.src = e.target.result;
                audio.addEventListener('loadedmetadata', function(){
                    const duration = audio.duration;
                    uploadData[target].song.duration = duration;

                },false);
            }
            const result = await calcTempo(file);
            uploadData[target].song.bpm = Math.round(result);
        }

        await reader.readAsDataURL(file);

        uploadData[target].fullyReady = true;


    }

    async function handleFileChange(e: Event, target: number){
        e.preventDefault();
        if(saving){
            return
        }
        console.log(e);
        let files;
        if(e.type == "change"){
            // @ts-ignore
            files = e.target.files;
        } else if (e.type == "drop"){
            // @ts-ignore
            files = e.dataTransfer.files;
        }

        for(let file of files){
            if(target == -2){
                const index = uploadData.length;
                addSong();
                uploadData[index].fullyReady = false;
                updateSongInformation(index, file);
            } else if(target == -1){
                thumbnailUrl = URL.createObjectURL(file);
                URLS.push(thumbnailUrl);
            } else {          
                uploadData[target].fullyReady = false;
                updateSongInformation(target, file);
            }
        }

    };

    const addSong = () => {
        if(saving){
            return
        }
        const id = getID("S_");
        const temp: PlayerSongContainer = {
            id: id,
            name: "",
            duration: 0,
            extension: "",
            ordering: uploadData.length,
            bpm: 0,
            parentProject: projectID
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
        }

        uploadData.push(uploadDataContainer);

    }

    const getTotalLength = (data: UploadDataContainer[]) => {
        let result = 0;
        for(let i of data){
            result += i.song.duration;
        }
        return result
    }

    let totalLength = $derived(getTotalLength(uploadData))

    const moveSong = (index: number, moveBack: boolean = true) => {

        if(saving){
            return
        }

        if(index > 0 && moveBack){
            let temp = uploadData[index - 1];
            uploadData[index - 1] = uploadData[index]
            uploadData[index] = temp;

            uploadData[index - 1].song.ordering--;
            uploadData[index].song.ordering++;

        } else if (index < uploadData.length - 1 && !moveBack){
            let temp = uploadData[index + 1];
            uploadData[index + 1] = uploadData[index]
            uploadData[index] = temp;

            uploadData[index].song.ordering--;
            uploadData[index + 1].song.ordering++;
        }
    }

    type Errors = {
        valid: boolean,
        projectName: boolean,
        projectLength: boolean

    };

    let errors: Errors = $state({
        valid: true,
        projectName: false,
        projectLength: false,
    })


    const resetErrors = () => {
        errors.projectLength = false;
        errors.projectName = false;
        for(let i of uploadData){
            i.errors.name = false;
            i.errors.content = false;
        }
    }

    let saving = $state(false);

    let saveProgress = $state(-1);
    let maxSaveTime = $state(0);
    let attemptSave = async () => {
        if(saving){
            return
        }

        for(let i of uploadData){
            if(!i.fullyReady){
                addNotification('Processing... please wait', 'warn');
                return;
            }
        }

        resetErrors();

        if(projectType == "single"){
            projectName = uploadData[0].song.name;
        }

        if(projectName == ""){
            errors.valid = false;
            errors.projectName = true;
        }

        if(uploadData.length == 0){
            errors.valid = false;
            errors.projectLength = true;
        }

        let index = 0;
        for(let i of uploadData){
            if(uploadData[index].songData.content == ""){
                errors.valid = false;
                i.errors.content = true;
            }

            if(i.song.name == ""){
                errors.valid = false;
                i.errors.name = true;
            }
            index++;
        }


        if(!errors.valid){
            addNotification("Invalid fields!", 'fail');

        } else {
            saving = true;
            saveProgress = -1;
            addNotification("Attempting Save", 'info');
            const project: PlayerProject = {
                id: projectID,
                name: projectName,
                projectType: projectType,
                totalLength: totalLength,
                songs: uploadData.map((a) => {return a.song}),
                thumbnail: thumbnailUrl
            }

            const response = await getDBDataFromProject(project, uploadData.map((a) => {return a.songData}));

            maxSaveTime = 1 + response.songs.length + response.data.length;
            await saveOrUpdateProject(response.project);
            saveProgress++;
            for(let i of response.songs){
                await saveOrUpdateSong(i);
                saveProgress++;

            }

            for(let i of response.data){
                await saveOrUpdateSongData(i);
                saveProgress++;
            }

            saving = false;
            appState.popupShowing = false;
            loadProjects();
            addNotification("Project Saved!", 'succcess');
        }
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
        <div class="projectCreator scrollOverflow">
            <div class="projectRow">
                <label class='projectThumbnail' for='uploadThumbnail'
                    ondrop={(e) => {
                        e.preventDefault();
                        handleFileChange(e, -1);
                    }}

                    ondragover={(e) => {
                        e.preventDefault();
                    }}

                    ondragenter={(e) => {
                        e.preventDefault()
                    }}

                    ondragleave={(e) => {
                        e.preventDefault()
                    }}           
                >
                    {#if thumbnailUrl == ""}
                        <!--
                        
                    
                    
                        -->
                        {#if projectType == 'single'}
                            <PlaceholderImage />
                        {:else}
                            <PlaceholderImage />
                        {/if}

                    {:else}
                        <img src='{thumbnailUrl}' alt='ERROR'>
                    {/if}
                    <div class="uploadPopup">
                        <div class="svgWrapper" style='color: var(--text1);'>
                            <Upload size=64 />
                        </div>
                    </div>
                </label>
                <input type='file' 
                    class='invis'
                    id='uploadThumbnail'
                    accept="image/*"
                    onchange={(event) => handleFileChange(event, -1)}
                    ondrop={(e) => handleFileChange(e, -1)}
                >

                <div class="projectColumn">
                    {#if projectType == "multiple"}
                        <input type='text' bind:value={projectName} placeholder="Project" id='nameProject' autocapitalize="off" autocorrect="off" autocomplete='off' class='{errors.projectName ? "error" : "noBorder"} {saveProgress >= 1 ? "saveProgressComplete" : ""}'>
                    {:else}
                        <input type='text' bind:value={uploadData[0].song.name} placeholder="Project" id='nameProject' autocapitalize="off" autocorrect="off" autocomplete='off' class='{errors.projectName ? "error" : "noBorder"} {saveProgress >= 1 ? "saveProgressComplete" : ""}'>
                    {/if}

                    <div class="projectLabelText">
                        <p class='text2'>{formatSeconds(totalLength, true)}</p>
                        {#if projectType == "single"}
                            <p class='text2'>Single</p>
                        {:else}
                            <p class='text2'>{uploadData.length} tracks</p>
                        {/if}
                    </div>
                </div>
            </div>

            <div class="spacer">

            </div>

            {#if projectType == 'multiple'}
                <div class="projectRow">
                    <p>Tracks</p>
                    <button class='btn main {errors.projectLength ? "error" : "noBorder"}' onclick={addSong} >
                        <div class="svgWrapper">
                            <Plus size=16 />
                        </div>
                        Add Song
                    </button>
                </div>
            {/if}

            {#each uploadData as upload, i}
                <div class="songDataContainer">
                    <p>{String(i + 1).padStart(String(uploadData.length).length, '0')}</p>
                    <div class="songData">
                        <div class="songDataText">
                            <input class='songName {upload.errors.name ? "error" : "noBorder"} {saveProgress >= i + 2 ? "saveProgressComplete" : ""}' placeholder="Track {i + 1}" bind:value={upload.song.name} autocapitalize="off" autocorrect="off" autocomplete='off'>
                            <label class="bpmInput" for='bpmSelector{i}'>
                                <input bind:value={upload.song.bpm} placeholder="0" id='bpmSelector{i}'>
                                <p>bpm</p>
                            </label>
                        </div>


                        <label class="uploadHandler {upload.errors.content ? "error" : "noBorder"} {saveProgress >= i + 2 + uploadData.length ? "saveProgressComplete" : ""}" style='margin-left: auto;' for='uploadFile{upload.song.id}'
                            ondrop={(e) => {
                                e.preventDefault();
                                handleFileChange(e, i);
                            }}

                            ondragover={(e) => {
                                e.preventDefault();
                            }}

                            ondragenter={(e) => {
                                e.preventDefault()
                            }}

                            ondragleave={(e) => {
                                e.preventDefault()
                            }}           
                        >
                            {#if uploadData[i].songData.content == ""}
                                <div class="svgWrapper">
                                    <Upload size=20 />
                                </div>
                            {:else}
                                <div class="svgWrapper" style='color: var(--main5);'>
                                    <Music size=20 />
                                </div>
                            {/if}
                        </label>

                        <input type='file' id='uploadFile{upload.song.id}' class='invis'
                            accept="audio/*"
                            onchange={(event) => handleFileChange(event, i)}
                            ondrop={(e) => handleFileChange(e, i)}
                        >

                        {#if uploadData.length > 1}

                            <button class="uploadHandler" onclick={() => moveSong(i)}>
                                <div class="svgWrapper">
                                    <ChevronUp size=20/>
                                </div>
                            </button>

                            <button class="uploadHandler" onclick={() => moveSong(i, false)}>
                                <div class="svgWrapper">
                                    <ChevronDown size=20/>
                                </div>
                            </button>

                        {/if}

                        {#if projectType == "multiple"}

                            <button class="uploadHandler" onclick={() => {uploadData.splice(i, 1)}}>
                                <div class="svgWrapper">
                                    <Trash2 size=20/>
                                </div>
                            </button>

                        {/if}

                    </div>
                </div>
            {/each}

            {#if projectType == "multiple"}
                <label id='multiUpload' for='quickUpload'
                    ondrop={(e) => {
                        e.preventDefault();
                        handleFileChange(e, -2);
                    }}

                    ondragover={(e) => {
                        e.preventDefault();
                    }}

                    ondragenter={(e) => {
                        e.preventDefault()
                    }}

                    ondragleave={(e) => {
                        e.preventDefault()
                    }}           
                >
                    <div class="svgWrapper" style='color: var(--text1);'>
                        <Upload size=20 />
                    </div>
                    <p style='color: var(--text1);'>Upload Multiple</p>
                </label>
                <input type='file' id='quickUpload'
                    class='invis'
                    multiple
                    accept="audio/*"
                    onchange={(event) => handleFileChange(event, -2)}
                    ondrop={(e) => handleFileChange(e, -2)}
                >
            {/if}

            <div class="projectRow" style='margin-top: auto;'>

                {#if !saving}
                    <button class='btn fail' style='' onclick={() => {appState.popupShowing = false}}>
                        <div class="svgWrapper">
                            <X size=20 />
                        </div>
                        <p>Exit</p>
                    </button>
                {/if}

                {#if !saving}
                    <button class='btn main' style='margin-left: auto; width: 125px;' onclick={attemptSave}>
                        <div class="svgWrapper">
                            <SaveCheck size=20 />
                        </div>
                        <p>Save Project</p>
                    </button>
                {:else}
                    <div id="saveProgress">
                        <div id="saveProgressBar" style='width: calc((100% - 20px)* {saveProgress / maxSaveTime});'>

                        </div>
                        <div id="saveProgressBarIncomplete">
                            
                        </div>
                    </div>
                {/if}
            </div>

        </div>
    {/if}
</div>



<style>

    .bpmInput {
        width: fit-content;
        display: flex;
        flex-direction: row;
        background-color: var(--bg1);
        height: 40px;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        gap: 5px;

    }

    .bpmInput input {
        width: 30px;
        background: var(--bg1);
        border: none;
        font-size: 16px;
        outline: none;
    }

    #multiUpload {
        height: 100px;
        padding: 10px;
        box-sizing: border-box;
        align-items: center;
        display: flex;
        justify-content: center;
        gap: 10px;
        cursor: pointer;
        transition: background-color .25s;
    }

    #multiUpload:hover {
        background-color: var(--bg1);
    }

    #saveProgress {
        width: 125px;
        height: 40px;
        background-color: var(--bg1);
        margin-left: auto;
        position: relative;
        padding: 10px;
        box-sizing: border-box;
    }

    #saveProgressBarIncomplete {
        width: 100%;
        display: flex;
        align-items: center;
        background-color: var(--bg0);
        height: 100%;
    }

    #saveProgressBar {
        left: 10px;
        top: 10px;
        height: 20px;
        background-color: var(--main5);
        position: absolute;
        transition: width .1s ease;
    }

    .uploadHandler {
        width: 40px;
        height: 40px;
        box-sizing: border-box;
        background-color: var(--bg1);
        align-items: center;
        justify-content: center;
        display: flex;
        cursor: pointer;
        transition: background-color .25s;
        border: none;
    }

    .uploadHandler:hover {
        background-color: var(--bg2);
    }

    .songDataText {
        display: flex;
        flex-direction: row;
        gap: 10px;
        box-sizing: border-box;
        align-items: center;
    }

    .songName {
        color: var(--text1);
        font-size: 16px;
        height: 40px;
        box-sizing: border-box;
        outline: none;
        cursor: text;
        background-color: var(--bg1);
        border: none;
        padding: 10px;
    }

    .songData {
        height: 100%;
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        padding: 0px 10px 0px 10px;
        transition: background-color .25s;
        gap: 10px;
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
        color: var(--text7);
        font-size: 16px;
        transition: color .25s;
    }

    #nameProject {
        background-color: var(--bg1);
        padding: 10px;
        box-sizing: border-box;
        font-size: 28px;
        border: none;
        outline: none !important;
        font-weight: bold;
    }

    .projectLabelText {
        width: 100%;
        display: flex;
        padding: 0px 10px 10px 20px;
        box-sizing: border-box;
        flex-direction: column;
        justify-content: center;
        
    }

    .projectLabelText .text2 {
        font-size: 14px;
        color: var(--text4);
    }

    .projectThumbnail {
        min-width: 200px;
        min-height: 200px;
        max-width: 200px;
        max-height: 200px;
        overflow: hidden;
        border-radius: var(--border-radius);
        position: relative;
        cursor: pointer;
    }

    .uploadPopup {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 1;
        background-color: #00000080;
        backdrop-filter: blur(5px);
        opacity: 0.0;
        transition: opacity .25s;
        pointer-events: none;
    }

    .projectThumbnail:hover .uploadPopup {
        opacity: 1.0;
    }

    .projectThumbnail img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
    }

    .projectRow, .projectColumn {
        width: 100%;
        display: flex;
        gap: 10px;
        box-sizing: border-box;
    }

    .projectRow {
        flex-direction: row;
    }

    .projectColumn {
        flex-direction: column;
    }

    .projectCreator {
        width: 750px;
        height: 750px;


        display: flex;
        flex-direction: column;
        background-color: var(--bg0);
        border: 1px solid var(--bg1);
        box-sizing: border-box;
        padding: 20px;
        gap: 10px;
    }

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

    .noBorder {
        border: 1px solid transparent;
    }

    .error {
        border: 1px solid var(--fail5) !important;
    }

    .saveProgressComplete {
        border: 1px solid var(--main5) !important;
    }

    @media (max-width: 750px){
        .projectCreator {
            width: 100vw;
        }
    }

    @media (max-height: 910px){
        .projectCreator {
            height: calc(100vh - 160px);
        }
    }

    @media (max-width: 500px){
        .projectTypeSelector {
            flex-direction: column;
            max-width: 200px;
            max-height: 390px;
        }
    }
</style>