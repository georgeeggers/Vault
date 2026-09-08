import type { SongContainer } from "./songUtils.svelte"

export type Collection = {
    name: string,
    collectionType: "single",
    content: SongContainer,
    totalLength: number,
    thumbnail?: string,
    id: string,
} | {
    name: string,
    collectionType: "multiple",
    content: SongContainer[],
    totalLength: number,
    thumbnail?: string
    id: string,
}