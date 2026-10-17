import { appState } from "./appState.svelte";
import { load, Store } from '@tauri-apps/plugin-store';
export type Settings = {
  [key: string]: any;
  lightMode: boolean,
  mainHue: number,
  coproducer: boolean,
  queueDisplaySize: number,
  positional: boolean,
  positionX: number,
  positionY: number,
  positionMagnitude: number,
  maxPreloadSize: number,
  maxTimeToWaitForLoad: number,
  retryInterval: number,
  store: Store|null
}

export let settingsMirror: Settings = $state({
    lightMode: false,
    mainHue: 200,
    coproducer: false,
    queueDisplaySize: 10,
    positional: false,
    positionX: 0,
    positionY: 0,
    positionMagnitude: 1,
    maxPreloadSize: 3,
    maxTimeToWaitForLoad: 10000,
    retryInterval: 100,
    store: null
})

export const initSettings = async () => {
  const store = await load('store.json', {autoSave: true});
  settingsMirror.lightMode = (await store.get<{value: boolean}>('lightMode'))?.value ?? false;
  settingsMirror.mainHue = (await store.get<{value: number}>('mainHue'))?.value ?? 200;
  settingsMirror.coproducer = (await store.get<{value: boolean}>('lightMode'))?.value ?? false;
  settingsMirror.queueDisplaySize = (await store.get<{value: number}>('queueDisplaySize'))?.value ?? 10;
  settingsMirror.lightMode = (await store.get<{value: boolean}>('lightMode'))?.value ?? false;
  settingsMirror.positional = (await store.get<{value: boolean}>('positional'))?.value ?? false;
  settingsMirror.positionX = (await store.get<{value: number}>('positionX'))?.value ?? 0;
  settingsMirror.positionY = (await store.get<{value: number}>('positionY'))?.value ?? 0;
  settingsMirror.positionMagnitude = (await store.get<{value: number}>('positionMagnitude'))?.value ?? 1;

  settingsMirror.maxPreloadSize = (await store.get<{value: number}>('maxPreloadSize'))?.value ?? 3;
  settingsMirror.maxTimeToWaitForLoad = (await store.get<{value: number}>('maxTimeToWaitForLoad'))?.value ?? 10000;
  settingsMirror.retryInterval = (await store.get<{value: number}>('retryInterval'))?.value ?? 100;

  settingsMirror.store = store;
}

export let saveMirrorValueToStore = async (key: string) => {
  if(settingsMirror.store){
    await settingsMirror.store.set(key, { value: settingsMirror[key] });
  }
}

export const getTheme = () => {
    if(!settingsMirror.lightMode){
        return `
    --main0: hsl(${settingsMirror.mainHue}, 40.952%, 17%);
    --main1: hsl(${settingsMirror.mainHue}, 39.667%, 25%);
    --main2: hsl(${settingsMirror.mainHue}, 38.075%, 33%);
    --main3: hsl(${settingsMirror.mainHue}, 36.051%, 41%);
    --main4: hsl(${settingsMirror.mainHue}, 33.392%, 49%);
    --main5: hsl(${settingsMirror.mainHue}, 29.744%, 57%);
    --main6: hsl(${settingsMirror.mainHue}, 24.429%, 65%);
    --bg0: hsl(${settingsMirror.mainHue}, 3.362%, 6%);
    --bg1: hsl(${settingsMirror.mainHue}, 2.581%, 12.4286%);
    --bg2: hsl(${settingsMirror.mainHue}, 1.676%, 18.8571%);
    --bg3: hsl(${settingsMirror.mainHue}, 0.616%, 25.2857%);
    --bg4: hsl(${settingsMirror.mainHue}, 0%, 31.7143%);
    --bg5: hsl(${settingsMirror.mainHue}, 0%, 38.1429%);
    --bg6: hsl(${settingsMirror.mainHue}, 0%, 44.5714%);
    --bg7: hsl(${settingsMirror.mainHue}, 0%, 51%);
    --text0: hsl(${settingsMirror.mainHue}, 0%, 94%);
    --text1: hsl(${settingsMirror.mainHue}, 0%, 87.5714%);
    --text2: hsl(${settingsMirror.mainHue}, 0%, 81.1429%);
    --text3: hsl(${settingsMirror.mainHue}, 0%, 74.7143%);
    --text4: hsl(${settingsMirror.mainHue}, 0%, 68.2857%);
    --text5: hsl(${settingsMirror.mainHue}, 0%, 61.8571%);
    --text6: hsl(${settingsMirror.mainHue}, 0%, 55.4286%);
    --text7: hsl(${settingsMirror.mainHue}, 0%, 49%);
    
    background:
      linear-gradient(
          90deg,
          var(--bg0) calc(var(--dot-space) - var(--dot-size)),
          transparent 1%
        )
        center / var(--dot-space) var(--dot-space),
      linear-gradient(
          var(--bg0) calc(var(--dot-space) - var(--dot-size)),
          transparent 1%
        )
        center / var(--dot-space) var(--dot-space),
      var(--main6);
    
    `
    } else {
        return `
    --main0: hsl(${settingsMirror.mainHue}, 40.952%, 17%);
    --main1: hsl(${settingsMirror.mainHue}, 39.667%, 25%);
    --main2: hsl(${settingsMirror.mainHue}, 38.075%, 33%);
    --main3: hsl(${settingsMirror.mainHue}, 36.051%, 41%);
    --main4: hsl(${settingsMirror.mainHue}, 33.392%, 49%);
    --main5: hsl(${settingsMirror.mainHue}, 29.744%, 57%);
    --main6: hsl(${settingsMirror.mainHue}, 24.429%, 65%);
    --bg0: hsl(${settingsMirror.mainHue}, 3.362%, 93%);
    --bg1: hsl(${settingsMirror.mainHue}, 2.581%, 86.4286%);
    --bg2: hsl(${settingsMirror.mainHue}, 0%, 79.8571%);
    --bg3: hsl(${settingsMirror.mainHue}, 0%, 73.2857%);
    --bg4: hsl(${settingsMirror.mainHue}, 0%, 66.7143%);
    --bg5: hsl(${settingsMirror.mainHue}, 0%, 60.1429%);
    --bg6: hsl(${settingsMirror.mainHue}, 0%, 53.5714%);
    --bg7: hsl(${settingsMirror.mainHue}, 0%, 47%);
    --text0: hsl(${settingsMirror.mainHue}, 3.247%, 7%);
    --text1: hsl(${settingsMirror.mainHue}, 2.673%, 11.7143%);
    --text2: hsl(${settingsMirror.mainHue}, 2.034%, 16.4286%);
    --text3: hsl(${settingsMirror.mainHue}, 1.319%, 21.1429%);
    --text4: hsl(${settingsMirror.mainHue}, 0.513%, 25.8571%);
    --text5: hsl(${settingsMirror.mainHue}, 0%, 30.5714%);
    --text6: hsl(${settingsMirror.mainHue}, 0%, 35.2857%);
    --text7: hsl(${settingsMirror.mainHue}, 0%, 40%);

    --dot-space: 15px;
    --dot-size: 1.5px;

    background:
      linear-gradient(
          90deg,
          var(--bg0) calc(var(--dot-space) - var(--dot-size)),
          transparent 1%
        )
        center / var(--dot-space) var(--dot-space),
      linear-gradient(
          var(--bg0) calc(var(--dot-space) - var(--dot-size)),
          transparent 1%
        )
        center / var(--dot-space) var(--dot-space),
      var(--main6);
    
    `
    }
}