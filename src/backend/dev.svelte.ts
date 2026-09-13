import type { Project } from "./collectionUtils.svelte"
import type { SongContainer } from "./songUtils.svelte"

export const TEST_DATA = ["/bart.png", "/deadPlants.png", "/mood.png", "/randomStuff.png", "/ratherbdead.png"]
export const SELECTED_SONG = "/ratherbdead.png"
export const TEST_SONG_DATA = "/test.mp3"


export const testContainer1: SongContainer = {
    variations: [{
        content: '/test.mp3',
        containerId: 'testContainerID1',
        id: "testContainer1Variation1",
        name: "Evil Beat"
    }],
    selectedVariation: 0,
    collectionId: "none",
    id: 'testContainerID1',
}

export const testContainer2: SongContainer = {
    variations: [{
        content: '/test2.mp3',
        containerId: 'testContainerID2',
        id: "testContainer2Variation1",
        name: "Rather b dead"
    }],
    selectedVariation: 0,
    collectionId: "none",
    id: 'testContainerID2',
}

export const testProject: Project = {
    name: "Rather b dead",
    projectType: "multiple",
    content: [testContainer1, testContainer2],
    thumbnail: "/ratherbdead.png",
    totalLength: 123 + 151,
    id: "testProject1ID"
}