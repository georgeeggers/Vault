
/**
 * Returns the input number if greater than 0, and 0 otherwise
 * @param inputNumber The input number to be relu'd
 * @returns number equal to or greater than 0
 */
export const relu = (inputNumber: number): number => {
    if(inputNumber < 0){
        return 0;
    } else if (inputNumber > 100) {
        return 100;
    } else {
        return inputNumber
    }
}

/**
 * Returns a random integer between 0 (inc) and max (exc)
 * @param max The upper bound of the range of numbers
 * @returns A random integer in the range [0, max)
 */
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}
 
const encoder = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=_+/?.>,<!@#$%^&*()~`";

/**
 * Returns a random integer between min (inc) and max (exc)
 * @param min The lower bound of the range of numbers
 * @param max The upper bound of the range of numbers
 * @returns A random integer in the range [min, max)
 */
export const random = (min: number, max: number): number => {
    return (Math.floor(Math.random() * (max - min + 1)) + min)
}

/**
 * Gets a random 15 digit long id string compatible with pocketbase
 * @returns string
 */
export const getID = (): string => {
    let id = "";
    for(let i = 0; i < 15; i++){
        id += encoder[random(0, encoder.length - 1)];
    }

    return id;
}

export type Notification = {
    content: string,
    textColor: string,
    backgroundColor: string,
    id: string,
}

export let notifications: Notification[] = $state([])

export const addNotification = (body: string, notifType: string, time = 10000) => {
    let textColor = "";
    let backgroundColor = "";
    if(notifType == "fail"){
        textColor = "var(--fail4)";
        backgroundColor = "var(--fail1)";
    } else if (notifType == "warn"){
        textColor = "var(--warn4)";
        backgroundColor = "var(--warn1)";
    } else if (notifType == "success"){
        textColor = "var(--secondary4)";
        backgroundColor = "var(--secondary1)";
    } else {
        textColor = "var(--main4)";
        backgroundColor = "var(--main1)";
    }
    let n: Notification = {
        content: body,
        textColor: textColor,
        backgroundColor: backgroundColor,
        id: getID()
    }

    // do this to bypass unsafe mutation errors in template expressions
    setTimeout(() => {
        notifications.push(n)
    })
    setTimeout(() => {
        notifications.splice(notifications.indexOf(n), 1)
    }, time);
}

export const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    addNotification("CSS Copied!", "success");
}