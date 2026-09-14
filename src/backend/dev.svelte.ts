import { addNotification } from "./appUtils.svelte"
import type { Project } from "./collectionUtils.svelte"
import type { SongContainer } from "./songUtils.svelte"

export const TEST_DATA = ["/bart.png", "/deadPlants.png", "/default.png", "/randomStuff.png", "/ratherbdead.png"]
export const SELECTED_SONG = "/ratherbdead.png"
export const TEST_SONG_DATA = "/test.mp3"


export const testContainer1: SongContainer = {
    variations: [{
        content: '/test.mp3',
        containerId: 'testContainerID1',
        id: "testContainer1Variation1",
    }],
    selectedVariation: 0,
    projectID: "testProject1ID",
    id: 'testContainerID1',
    duration: 123,
    name: "Evil Beat"
}

export const testContainer2: SongContainer = {
    variations: [{
        content: '/test2.mp3',
        containerId: 'testContainerID2',
        id: "testContainer2Variation1",
    }],
    selectedVariation: 0,
    projectID: "testProject1ID",
    id: 'testContainerID2',
    duration: 151,
    name: "Rather b dead"
}

export const testContainer3: SongContainer = {
    variations: [{
        content: "/cloudgazing.mp3",
        containerId: 'testContainerID3',
        id: "testcontainer3Variation1",
    }],
    selectedVariation: 0,
    projectID: "testProject2ID",
    id: "testContainerID3",
    duration: 147,
    name: "cloudgazing"
}

export const testContainer4: SongContainer = {
    variations: [{
        content: "/scary.mp3",
        containerId: 'testContainerID4',
        id: "testcontainer4Variation1",
    }],
    selectedVariation: 0,
    projectID: "testProject1ID",
    id: "testContainerID4",
    duration: 118,
    name: "scary"
}

export const testProject: Project = {
    name: "Rather b dead",
    projectType: "multiple",
    content: [testContainer1, testContainer2, testContainer3, testContainer4],
    thumbnail: "/ratherbdead.png",
    totalLength: 123 + 151 + 147 + 118,
    id: "testProject1ID"
}

export const testProject2: Project = {
    name: "cloudgazing",
    projectType: "single",
    content: testContainer3,
    thumbnail: "/cloudgazing.png",
    totalLength: 147,
    id: 'testProject2ID'
}

const DEBUG_LEVEL: number = 1;

export const debug = (...messages: any) => {
    if(DEBUG_LEVEL >= 1){
        console.log(messages);
    }

    if(DEBUG_LEVEL >= 2){
        addNotification(messages[0], "fail");
    }
}