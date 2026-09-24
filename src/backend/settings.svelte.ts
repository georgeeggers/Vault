import { appState } from "./appState.svelte"

export type Settings = {
    lightMode: boolean,
    mainHue: number,
    coproducer: boolean,
}

export const getTheme = () => {
    if(!appState.settings.lightMode){
        return `
    --main0: hsl(${appState.settings.mainHue}, 40.952%, 17%);
    --main1: hsl(${appState.settings.mainHue}, 39.667%, 25%);
    --main2: hsl(${appState.settings.mainHue}, 38.075%, 33%);
    --main3: hsl(${appState.settings.mainHue}, 36.051%, 41%);
    --main4: hsl(${appState.settings.mainHue}, 33.392%, 49%);
    --main5: hsl(${appState.settings.mainHue}, 29.744%, 57%);
    --main6: hsl(${appState.settings.mainHue}, 24.429%, 65%);
    --bg0: hsl(${appState.settings.mainHue}, 3.362%, 6%);
    --bg1: hsl(${appState.settings.mainHue}, 2.581%, 12.4286%);
    --bg2: hsl(${appState.settings.mainHue}, 1.676%, 18.8571%);
    --bg3: hsl(${appState.settings.mainHue}, 0.616%, 25.2857%);
    --bg4: hsl(${appState.settings.mainHue}, 0%, 31.7143%);
    --bg5: hsl(${appState.settings.mainHue}, 0%, 38.1429%);
    --bg6: hsl(${appState.settings.mainHue}, 0%, 44.5714%);
    --bg7: hsl(${appState.settings.mainHue}, 0%, 51%);
    --text0: hsl(${appState.settings.mainHue}, 0%, 94%);
    --text1: hsl(${appState.settings.mainHue}, 0%, 87.5714%);
    --text2: hsl(${appState.settings.mainHue}, 0%, 81.1429%);
    --text3: hsl(${appState.settings.mainHue}, 0%, 74.7143%);
    --text4: hsl(${appState.settings.mainHue}, 0%, 68.2857%);
    --text5: hsl(${appState.settings.mainHue}, 0%, 61.8571%);
    --text6: hsl(${appState.settings.mainHue}, 0%, 55.4286%);
    --text7: hsl(${appState.settings.mainHue}, 0%, 49%);
    
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
    --main0: hsl(${appState.settings.mainHue}, 40.952%, 17%);
    --main1: hsl(${appState.settings.mainHue}, 39.667%, 25%);
    --main2: hsl(${appState.settings.mainHue}, 38.075%, 33%);
    --main3: hsl(${appState.settings.mainHue}, 36.051%, 41%);
    --main4: hsl(${appState.settings.mainHue}, 33.392%, 49%);
    --main5: hsl(${appState.settings.mainHue}, 29.744%, 57%);
    --main6: hsl(${appState.settings.mainHue}, 24.429%, 65%);
    --bg0: hsl(${appState.settings.mainHue}, 3.362%, 93%);
    --bg1: hsl(${appState.settings.mainHue}, 2.581%, 86.4286%);
    --bg2: hsl(${appState.settings.mainHue}, 0%, 79.8571%);
    --bg3: hsl(${appState.settings.mainHue}, 0%, 73.2857%);
    --bg4: hsl(${appState.settings.mainHue}, 0%, 66.7143%);
    --bg5: hsl(${appState.settings.mainHue}, 0%, 60.1429%);
    --bg6: hsl(${appState.settings.mainHue}, 0%, 53.5714%);
    --bg7: hsl(${appState.settings.mainHue}, 0%, 47%);
    --text0: hsl(${appState.settings.mainHue}, 3.247%, 7%);
    --text1: hsl(${appState.settings.mainHue}, 2.673%, 11.7143%);
    --text2: hsl(${appState.settings.mainHue}, 2.034%, 16.4286%);
    --text3: hsl(${appState.settings.mainHue}, 1.319%, 21.1429%);
    --text4: hsl(${appState.settings.mainHue}, 0.513%, 25.8571%);
    --text5: hsl(${appState.settings.mainHue}, 0%, 30.5714%);
    --text6: hsl(${appState.settings.mainHue}, 0%, 35.2857%);
    --text7: hsl(${appState.settings.mainHue}, 0%, 40%);

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