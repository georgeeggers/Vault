// stole this from the official music tempo repo
// this works, but it causes an error bc the repo nearly predates typescript
// @ts-ignore
import MusicTempo from 'music-tempo'
 
export const calcTempo = async (file: File) =>  {

    const ac = new AudioContext();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = await ac.decodeAudioData(arrayBuffer)

    var audioData = [];
    // Take the average of the two channels
    if (buffer.numberOfChannels == 2) {
        var channel1Data = buffer.getChannelData(0);
        var channel2Data = buffer.getChannelData(1);
        var length = channel1Data.length;
        for (var i = 0; i < length; i++) {
            audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
        }
    } else {
        // @ts-ignore
        audioData = buffer.getChannelData(0);
    }
    return new MusicTempo(audioData).tempo;
}