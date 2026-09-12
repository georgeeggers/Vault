<script>
    import { Home, Maximize, Minus, Search, Settings2, X } from "@lucide/svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { replace } from "svelte-spa-router";
    import { appState } from "../backend/appState.svelte";
    const window = getCurrentWindow();

    const ICON_SIZE = 24;

</script>

<div class="topbar" data-tauri-drag-region>

    <button class="locationButton">
        <div class="svgWrapper">
            <Settings2 size={ICON_SIZE} />
        </div>
    </button>


    <button class="locationButton" style='margin-left: 40px;' onclick={() => replace('/')}>
        <div class="svgWrapper">
            <Home size={ICON_SIZE} fill="currentColor"/>
        </div>
    </button>

    <label class="searchBarContainer" for='searchBar'>
        <div class="svgWrapper">
            <Search size={ICON_SIZE} />
        </div>
        <input bind:value={appState.searchTerm} id='searchBar' placeholder="Search for anything...">
    </label>

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





    .topbar {
        width: 100%;
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
        width: 45px;
        height: 45px;
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
        min-width: 45px;
        width: 45px;
        height: 45px;
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