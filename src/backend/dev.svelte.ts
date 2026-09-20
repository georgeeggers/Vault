import { addNotification } from "./appUtils.svelte"

const DEBUG_LEVEL: number = 0;

export const debug = (...messages: any) => {
    if(DEBUG_LEVEL >= 1){
        console.log(messages);
    }

    if(DEBUG_LEVEL >= 2){
        addNotification(messages[0], "fail");
    }
}