<script>
    import Router from "svelte-spa-router";
    import Sidebar from "./lib/sidebar.svelte";
    import Topbar from "./lib/topbar.svelte";

    import { routes } from "./routes.svelte";
    import { appState } from "./backend/appState.svelte";
    import Playbar from "./lib/playbar.svelte";
    import { notifications } from "./backend/appUtils.svelte";
    import { fly } from "svelte/transition";
    import { X } from "@lucide/svelte";

</script>

<div class="globalArea">

  <div class="topbarContainer">
    <Topbar />
  </div>

  <div class="contentArea" style="{appState.playing ? "height: calc(100% - 160px);" : ""}">
  
    <div class="mainContentContainer">
      <Router {routes} />
    </div>

  </div>

  {#if appState.playing}
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
  }

  .mainContentContainer {
    width: 100%;
    
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
  }
  
  .contentArea {
    height: calc(100% - 60px);
    width: 100%;
    display: flex;
    box-sizing: border-box;
  }

</style>