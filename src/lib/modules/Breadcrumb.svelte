<script lang='ts'>
    import { onMount } from 'svelte';
    import { router } from 'svelte-spa-router';

    const getLocations = (location: string) => {
        let url = "";
        let output = [];
        for(let i of location.split("/")){
            output.push({
                display: i,
                location: url + i + "/"
            });

            url += i + "/"
        }
        return output.splice(1);
    }

    let locations = $derived(getLocations(router.location));

    onMount(() => {
        getLocations(router.location)
    })

</script>

<div class="breadcrumb">
    {#each locations as l}

        <a href="{l.location}">
            <p>{l.display}</p>
        </a>
    {/each}
</div>

<style>

.breadcrumb {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    box-sizing: border-box;
    padding: 10px;
}

.breadcrumb a {
    text-decoration: none;
    cursor: pointer;
    font-size: 16px;
}

</style>