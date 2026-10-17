<script>
    import { appState } from "../../backend/appState.svelte";
    import { loadManager } from "../../backend/howlManagers.svelte";
    import { saveMirrorValueToStore, settingsMirror } from "../../backend/settings.svelte";
    import { deleteAllLocal } from "../../backend/sql.svelte";
    import PositionalAudioSelector from "../modules/positionalAudioSelector.svelte";
    import Toggle from "../modules/toggle.svelte";





</script>




<div class="uiMain">

    <div class="settingGroupContainer">
        <p>Test</p>

        <div class="settingGroup">
            <div class="settingRow">
                <div class="text">
                    <p class='title'>Setting name</p>
                    <p class='description'>Setting description</p>
                </div>
                <p>Test module</p>
            </div>

            <div class="settingRow">
                <div class="text">
                    <p class='title'>Setting name</p>
                    <p class='description'>Setting description</p>
                </div>
                <p>Test module</p>

            </div>

        </div>

        <p>Theme</p>

        <div class="settingGroup">
            <div class="settingRow">
                <div class="text">
                    <p class='title'>Dark Mode</p>
                    <p class='description'>Toggle between dark mode and light mode</p>
                </div>
                <Toggle bind:value={settingsMirror.lightMode} action={() => saveMirrorValueToStore('lightMode')}/>
            </div>

            <div class="settingRow">
                <div class="text">
                    <p class='title'>Main Hue</p>
                    <p class='description'>Change the main theme hue</p>
                </div>
                <input type='range' bind:value={settingsMirror.mainHue} min=0 max=360 onmouseup={() => saveMirrorValueToStore('mainHue')}/>
            </div>

        </div>

        <p>Backend</p>

        <div class="settingGroup">
            <div class="settingRow">
                <div class="text">
                    <p class='title'>Preload Size</p>
                    <p class='description'>The number of songs Vault will preload during playback. Currently {settingsMirror.maxPreloadSize} songs</p>
                </div>
                <input type='range' bind:value={settingsMirror.maxPreloadSize} min=1 max=10 onmouseup={() => saveMirrorValueToStore('maxPreloadSize')}/>

            </div>

            <div class="settingRow">
                <div class="text">
                    <p class='title'>Load Timeout</p>
                    <p class='description'>Max amount of time to wait for a song to load. Currently {settingsMirror.maxTimeToWaitForLoad} ms</p>
                </div>
                <input type='range' bind:value={settingsMirror.maxTimeToWaitForLoad} min=1000 max=20000 onmouseup={() => saveMirrorValueToStore('maxTimeToWaitForLoad')}/>
            </div>

            <div class="settingRow">
                <div class="text">
                    <p class='title'>Load Attempt Interval</p>
                    <p class='description'>Amount of time to poll load status while loading songs. Currently {settingsMirror.retryInterval} ms</p>
                </div>
                <input type='range' bind:value={settingsMirror.retryInterval} min=10 max=500 onmouseup={() => saveMirrorValueToStore('retryInterval')}/>
            </div>

        </div>


        <p>Extras</p>

        <div class="settingGroup">
            <div class="settingRow">
                <div class="text">
                    <p class='title'>Spatial Audio</p>
                    <p class='description'>Use spatial positioning for audio playback</p>
                </div>
                <Toggle bind:value={settingsMirror.positional} action={() => saveMirrorValueToStore('positional')}/>
            </div>

            {#if settingsMirror.positional}

                <div class="settingRow subSetting">
                    <div class="text">
                        <p class='title'>Positional Magnitude</p>
                        <p class='description'>Controls the magnitude of the positional effect</p>
                    </div>
                    <input type='range' bind:value={settingsMirror.positionMagnitude} min=0 max=10 onmouseup={() => saveMirrorValueToStore('positionMagnitude')}/>
                </div>

                <div class="settingRow subSetting">
                    <div class="text">
                        <p class='title'>Positional Control</p>
                        <p class='description'>Drag the position controller to alter positional audio</p>
                    </div>
                    <PositionalAudioSelector />
                </div>

            {/if}

        </div>

        <p>Debug</p>

        <div class="settingGroup">
            <div class="settingRow">
                <div class="text">
                    <p class='title'>Delete everything</p>
                    <p class='description'>Delete everything in the database. Undoable</p>
                </div>
                <button class='btn fail' onclick={deleteAllLocal}>Delete</button>
            </div>
        </div>
    </div>

</div>




<style>

    .subSetting {
        margin-left: 20px;
    }

    .uiMain {
        background-color: var(--bg0);
    }

    .settingGroupContainer {
        width: 100%;
        display: flex;
        gap: 10px;
        padding: 10px;
        box-sizing: border-box;
        justify-content: left;
        flex-direction: column;
    }

    .settingGroupContainer > p {
        font-size: 24px;
        font-weight: bold;
    }

    .settingGroup {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-sizing: border-box;
        margin-bottom: 30px;
    }

    .text {
        display: flex;
        flex-direction: column;
    }
    
    .title {
        color: var(--text1);
        font-size: 16px;
    }

    .description {
        color: var(--text7);
        font-size: 14px;
    }

    .settingRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

</style>