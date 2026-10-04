import type { PlayerSongContainer, PlayerSongData } from "../../../../backend/sql.svelte";

export type UploadDataContainer = {
    song: PlayerSongContainer,
    songData: PlayerSongData | "editing",
    errors: {
        name: boolean,
        content: boolean,
    },
    fullyReady: boolean,
    uploadInitiated: boolean
}


export type Errors = {
    valid: boolean,
    projectName: boolean,
    projectLength: boolean
};

export type UploadProject = {
    songData: UploadDataContainer[],
    thumbnail: string,
    projectId: string,
    projectType: "single" | "multiple",
    projectName: string,
    saving: boolean,
    errors: {
        valid: boolean,
        projectName: boolean,
        projectLength: boolean,
    }
}
