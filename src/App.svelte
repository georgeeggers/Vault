<script lang='ts'>
    import Router from "svelte-spa-router";
    import Topbar from "./lib/topbar.svelte";

    import { routes } from "./routes.svelte";
    import { appState } from "./backend/appState.svelte";
    import Playbar from "./lib/playbar.svelte";
    import { levenshtein, notifications } from "./backend/appUtils.svelte";
    import { fly } from "svelte/transition";
    import { X } from "@lucide/svelte";
    import { onDestroy, onMount } from "svelte";
    import { loadManager, stopSong, unloadAllSongs, unloadLeakedHowls } from "./backend/howlManagers.svelte";
    import { getTotalNumberOfSongData, loadProjects } from "./backend/sql.svelte";
    import { getTheme, initSettings } from "./backend/settings.svelte";


    let initializing = $state(true);
    let initBlocker = $state(true);
    onMount(async () => {
      console.log("We just loading here. Switch out for another place when we eventually get onboarding working");
      console.log(await getTotalNumberOfSongData());
      await initSettings();
      await loadProjects();
      initializing = false;
      setTimeout(() => {
        initBlocker = false;
      }, 1000);

    })

    onDestroy(() => {
        if(loadManager.currentSong){
          stopSong(loadManager.currentSong.song)
        }
        loadManager.currentSong = null;
        unloadAllSongs();
        unloadLeakedHowls();
    })

</script>

{#if initBlocker}

  <div class="initializing {initializing ? "" : "close"}">
    <div class="minimalTopbar">
      <Topbar minimal={true} />
    </div>
  </div>
{/if}

<div class="globalArea" style='{getTheme()}'>
  {#if !appState.miniPlayer}
    <div class="topbarContainer">
      <Topbar />
    </div>
  {/if}

  <div class="contentArea" style="{loadManager.currentSong ? "height: calc(100% - 160px);" : ""} {appState.miniPlayer ? "height: 100%;" : ""}">
  
    <div class="mainContentContainer">
      <Router {routes} />
    </div>

  </div>

  {#if loadManager.currentSong && !appState.miniPlayer}
    <div class="playbarContainer">
      <Playbar />
    </div>
  {/if}

</div>

<div class="notifications scrollOverflow">
    {#each notifications as n, i (n.id)}
        <label class="notification"
            style='background-color: {n.backgroundColor}; border: 1px solid {n.textColor};'
            for='closeNotif{n.id}'
            transition:fly={{duration: 500, x: 50 }}
        >
            <p style='color: {n.textColor};'>{n.content}</p>
            <button id="closeNotif{n.id}" onclick={() => {notifications.splice(i, 1)}}>
                <div class="svgWrapper" style='color: {n.textColor}'>
                    <X size=16 />
                </div>
            </button>
        </label>
    {/each}
</div>

<style>

  .minimalTopbar {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
  }

  .initializing {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0px;
    top: 0px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--bg0);
    z-index: 100;

    clip-path: circle(100% at 50% 50%);
    transition: clip-path 1s;
  }

  .close {
    clip-path: circle(0% at 50% 50%);
  }

  .playbarContainer {
    width: 100%;
    height: 100px;
    min-height: 100px;
    z-index: 2;
  }

  .mainContentContainer {
    width: 100%;
    z-index: 1;
  }

  .globalArea {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }


  
  .contentArea {
    height: calc(100% - 60px);
    width: 100%;
    display: flex;
    box-sizing: border-box;
  }

  .notifications {
    position: fixed;
    bottom: 0px;
    right: 0px;
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
    max-height: 100%;
    padding: 10px;
    z-index: 100;
  }

  .notification {
    font-size: 12px;
    width: fit-content;
    display: flex;
    flex-direction: row;
    min-width: 150px;
    gap: 50px;
    box-sizing: border-box;
    padding: 10px;
    border-radius: var(--border-radius);
    align-items: center;
    cursor: pointer;
    margin-left: auto;
  }

  .notification button {
    background: none;
    border: none;
    cursor: pointer;
  }

  .notification button * {
    border: none;
  }

</style>