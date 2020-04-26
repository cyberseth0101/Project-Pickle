import React, { Component } from 'react';
import { PitchShifter } from 'soundtouchjs';


class Home extends Component {
    state = { cyclePickleRick: ["rick"], pitch: 4, cycle: 0 };

    

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.playMidi = this.playMidi.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }




    keyDown(event) {
        let defaultKeys = {rick: {note: "E4", midi: 64 }}

        let sound = this.state.cyclePickleRick[this.state.cycle] + "_" + defaultKeys[this.state.cyclePickleRick[this.state.cycle]].note + ".mp3"

        let midi = defaultKeys[this.state.cyclePickleRick[this.state.cycle]].midi;

        this.cycleSound();
        let pitch = (this.state.pitch - 1) * 12;

        if (event.key === "a") {
            // this.playNote("C" + this.state.pitch);
            this.shiftPitch(1 - (.05 * (midi - 60)), "/"+sound).send();
        }
        else if (event.key === "s") {

            this.shiftPitch(1 - (.05 * (midi - 62)), "/"+sound).send();
        }
        else if (event.key === "d") {
            this.shiftPitch(1 - (.05 * (midi - 64)), "/"+sound).send();
        }
        else if (event.key === "w") {
            // this.playNote("Csharp" + this.state.pitch);
            this.shiftPitch(1 - (.05 * (midi - 61)), "/"+sound).send();
        }
        else if (event.key === "e") {
            // this.playNote("Dsharp" + this.state.pitch);
            this.shiftPitch(1 - (.05 * (midi - 63)), "/"+sound).send();
        }
        else if (event.key === "f") {
            // this.playNote("F" + this.state.pitch);
            this.shiftPitch(1 - (.05 * (midi - 65)), "/"+sound).send();
        }
        else if (event.key === "g") {
            // this.playNote("G" + this.state.pitch);
            this.shiftPitch(1 - (.05 * (midi - 67)), "/"+sound).send();
        }
        else if (event.key === "h") {
            // this.playNote("A" + this.state.pitch);
            this.shiftPitch(1 - (.05 * (midi - 69)), "/"+sound).send();
        }
        else if (event.key === "j") {
            // this.playNote("B" + this.state.pitch);
            this.shiftPitch(1 - (.05 * (midi - 71)), "/"+sound).send();
        }
        else if (event.key === "k") {
            let x = this.state.pitch + 1
            // this.playNote("C" + x);
            this.shiftPitch(1 - (.05 * ((midi - 60-12))), "/"+sound).send();
        }
        else if (event.key === "l") {
            let x = this.state.pitch + 1
            // this.playNote("C" + x);
            this.shiftPitch(1 - (.05 * ((midi - 62 - 12))), "/"+sound).send();
        }
        else if (event.key === ";") {
            let x = this.state.pitch + 1
            // this.playNote("E" + x);
            this.shiftPitch(1 - (.05 * ((midi - 64 - 12))), "/"+sound).send();
        }
        else if (event.key === "'") {
            let x = this.state.pitch + 1
            // this.playNote("F" + x);
            this.shiftPitch(1 - (.05 * ((midi - 65 - 12))), "/"+sound).send();
        }
        else if (event.key === "t") {
            // this.playNote("Fsharp" + this.state.pitch);
            this.shiftPitch(1 - (.05 * ((midi - 66))), "/"+sound).send();
        }
        else if (event.key === "y") {
            // this.playNote("Gsharp" + this.state.pitch);
            this.shiftPitch(1 - (.05 * ((midi - 68))), "/"+sound).send();
        }
        else if (event.key === "u") {
            // this.playNote("Asharp" + this.state.pitch);
            this.shiftPitch(1 - (.05 * ((midi - 70))), "/"+sound).send();
        }
        else if (event.key === "o") {
            let x = this.state.pitch + 1
            // this.playNote("Csharp" + x);
            this.shiftPitch(1 - (.05 * ((midi - 61 - 12))), "/"+sound).send();
        }
        else if (event.key === "p") {
            let x = this.state.pitch + 1
            // this.playNote("Dsharp" + x);
            this.shiftPitch(1 - (.05 * ((midi - 63 - 12))), "/"+sound).send();
        }



    }

    experimental(json, midiNumber) {
        json.tracks[0].notes.forEach(element => {
            // console.log(element);
            // console.log(1 - (.05 * (midiNumber - element.midi)));
            // console.log(element.time*1000)
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

            var bufferSource = context.createBufferSource();
            const gainNode = context.createGain();
            bufferSource.buffer = buffer;

            let shifter = new PitchShifter(context, buffer, 4096);

            shifter.on('play', (detail) => {
                console.log(buffer)
                console.log(bufferSource)
                if (detail.percentagePlayed >= 100) {
                    shifter.disconnect(gainNode);
                }
            });

            shifter.tempo = 1;
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
        // this.playAudio();
        let json = require('./mario.json')
        this.experimental(json, 64)
        // this.toneShift();
    }

    playMidi() {
        let json = require('./dmc.json')
        this.setState({ cyclePickleRick: this.state.cyclePickleRick, pitch: this.state.pitch, cycle: this.state.cycle })

        // json.tracks[0].notes.forEach(element => {
        //     if (!allNotes.includes(element.name)) {
        //         allNotes.push(element.name);
        //     }
        //     setTimeout(() => {
        //         this.playNote(element.name);
        //     }, element.time * 1000);
        // });
        // json.tracks[1].notes.forEach(element => {
        //     if (!allNotes.includes(element.name)) {
        //         allNotes.push(element.name);
        //     }
        //     setTimeout(() => {
        //         this.playNote(element.name);
        //     }, element.time * 1000);
        // });
        let allNotes = []
        json.tracks.forEach(track => {
            // console.log(track)
            track.notes.forEach(element => {
                if (!allNotes.includes(element.name)) {
                    allNotes.push(element.name);
                }
                setTimeout(() => {
                    this.playNote(element.name);
                }, element.time * 1000);
            });
        })

        console.log(allNotes)
    }

    playNote(note) {
        console.log("playing note" + note)


        note = note.replace("#", "sharp")
        var soundPlayer = new Audio();
        soundPlayer.src = "./" + this.state.cyclePickleRick[this.state.cycle] + "_" + note + ".mp3";
        console.log(soundPlayer.src);
        soundPlayer.mozPreservesPitch = true;
        soundPlayer.playbackRate = 1;
        soundPlayer.play();
        this.cycleSound();

    }


    cycleSound() {
        let cycle = this.state.cycle >= this.state.cyclePickleRick.length - 1 ? 0 : this.state.cycle + 1;
        this.setState({ cyclePickleRick: this.state.cyclePickleRick, pitch: this.state.pitch, cycle: cycle });
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
                <button onClick={this.playMidi}>mario song</button>
            </div>
        )
    };
};

export default Home;