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

export type DatabaseSongContainer = {
    variations: string[],
    selectedVariation: number,
    id: string,
}

export type SongContainer = {
    variations: SongData[],
    selectedVariation: number,
    projectID: string,
    id: string,
    name: string,
    duration: number,
}

export const getSelectedVariation = (song: SongContainer) => {
    return song.variations[song.selectedVariation];
}

export const getSongPath = (song: SongContainer) => {
    const variation: SongData = song.variations[song.selectedVariation];
    return variation.content;
}