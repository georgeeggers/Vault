<script lang='ts'>
    import { getID } from "../../../backend/appUtils.svelte";
    import type { UploadProject } from "./modules/uploading.svelte";
    import SongEditor from "./modules/songEditor.svelte";
    import { onMount } from "svelte";
    import { editData } from "./editSongs.svelte";

    let loaded = $state(false);

    let project: UploadProject = $state({
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

    onMount(async () => {
        if(editData.editProject){

            for(let i of editData.editProject.songs){
                project.songData.push({
                    song: {
                        id: i.id,
                        name: i.name,
                        duration: i.duration,
                        extension: i.extension,
                        ordering: i.ordering,
                        bpm: i.bpm,
                        parentProject: i.parentProject
                    },
                    songData: "editing",
                    errors: {
                        name: false,
                        content: false,
                    },
                    uploadInitiated: false,
                    fullyReady: true,
                })
            }


            if(editData.editProject.thumbnail){
                project.thumbnail = editData.editProject.thumbnail;
            }

            project.projectName = editData.editProject.name;
            project.projectId = editData.editProject.id;
            project.projectType = editData.editProject.projectType;
            loaded = true;
        }
    })



</script>

<div class="newProjectPopup">
    {#if loaded}
        <SongEditor bind:projectData={project} />
    {:else}
        <p>Loading...</p>
    {/if}
</div>



<style>

    .newProjectPopup {
        display: flex;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>