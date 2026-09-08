<script>
    import Router from "svelte-spa-router";
    import Sidebar from "./lib/sidebar.svelte";
    import Topbar from "./lib/topbar.svelte";

    import { routes } from "./routes.svelte";

</script>

<div class="globalArea">

  <div class="topbarContainer">
    <Topbar />
  </div>

  <div class="contentArea">
  
    <div class="mainContentContainer">
      <Router {routes} />
    </div>

  </div>

</div>

<style>

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
    flex-direction: row;
    box-sizing: border-box;
  }

  .sidebarContainer {
    height: 100%;
    display: flex;
    box-sizing: border-box;
    width: 300px;
  }

</style>