<script lang='ts'>
    import { onMount } from "svelte";
    import { loadManager } from "../../backend/howlManagers.svelte";

    let dragging: boolean = $state(false);
    let draggerX = $state(59);
    let draggerY = $state(59);
    
    onMount(() => {
        draggerX = Math.round(loadManager.positionX / loadManager.positionMagnitude * 59) + 59
        draggerY = Math.round(loadManager.positionY / loadManager.positionMagnitude * 59) + 59

    })

    const updateHowlsAndPositions = () => {
        loadManager.positionX = ((draggerX - 59) / 59) * loadManager.positionMagnitude;
        loadManager.positionY = ((draggerY - 59) / 59) * loadManager.positionMagnitude;
        for(let i of loadManager.preloads){
            if(i.howlInstance?.howl && loadManager.positional){
                i.howlInstance.howl.pos(loadManager.positionX, 0, loadManager.positionY);
            }
        }
    }

    let dragLogicDesktop = (e: MouseEvent) => {
        if(dragging == null){
            document.removeEventListener("mousemove", dragLogicDesktop);
            document.removeEventListener('mouseup', endDragDesktop)
            return;
        }

        draggerX += e.movementX;
        draggerY += e.movementY;
        if(draggerX > 118){
            draggerX = 118;
        } else if (draggerX < 0){
            draggerX = 0;
        }

        if(draggerY > 118){
            draggerY = 118;
        } else if (draggerY < 0){
            draggerY = 0;
        }

        updateHowlsAndPositions();

    };

    const startDragDesktop = (e: MouseEvent) => {
        e.preventDefault();
        dragging = true;
        document.addEventListener("mousemove", dragLogicDesktop);
        document.addEventListener('mouseup', endDragDesktop)
    };

    const endDragDesktop = (e: MouseEvent) => {
        if(e.button == 0 && dragging != null){
            document.removeEventListener("mousemove", dragLogicDesktop);
            document.removeEventListener('mouseup', endDragDesktop)
            dragging = false;
        }
    };

</script>

<div class="positionalAudioSelector">

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="audioArea"
        style='
            left: {draggerX}px;
            top: {draggerY}px;
        '
        onmousedown={(e) => startDragDesktop(e)}
    >
        <div class="circle"></div>
        <div class="circle" style='animation-delay: .25s; border-color: var(--main3);'></div>
        <div class="circle" style='animation-delay: .5s; border-color: var(--main2);'></div>

    </div>

    <div class="center">

    </div>

</div>



<style>

    .audioArea {
        width: 20px;
        height: 20px;
        background-color: var(--main5);
        position: absolute;
        display: grid;
        box-sizing: border-box;
        place-items: center;
        z-index: 2;
    }

    .audioArea > * {
        grid-area: 1/1;
    }

    @keyframes scaleUp {
        0% { scale: 0; border-width: 2px; }
        66% { scale: 23; border-width: .25px; }
        100% { scale: 23; border-width: .25px; }
    }

    .circle {
        width: 20px;
        height: 20px;
        scale: 0;
        border-radius: 10px;
        border: 2px solid var(--main4);
        box-sizing: border-box;
        animation: scaleUp 4000ms ease infinite;
    }

    .center {
        width: 20px;
        height: 20px;
        background-color: var(--text1);
    }

    .positionalAudioSelector {
        width: 140px;
        height: 140px;
        min-width: 140px;
        min-height: 140px;
        background-color: var(--bg0);
        position: relative;
        display: flex;
        box-sizing: border-box;
        border: 1px solid var(--text1);
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
</style>