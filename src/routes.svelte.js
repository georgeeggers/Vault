import EditProject from "./lib/editProject.svelte";
import Main from "./lib/main.svelte";

export const routes = {
    "/": Main,
    "/editProject/:id": EditProject
}