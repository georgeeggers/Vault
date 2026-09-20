import { appState } from "./appState.svelte"
import { addNotification } from "./appUtils.svelte"

export const getProjectByID = (projectID: string) => {
    for(let i of appState.projects){
        if(i.id == projectID){
            return i;
        }
    }
    addNotification("Could not find project", "fail");
    return null;
}