import { openPopup, unlockPopup } from "../../../backend/appState.svelte"
import type { PlayerProject } from "../../../backend/sql.svelte"
import EditProject from "./editProject.svelte"

export type EditData = {
    editProject: PlayerProject | null
}

export let editData: EditData = {
    editProject: null,
}

export const beginEdit = (p: PlayerProject) => {
    editData.editProject = $state.snapshot(p);
    openPopup("editPrexisting");
}
