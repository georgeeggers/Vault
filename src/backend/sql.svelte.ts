import Database from "@tauri-apps/plugin-sql";
import { appState } from "./appState.svelte";
import { debug } from "./dev.svelte";

export type DBProject = {
    id: string,
    projectType: "single" | "multiple",
    totalLength: number,
    thumbnail: string,
    name: string,
}

export type DBSongContainer = {
    id: string,
    name: string,
    duration: number,
    extension: string,
    ordering: number,
    bpm: number,
    parentProject: string,
}

export type DBSongData = {
    id: string,
    content: string,
    lyrics: string,
    parentContainer: string,
}

export type PlayerSongData = {
    id: string,
    content: string,
    lyrics?: string,
    parentContainer: string,
}

export type PlayerSongContainer = {
    id: string,
    name: string,
    duration: number,
    extension: string,
    ordering: number,
    bpm: number,
    parentProject: string
}

export type PlayerProject = {
    id: string,
    projectType: "single" | "multiple",
    totalLength: number,
    thumbnail?: string,
    name: string,
    songs: PlayerSongContainer[]
}

let db: Database | null = $state(null)

const loadDb = async () => {
    if(!db){
        db = await Database.load("sqlite:data.db");
    }
}

const b64ToFileURL = (input: string) => {
    // @ts-ignore
    let parts = input.split(' ');
    const bytes = atob(parts[parts.length - 1]);
    const byteArray1 = [];
    for (let i = 0; i < bytes.length; i++) {
        const byte = bytes.charCodeAt(i);
        byteArray1.push(byte);
    }
    const byteArray = new Uint8Array(byteArray1);
    return URL.createObjectURL(new Blob([byteArray]));
}

const fileToB64 = (file: File | Blob) => new Promise<string>((resolve, reject) => {
    if(file == null){
        resolve("");
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // @ts-ignore
    reader.onload = () => resolve(`${reader.result.split(',')[1]}`);
    reader.onerror = reject;
});

export const dataUrlToB64 = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const b = await fileToB64(blob);
    return b;
}

export const deleteAllLocal = async () => {
    await loadDb();
    if(db){
        let result = await db.execute(
`DELETE FROM projects;
DELETE FROM songContainer;
DELETE FROM songData; `
        )
    }
}

export const saveOrUpdateProject = async (p: DBProject) => {
    await loadDb();
    if(db){
        const result = await db.execute(
`INSERT INTO projects (id, projectType, totalLength, thumbnail, name)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT(id) DO UPDATE SET
    projectType = excluded.projectType,
    totalLength = excluded.totalLength,
    thumbnail = excluded.thumbnail,
    name = excluded.name;
`,
            [p.id, p.projectType, p.totalLength, p.thumbnail, p.name]
        )
        debug(result);
    }
}

export const saveOrUpdateSong = async (s: DBSongContainer) => {
    await loadDb();
    if(db){
        const result = await db.execute(
`INSERT INTO songContainer (id, name, duration, extension, ordering, bpm, parentProject)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT(id) DO UPDATE SET
    duration = excluded.duration,
    ordering = excluded.ordering,
    extension = excluded.extension,
    bpm = excluded.bpm,
    name = excluded.name;
`,
            [s.id, s.name, s.duration, s.extension, s.ordering, s.bpm, s.parentProject]
        )
        debug(result);
    }
}

export const saveOrUpdateSongData = async (s: DBSongData) => {
    await loadDb();
    if(db){
        const result = await db.execute(
`INSERT INTO songData (id, content, lyrics, parentContainer)
VALUES ($1, $2, $3, $4)
ON CONFLICT(id) DO UPDATE SET
    content = excluded.content,
    lyrics = excluded.lyrics;
`,
            [s.id, s.content, s.lyrics, s.parentContainer]
        )
        debug(result);
    }
}

