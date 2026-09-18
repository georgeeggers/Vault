import { addNotification } from "./appUtils.svelte"
import type { Project } from "./collectionUtils.svelte"
import type { SongContainer } from "./songUtils.svelte"

export const TEST_DATA = ["/bart.png", "/deadPlants.png", "/default.png", "/randomStuff.png", "/ratherbdead.png"]
export const SELECTED_SONG = "/randomStuff.png"
export const TEST_SONG_DATA = "/test.mp3"


export const testContainer1: SongContainer = {
    songData: {
        content: '/test.mp3',
        containerId: 'testContainerID1',
        id: "testContainer1Variation1",
    },
    projectID: "testProject1ID",
    id: 'testContainerID1',
    duration: 123,
    name: "Evil Beat"
}

export const testContainer2: SongContainer = {
    songData: {
        content: '/test2.mp3',
        containerId: 'testContainerID2',
        id: "testContainer2Variation1",
    },
    projectID: "testProject1ID",
    id: 'testContainerID2',
    duration: 151,
    name: "Rather b dead"
}

export const testContainer3: SongContainer = {
    songData: {
        content: "/cloudgazing.mp3",
        containerId: 'testContainerID3',
        id: "testcontainer3Variation1",
    },
    projectID: "testProject2ID",
    id: "testContainerID3",
    duration: 147,
    name: "cloudgazing"
}

export const testContainer4: SongContainer = {
    songData: {
        content: "/scary.mp3",
        containerId: 'testContainerID4',
        id: "testcontainer4Variation1",
    },
    projectID: "testProject1ID",
    id: "testContainerID4",
    duration: 118,
    name: "scary"
}

export const testProject: Project = {
    name: "noise pollution",
    projectType: "multiple",
    content: [testContainer1, testContainer2, testContainer4],
    thumbnail: "/randomStuff.png",
    totalLength: 123 + 151 + 118,
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

const DEBUG_LEVEL: number = 0;

export const debug = (...messages: any) => {
    if(DEBUG_LEVEL >= 1){
        console.log(messages);
    }

    if(DEBUG_LEVEL >= 2){
        addNotification(messages[0], "fail");
    }
}