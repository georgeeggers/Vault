<script>
    import Router from "svelte-spa-router";
    import Topbar from "./lib/topbar.svelte";

    import { routes } from "./routes.svelte";
    import { appState } from "./backend/appState.svelte";
    import Playbar from "./lib/playbar.svelte";
    import { notifications } from "./backend/appUtils.svelte";
    import { fly } from "svelte/transition";
    import { X } from "@lucide/svelte";
    import { stopSong } from "./backend/playerUtils.svelte";
    import { onDestroy } from "svelte";


    onDestroy(() => {
        if(appState.player.currentSong){
            stopSong();
        }
    })

</script>

<div class="globalArea">
  {#if !appState.miniPlayer}
    <div class="topbarContainer">
      <Topbar />
    </div>
  {/if}

  <div class="contentArea" style="{appState.displayPlaybar ? "height: calc(100% - 160px);" : ""} {appState.miniPlayer ? "height: 100%;" : ""}">
  
    <div class="mainContentContainer">
      <Router {routes} />
    </div>

  </div>

  {#if appState.displayPlaybar && !appState.miniPlayer}
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

  .topbarContainer {
    width: 100%;
    min-height: 60px;
    height: 60px;
    z-index: 2;
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