export const getPlayerSongDataFromDBSongData = (s: DBSongData) => {
    const content = b64ToFileURL(s.content);

    let output: PlayerSongData = {
        id: s.id,
        content: content,
        parentContainer: s.parentContainer
    }    

    if(s.lyrics != ""){
        output['lyrics'] = JSON.parse(s.lyrics);
    }

    return output;
}

export const getPlayerSongFromDBSong = (s: DBSongContainer) => {

    let output: PlayerSongContainer = {
        id: s.id,
        name: s.name,
        duration: s.duration,
        extension: s.extension,
        ordering: s.ordering,
        parentProject: s.parentProject,
        bpm: s.bpm
    }

    return output;
}

export const getPlayerProjectFromDBProject = (d: DBProject, songContainers: DBSongContainer[]) => {
    let output: PlayerProject = {
        id: d.id,
        projectType: d.projectType,
        totalLength: 0,
        name: d.name,
        songs: [],
    }
    if(d.thumbnail != ""){
        output['thumbnail'] = b64ToFileURL(d.thumbnail);
    }

    for(let i of songContainers){
        const b = getPlayerSongFromDBSong(i);
        output.totalLength += b.duration;
        output.songs.push(b);
    }

    output.songs.sort((a: PlayerSongContainer, b: PlayerSongContainer) => {
        if(a.ordering > b.ordering){
            return 1;
        }
        return -1;
    })

    return output;
}

export const loadSongData = async (container: PlayerSongContainer) => {
    loadDb();
    if(db){
        const result = await db.select<DBSongData[]>("SELECT * from songData WHERE parentContainer = $1", [container.id]);
        if(!result){
            debug("[ERROR] Song data not found :(");
            return null;
        }

        if(result.length > 1){
            debug("[ERROR] Conflicting song data found :(. Continuing with first element");
        }

        const songData = getPlayerSongDataFromDBSongData(result[0]);
        return songData;
    }


    return null;
}

export const getDBDataFromSongData = async (p: PlayerSongData) => {
    const data = await dataUrlToB64(p.content);
    let lyrics = "";
    if(p.lyrics){
        lyrics = JSON.stringify(p.lyrics);
    }
    const songData: DBSongData = {
        id: p.id,
        content: data,
        lyrics: lyrics,
        parentContainer: p.parentContainer
    }

    return songData;
}

export const getDBDataFromSong = async (p: PlayerSongContainer) => {
    let song: DBSongContainer = {
        id: p.id,
        name: p.name,
        duration: p.duration,
        extension: p.extension,
        ordering: p.ordering,
        bpm: p.bpm,
        parentProject: p.parentProject
    }

    return song;
}

export const getDBDataFromProject = async (p: PlayerProject, songData: PlayerSongData[]) => {
    const thumbnail = p.thumbnail ? await dataUrlToB64(p.thumbnail) : "";
    let project: DBProject = {
        id: p.id,
        projectType: p.projectType,
        totalLength: p.totalLength,
        thumbnail: thumbnail,
        name: p.name
    }


    const songs: DBSongContainer[] = [];
    for(let song of p.songs){
        const bleh = await getDBDataFromSong(song);
        songs.push(bleh);
    }

    const data: DBSongData[] = [];
    for(let i of songData){
        const bleh = await getDBDataFromSongData(i);
        data.push(bleh);
    }

    return { project: project, songs: songs, data: data};
}

export const loadProjects = async () => {
    await loadDb();
    if(db){
        appState.projects.length = 0;
        appState.projects.push({
            id: "yourVault",
            projectType: 'multiple',
            totalLength: 0,
            name: "Your Vault",
            songs: [],
            thumbnail: '/default.png'
        })
        const result: DBProject[] = await db.select(`SELECT * FROM projects`);
        for(let i of result){
            const subResult: DBSongContainer[] = await db.select(`SELECT * FROM songContainer WHERE parentProject = $1`, [i.id]);
            appState.projects.push(getPlayerProjectFromDBProject(i, subResult));
            for(let i of subResult){
                appState.projects[0].totalLength += i.duration;
                appState.projects[0].songs.push(i);
            }
        }
    }
}

