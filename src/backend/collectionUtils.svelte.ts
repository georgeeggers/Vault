import { appState } from "./appState.svelte"
import { addNotification } from "./appUtils.svelte"
import type { SongContainer } from "./songUtils.svelte"

export type Project = {
    name: string,
    projectType: "single",
    content: SongContainer,
    totalLength: number,
    thumbnail?: string,
    id: string,
} | {
    name: string,
    projectType: "multiple",
    content: SongContainer[],
    totalLength: number,
    thumbnail?: string
    id: string,
}

export const getProjectByID = (projectID: string) => {
    for(let i of appState.projects){
        if(i.id == projectID){
            return i;
        }
    }
    addNotification("Could not find project", "fail");
    return null;
}