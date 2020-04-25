import React, { Component } from 'react';
import { PitchShifter } from 'soundtouchjs';

class Home extends Component {
    state = { data: -1, cycleFile: ["/im.mp3", "/pickle.mp3", "/rick.mp3"], pitch: 1 };

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }



    keyDown(event) {
        let json = require('./newworld.json')
        // console.log(json)

        let scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        let midiNumber = 64;


        let cycle = this.state.data;
        if (cycle >= 2) {
            cycle = 0;
        }
        else {
            cycle = cycle + 1;
        }

        this.setState({ cycleFile: this.state.cycleFile, data: cycle, pitch: this.state.pitch + .05 });
        // console.log(event)
        if (event.key === "a") {
            this.shiftPitch(this.state.pitch, "/rick.wav").send();
        }
        else if (event.key === "s") {
            this.shiftPitch(1, "/rick.wav").send();
        }
        else if (event.key === "d") {
            console.log("hiff")
            this.shiftPitch(1, "/rick.wav", 5).send();
        }
        else if (event.key === "f") {
            let x = 0;
            json.tracks[0].notes.forEach(element => {
                // console.log(element)
                // console.log(1 - (.05 * (midiNumber - element.midi)));
                // console.log(element.time*1000)

                setTimeout(() => {
                    this.shiftPitch(1 - (.05 * (midiNumber - element.midi)), "/rick.wav", element.duration).send();
                }, element.time * 1000);


            })

        }
        else if (event.key === "h") {
            this.getDuration("/rick.mp3")
        }

    }

    shiftPitch(pitch, file, duration) {
        var context = new AudioContext(), request = new XMLHttpRequest();
        request.open("GET", file, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            context.decodeAudioData(request.response, onDecoded);

        };
        function onDecoded(buffer) {

            // console.log(buffer.length)
            var bufferSource = context.createBufferSource();
            const gainNode = context.createGain();
            bufferSource.buffer = buffer;

            let shifter = new PitchShifter(context, buffer, 4096);

            shifter.on('play', (detail) => {
                if (detail.percentagePlayed >= 100) {
                    shifter.disconnect();

                }
            });
            if (false) {
                shifter.tempo = shifter.duration / duration;
            }
            else {
                shifter.tempo = 1;
            }

            shifter.pitch = pitch;
            shifter.connect(gainNode);
            gainNode.connect(context.destination);
            bufferSource.connect(context.destination);
        }


        return request;
    }

    async getDuration(file) {
        var context = new AudioContext();
        let request = new XMLHttpRequest();

        request.open("GET", file, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            // let x = await new Promise(resolve => {context.decodeAudioData(request.response, onDecoded)}, 2000);
            let x = onDecoded;
            console.log(onDecoded)

        }

        async function onDecoded(buffer) {
            var bufferSource = context.createBufferSource();
            bufferSource.buffer = buffer;
            // console.log(buffer.duration)
            // bufferSource.connect(context.destination);
            // bufferSource.start();
            return buffer.duration;
        }
        console.log(request.response)
        let x = request.send();
        console.log(request)
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyDown, false);
        document.addEventListener("keyup", this.keyUp, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDown, false);
        document.removeEventListener("keyup", this.keyUp, false);
    }



    handleClick() {
        // let x = await this.getDuration("./rick.mp3")
        this.playAudio();
    }


    playAudio() {
        console.log(this.getDuration("./rick.mp3"));
        var soundPlayer = new Audio();
        soundPlayer.src = "./rick.mp3";
        soundPlayer.mozPreservesPitch = true;
        soundPlayer.playbackRate = 1;
        console.log(soundPlayer.length);
        soundPlayer.play();
    }

    render() {

        return (
            <div>
                <button onClick={this.handleClick}>HI</button>
            </div>
        )
    };
};

export default Home;