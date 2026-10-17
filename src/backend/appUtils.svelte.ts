import { appState } from "./appState.svelte";
import type { PlayerProject, PlayerSongContainer } from "./sql.svelte";

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
export const getID = (prefix: string = ""): string => {
    let id = prefix;
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
    } else if (notifType == "info"){
        textColor = "var(--text7)";
        backgroundColor = "var(--bg2)";
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

// ripped this straight from stack overflow 
// https://stackoverflow.com/questions/18516942/fastest-general-purpose-levenshtein-javascript-implementation
export const levenshtein = (s: string, t: string) => {
    if (s === t) {
        return 0;
    }
    var n = s.length, m = t.length;
    if (n === 0 || m === 0) {
        return n + m;
    }
    var x = 0, y, a, b, c, d, g, h, k;
    var p = new Array(n);
    for (y = 0; y < n;) {
        p[y] = ++y;
    }

    for (; (x + 3) < m; x += 4) {
        var e1 = t.charCodeAt(x);
        var e2 = t.charCodeAt(x + 1);
        var e3 = t.charCodeAt(x + 2);
        var e4 = t.charCodeAt(x + 3);
        c = x;
        b = x + 1;
        d = x + 2;
        g = x + 3;
        h = x + 4;
        for (y = 0; y < n; y++) {
            k = s.charCodeAt(y);
            a = p[y];
            if (a < c || b < c) {
                c = (a > b ? b + 1 : a + 1);
            }
            else {
                if (e1 !== k) {
                    c++;
                }
            }

            if (c < b || d < b) {
                b = (c > d ? d + 1 : c + 1);
            }
            else {
                if (e2 !== k) {
                    b++;
                }
            }

            if (b < d || g < d) {
                d = (b > g ? g + 1 : b + 1);
            }
            else {
                if (e3 !== k) {
                    d++;
                }
            }

            if (d < g || h < g) {
                g = (d > h ? h + 1 : d + 1);
            }
            else {
                if (e4 !== k) {
                    g++;
                }
            }
            p[y] = h = g;
            g = d;
            d = b;
            b = c;
            c = a;
        }
    }

    for (; x < m;) {
        var e = t.charCodeAt(x);
        c = x;
        d = ++x;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || d < c) {
                d = (a > d ? d + 1 : a + 1);
            }
            else {
                if (e !== s.charCodeAt(y)) {
                    d = c + 1;
                }
                else {
                    d = c;
                }
            }
            p[y] = d;
            c = a;
        }
        h = d;
    }

    return h;
}



type SearchItem = {
    data: PlayerProject,
    dataType: "project"
} | {
    data: PlayerSongContainer,
    dataType: "song"
}

export const applyTypeFilter = (input: SearchItem[], dataType: string) => {
    return input.filter((a) => {
        if(a.dataType == dataType){
            return true;
        } 
        return false;
    })

}

export const getIdByProjectName = (name: string) => {
    for(let i of appState.projects){
        if(i.name.toLowerCase() == name.toLowerCase()){
            return i.id;
        }
    }
    return "";
}

export const applyParentFilter = (input: SearchItem[], parent: string) => {
    const id = getIdByProjectName(parent);
    return input.filter((a) => {
        if(a.dataType == 'song'){
            if(a.data.parentProject == id){
                return true;
            }
        }

        return false;
    })
}

export const applyNameFilter = (input: SearchItem[], nameFilter: string) => {
    return input.filter((a) => {
        return a.data.name.toLowerCase().includes(nameFilter.toLowerCase());
    })
}


export const applyNameSort = (input: SearchItem[], nameFilter: string) => {
    return input.sort((a, b) => {
        const l1 = levenshtein(a.data.name, nameFilter);
        const l2 = levenshtein(b.data.name, nameFilter);
        if(l1 < l2){
            return -1;
        } else if (l2 == l1){
            return 0;
        }
        return 1;
    })
}

export const applyMinBpmFilter = (input: SearchItem[], minBpm: number) => {
    return input.filter((a) => {
        if(a.dataType == 'song'){
            if(a.data.bpm >= minBpm){
                return true;
            }
        }
        return false;
    })
}

export const applyMaxBpmFilter = (input: SearchItem[], maxBpm: number) => {
    return input.filter((a) => {
        if(a.dataType == 'song'){
            if(a.data.bpm <= maxBpm){
                return true;
            }
        }
        return false;
    })
}

export type StringOption = {
    enabled: boolean,
    value: string,
}

export type BooleanOption = {
    enabled: boolean,
    value: boolean,
}

export type NumberOption = {
    enabled: boolean,
    value: number,
}


export type SearchOptions = {
    dataTypeFilter?: StringOption,
    parentFilter?: StringOption,
    maxBpm?: NumberOption,
    minBpm?: NumberOption,
    filterName?: BooleanOption,
}

export const searchForProjects = (projects: PlayerProject[], searchTerm: string, searchOptions: SearchOptions = {}) => {
    let searchData: SearchItem[] = [];

    for(let i of projects){
        if(i.name != "Your Vault"){
            searchData.push({
                dataType: 'project',
                data: i
            })
        }
    }

    for(let i of projects[0].songs){
        searchData.push({
            dataType: 'song',
            data: i
        })
    }

    if(searchOptions.dataTypeFilter?.enabled){
        searchData = applyTypeFilter(searchData, searchOptions.dataTypeFilter.value);
    }

    if(searchOptions.parentFilter?.enabled){
        searchData = applyParentFilter(searchData, searchOptions.parentFilter.value);
    }

    if(searchOptions.maxBpm?.enabled){
        searchData = applyMaxBpmFilter(searchData, searchOptions.maxBpm.value);
    }

    if(searchOptions.minBpm?.enabled){
        searchData = applyMinBpmFilter(searchData, searchOptions.minBpm.value);
    }

    searchData = applyNameSort(searchData, searchTerm);

    if(searchOptions.filterName?.enabled){
        searchData = applyNameFilter(searchData, searchTerm);
    }

    return searchData;
}