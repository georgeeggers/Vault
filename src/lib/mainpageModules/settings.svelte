<script>
    import { appState } from "../../backend/appState.svelte";
    import { loadManager } from "../../backend/howlManagers.svelte";
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
                <Toggle bind:value={appState.settings.lightMode} />
            </div>

            <div class="settingRow">
                <div class="text">
                    <p class='title'>Main Hue</p>
                    <p class='description'>Change the main theme hue</p>
                </div>
                <input type='range' bind:value={appState.settings.mainHue} min=0 max=360/>
            </div>

        </div>

        <p>Extras</p>

        <div class="settingGroup">
            <div class="settingRow">
                <div class="text">
                    <p class='title'>Spatial Audio</p>
                    <p class='description'>Use spatial positioning for audio playback</p>
                </div>
                <Toggle bind:value={loadManager.positional} />
            </div>

            {#if loadManager.positional}

                <div class="settingRow subSetting">
                    <div class="text">
                        <p class='title'>Positional Magnitude</p>
                        <p class='description'>Controls the magnitude of the positional effect</p>
                    </div>
                    <input type='range' bind:value={loadManager.positionMagnitude} min=0 max=10 />
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