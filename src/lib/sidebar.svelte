<script>
    import { Home, MicVocal, Search, VaultIcon } from "@lucide/svelte";
    import { replace, router } from "svelte-spa-router";



</script>



<div class="sidebar">

    <div class="topbarController" data-tauri-drag-region>
        <div class="item">
            <div class="svgWrapper">
                <VaultIcon size=28 />
            </div>
            <p>Vault</p>
        </div>
    </div>

    <div class="spacer"></div>

    <label 
        class="item {router.location == "/" ? "active" : ""} nav"
        for="gotoHome"
    >
        <div class="svgWrapper">
            <Home size=28 />
        </div>
        <p>Home</p>
    </label>
    <button onclick={() => replace("/")} id='gotoHome' class='invis'>Goto home</button>



    <label 
        class="item {router.location == "/search" ? "active" : ""} nav"
        for="gotoSearch"
    >
        <div class="svgWrapper">
            <Search size=28 />
        </div>
        <p>Search</p>
    </label>
    <button onclick={() => replace("/search")} id='gotoSearch' class='invis'>Goto search</button>



    <label 
        class="item {router.location == "/lyric" ? "active" : ""} nav"
        for="gotoLyric"
    >
        <div class="svgWrapper">
            <MicVocal size=28 />
        </div>
        <p>Lyrics</p>
    </label>
    <button onclick={() => replace("/")} id='gotoHome' class='invis'>Goto home</button>



</div>



<style>

    .spacer {
        height: 1px;
        background-color: var(--bg1);
    }

    .nav {
        cursor: pointer;
    }

    .item {
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        padding: 10px 20px 10px 20px;
        border-radius: var(--border-radius);
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .item p {
        font-size: 18px;
        margin-left: 10px;
    }

    .sidebar {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 5px;
    }


</style>