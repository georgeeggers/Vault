import Main from "./lib/main.svelte";
import MiniPlayer from "./lib/miniPlayer.svelte";
import Settings from "./lib/mainpageModules/settings.svelte";

export const routes = {
    "/": Main,
    "/miniplayer": MiniPlayer,
    "/settings": Settings
}