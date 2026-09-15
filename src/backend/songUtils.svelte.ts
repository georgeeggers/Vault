export type Lyric = {
    timestamp: number,
    content: string,
}

export type Lyrics = {
    lyricType: "untimed",
    content: string,
} | {
    lyricType: "line",
    content: Lyric[],
} | {
    lyricType: "word",
    content: Lyric[],
}

export type SongDataOptions = {
    lyrics?: Lyrics[],
    bpm?: number,
    tags?: string,
}

export type SongData = {
    content: string,
    containerId: string,
    id: string,
    options?: SongDataOptions
}

export type SongContainer = {
    songData: SongData,
    projectID: string,
    id: string,
    name: string,
    duration: number,
}

export const getSelectedVariation = (song: SongContainer) => {
    return song.songData;
}

export const getSongPath = (song: SongContainer) => {
    return song.songData.content;
}