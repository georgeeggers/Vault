<script lang='ts'>
    import { Home, Maximize, Minus, Search, Settings2, Upload, X } from "@lucide/svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { replace} from "svelte-spa-router";
    import { appState, openPopup } from "../backend/appState.svelte";
    import { searchForProjects } from "../backend/appUtils.svelte";
    import { fade, fly } from "svelte/transition";
    import { loadManager } from "../backend/howlManagers.svelte";
    import ContentDisplay from "./modules/contentDisplay.svelte";
    import App from "../App.svelte";
    const window = getCurrentWindow();

    const ICON_SIZE = 24;


    let searchResults = $derived(searchForProjects(appState.projects, appState.searchTerm))
    $effect(() => {
        if(!appState.popupData.popupShowing){
            appState.showSearchResults = appState.searchTerm != "";
        }
    })

</script>

<div class="topbar" data-tauri-drag-region>

    <button class="locationButton"
        onclick={() => replace('/settings')}
    >
        <div class="svgWrapper">
            <Settings2 size={ICON_SIZE} />
        </div>
    </button>

    <button class="locationButton"
        onclick={() => replace('/')}
    >
        <div class="svgWrapper">
            <Home size={ICON_SIZE} />
        </div>
    </button>


    <button class="locationButton" style='margin-left: 40px;' onclick={() => openPopup("createNew")}>
        <div class="svgWrapper">
            <Upload size={ICON_SIZE} />
        </div>
    </button>

    <label class="searchBarContainer" for='searchBar'>
        <div class="svgWrapper">
            <Search size={ICON_SIZE} />
        </div>
        <input bind:value={appState.searchTerm} id='searchBar' autocapitalize='off' autocomplete="off" autocorrect="off" placeholder="Search for anything...">
    </label>

    {#if appState.showSearchResults}

        <label class="searchBlocker"
            style="{loadManager.currentSong && !appState.miniPlayer ? "height: calc(100% - 140px);" : "height: calc(100% - 60px);"}"

        >
            <button class='invis' onclick={() => {
                appState.showSearchResults = false;
            }}>close</button>
        </label>

        <div class="searchResults scrollOverflow"
            style="height: min({(searchResults.projects.length + searchResults.songs.length) * 70 + 12}px, 80vh);"
        >
            {#each searchResults.projects as project}
                <ContentDisplay data={project} displayType="project" />
            {/each}

            {#each searchResults.songs as song, i}
                <ContentDisplay data={song} displayType="song" />
            {/each}
        </div>
    {/if}

    <button class='windowControlButton' onclick={window.minimize} style='margin-left: auto;'>
        <div class="svgWrapper">
            <Minus size={ICON_SIZE - 4} />
        </div>
    </button>

    <button class='windowControlButton' onclick={window.toggleMaximize}>
        <div class="svgWrapper">
            <Maximize size={ICON_SIZE - 4} />
        </div>
    </button>

    <button class='windowControlButton' onclick={window.close}>
        <div class="svgWrapper">
            <X size={ICON_SIZE - 4} />
        </div>
    </button>

</div>
<style>

    .searchBlocker {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: calc(100% - 140px);
        top: 60px;
        display: flex;
        background-color: #00000080;
        backdrop-filter: blur(20px);
        z-index: 0;
    }

    .searchResults {
        position: fixed;
        top: 70px;
        width: min(600px, 100vw);
        background-color: var(--bg0);
        border: 1px solid var(--bg2);
        padding: 10px;
        box-sizing: border-box;
        left: 50%;
        transform: translateX(-50%);
        gap: 10px;
        display: flex;
        flex-direction: column;

    }


    .topbar {
        width: 100%;
        min-height: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        cursor: pointer;
        box-sizing: border-box;
        align-items: center;
        padding: 10px;
        background-color: var(--bg0);
        border-bottom: 1px solid var(--bg2);
    }

    .locationButton {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius);
        background: none;
        border: none;
        cursor: pointer;
    }

    .windowControlButton {
        background: none;
        border: none;
        cursor: pointer;
        min-width: 40px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        transition: background-color .25s;
    }

    .windowControlButton:hover {
        background-color: var(--bg2);
    }

    .windowControlButton:hover * {
        color: var(--text1);
    }

    .searchBarContainer {
        width: 400px;
        height: 100%;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        padding: 0px 15px 0px 15px;
        gap: 10px;
        margin-left: auto;
        margin-right: auto;
        transition: background-color .25s;
    }

    .searchBarContainer input {
        height: 100%;
        width: 100%;
        background: none;
        border: none;
        outline: none;
        font-size: 16px;
        color: var(--text2);
    }

    .svgWrapper {
        color: var(--text5);
        transition: color .25s;
    }

    .searchBarContainer:hover, .searchBarContainer:has(input:focus) {
        background-color: var(--bg2);
    }

    .searchBarContainer:hover .svgWrapper, .searchBarContainer:has(input:focus) .svgWrapper {
        color: var(--text2);
    }

    .searchBarContainer input::placeholder {
        color: var(--text5) !important;
    }



</style>