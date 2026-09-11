<script>
    import Router from "svelte-spa-router";
    import Sidebar from "./lib/sidebar.svelte";
    import Topbar from "./lib/topbar.svelte";

    import { routes } from "./routes.svelte";
    import { appState } from "./backend/appState.svelte";
    import Playbar from "./lib/playbar.svelte";

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