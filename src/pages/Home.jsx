import React, { Component } from 'react';
import { PitchShifter } from 'soundtouchjs';
import listReactFiles from 'list-react-files'

class Home extends Component {
    state = { data: -1, cycleFile: ["/im.mp3", "/pickle.mp3", "/rick.mp3"], pitch: 4 };

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }



    keyDown(event) {

        let rickScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        let midiNumber = 64;


        let cycle = this.state.data;
        if (cycle >= 2) {
            cycle = 0;
        }
        else {
            cycle = cycle + 1;
        }
        
        // console.log(event)
        if (event.key === "a") {
            this.playNote("C"+this.state.pitch);
        }
        else if (event.key === "s") {
            this.playNote("D"+this.state.pitch);
        }
        else if (event.key === "d") {
            this.playNote("E"+this.state.pitch);
        }
        else if (event.key === "w") {
            this.playNote("Csharp"+this.state.pitch);
        }
        else if (event.key === "e") {
            this.playNote("Dsharp"+this.state.pitch);
        }
        else if (event.key === "f") {
            this.playNote("F"+this.state.pitch);
        }
        else if (event.key === "g") {
            this.playNote("G"+this.state.pitch);
        }
        else if (event.key === "h") {
            this.playNote("A"+this.state.pitch);
        }
        else if (event.key === "j") {
            this.playNote("B"+this.state.pitch);
        }
        else if (event.key === "k") {
            let x = this.state.pitch+1
            this.playNote("C"+x);
        }
        else if (event.key === "l") {
            let x = this.state.pitch+1
            this.playNote("D"+x);
        }
        else if (event.key === ";") {
            let x = this.state.pitch+1
            this.playNote("E"+x);
        }
        else if (event.key === "'") {
            let x = this.state.pitch+1
            this.playNote("F"+x);
        }
        else if (event.key === "t") {
            this.playNote("Fsharp"+this.state.pitch);
        }
        else if (event.key === "y") {
            this.playNote("Gsharp"+this.state.pitch);
        }
        else if (event.key === "u") {
            this.playNote("Asharp"+this.state.pitch);
        }
        else if (event.key === "o") {
            let x = this.state.pitch+1
            this.playNote("Csharp"+x);
        }
        else if (event.key === "p") {
            let x = this.state.pitch+1
            this.playNote("Dsharp"+x);
        }



    }

    experimental(json, allNotes, midiNumber) {
        json.tracks[0].notes.forEach(element => {
            console.log(element);
            // console.log(1 - (.05 * (midiNumber - element.midi)));
            // console.log(element.time*1000)
            if (!allNotes.includes(element.name)) {
                allNotes.push(element.name);
            }
            setTimeout(() => {
                this.shiftPitch(1 - (.05 * (midiNumber - element.midi)), "/rick.wav", element.duration).send();
            }, element.time * 1000);
        });
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

    componentDidMount() {
        document.addEventListener("keydown", this.keyDown, false);
        document.addEventListener("keyup", this.keyUp, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDown, false);
        document.removeEventListener("keyup", this.keyUp, false);
    }



    handleClick() {
        this.playAudio();
    }

    handleClick2() {
        let json = require('./newworld.json')
        json.tracks[0].notes.forEach(element => {
            console.log(element);
            setTimeout(() => {
                this.playNote(element.name);
            }, element.time * 1000);
        });
    }

    playNote(note) {
        note = note.replace("#", "sharp")
        var soundPlayer = new Audio();
        soundPlayer.src = "./rick_" + note + ".mp3";
        console.log(soundPlayer.src);
        soundPlayer.mozPreservesPitch = true;
        soundPlayer.playbackRate = 1;
        soundPlayer.play();
    }


    playAudio() {
        var soundPlayer = new Audio();
        soundPlayer.src = "./rick_E4.mp3";
        soundPlayer.mozPreservesPitch = true;
        soundPlayer.playbackRate = 1;
        console.log(soundPlayer.length);
        soundPlayer.play();
    }

    render() {

        return (
            <div>
                <button onClick={this.handleClick}>HI</button>
                <button onClick={this.handleClick2}>mario song</button>
            </div>
        )
    };
};

export default Home;