import React, { Component } from 'react';
import { PitchShifter } from 'soundtouchjs';
import MediaGrid from '../components/MediaGrid';
import { Button, Container, Divider, Segment } from 'semantic-ui-react';
import '../style/keyboard.css'
class Home extends Component {
    state = { cyclePickleRick: ["rick"], pitch: 4, cycle: 0, persons: [], notes: [], audio: new Audio() };



    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.playMidi = this.playMidi.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }


    keyDown(event) {
        let defaultKeys = { rick: { note: "E4", midi: 64 }, pickle: { note: "Dsharp4", midi: 63 } }

        let sound = this.state.cyclePickleRick[this.state.cycle] + "_" + defaultKeys[this.state.cyclePickleRick[this.state.cycle]].note + ".mp3"

        console.log(sound)

        let midi = defaultKeys[this.state.cyclePickleRick[this.state.cycle]].midi;

        this.cycleSound();
        let pitch = (this.state.pitch - 1) * 12;

        if (event.key === "a") {
            this.playNote("C" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * (midi - 60)), "/"+sound).send();
        }
        else if (event.key === "s") {
            this.playNote("D" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * (midi - 62)), "/"+sound).send();
        }
        else if (event.key === "d") {
            // this.shiftPitch(1 - (.05 * (midi - 64)), "/"+sound).send();
            this.playNote("E" + this.state.pitch);
        }
        else if (event.key === "w") {
            this.playNote("Csharp" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * (midi - 61)), "/"+sound).send();
        }
        else if (event.key === "e") {
            this.playNote("Dsharp" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * (midi - 63)), "/"+sound).send();
        }
        else if (event.key === "f") {
            this.playNote("F" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * (midi - 65)), "/"+sound).send();
        }
        else if (event.key === "g") {
            this.playNote("G" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * (midi - 67)), "/"+sound).send();
        }
        else if (event.key === "h") {
            this.playNote("A" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * (midi - 69)), "/"+sound).send();
        }
        else if (event.key === "j") {
            this.playNote("B" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * (midi - 71)), "/"+sound).send();
        }
        else if (event.key === "k") {
            let x = this.state.pitch + 1
            this.playNote("C" + x);
            // this.shiftPitch(1 - (.05 * ((midi - 60-12))), "/"+sound).send();
        }
        else if (event.key === "l") {
            let x = this.state.pitch + 1
            this.playNote("D" + x);
            // this.shiftPitch(1 - (.05 * ((midi - 62 - 12))), "/"+sound).send();
        }
        else if (event.key === ";") {
            let x = this.state.pitch + 1
            this.playNote("E" + x);
            // this.shiftPitch(1 - (.05 * ((midi - 64 - 12))), "/"+sound).send();
        }
        else if (event.key === "'") {
            let x = this.state.pitch + 1
            this.playNote("F" + x);
            // this.shiftPitch(1 - (.05 * ((midi - 65 - 12))), "/"+sound).send();
        }
        else if (event.key === "t") {
            this.playNote("Fsharp" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * ((midi - 66))), "/"+sound).send();
        }
        else if (event.key === "y") {
            this.playNote("Gsharp" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * ((midi - 68))), "/"+sound).send();
        }
        else if (event.key === "u") {
            this.playNote("Asharp" + this.state.pitch);
            // this.shiftPitch(1 - (.05 * ((midi - 70))), "/"+sound).send();
        }
        else if (event.key === "o") {
            let x = this.state.pitch + 1
            this.playNote("Csharp" + x);
            // this.shiftPitch(1 - (.05 * ((midi - 61 - 12))), "/"+sound).send();
        }
        else if (event.key === "p") {
            let x = this.state.pitch + 1
            this.playNote("Dsharp" + x);
            // this.shiftPitch(1 - (.05 * ((midi - 63 - 12))), "/"+sound).send();
        }

        console.log("key press")
        const key = document.querySelector(`div[data-key="${event.keyCode}"]`);
        // const audio = document.querySelector(`audio`);

        if (!key) { return; }

        // audio.currentTime = 0;
        // audio.play();
        key.classList.add("pressed");
        const keys = document.querySelectorAll('.key, .sharpkey');
        keys.forEach(key => key.addEventListener('transitionend', this.removeTransition));



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

            // shifter.tempo = 1;
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
        document.addEventListener("onEnded", this.onEnd, false);


    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDown, false);
        document.removeEventListener("keyup", this.keyUp, false);
    }



    handleClick() {
        // this.playAudio();
        let json = require('./dmc.json')
        this.experimental(json, 64)
        // this.toneShift();
    }

    playMidi() {
        let json = require('./zelda.json')
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

    removeTransition(e) {
        if (e.propertyName !== 'transform') return;
        console.log(e.keyCode + " transition ended");
        this.classList.remove('pressed');
    }

    playNote(note) {
        console.log("playing note" + note)


        note = note.replace("#", "sharp")
        this.state.audio = new Audio("./" + this.state.cyclePickleRick[this.state.cycle] + "_" + note + ".mp3");

        this.state.audio.mozPreservesPitch = true;
        this.state.audio.playbackRate = 1;
        this.state.audio.onloadedmetadata = function () {
            setTimeout(() => {
                this.onEnd(note);
            }, this.state.audio.duration * 1000);
        }.bind(this);

        this.state.audio.play();
        this.cycleSound(note);


    }

    removeFirst(note, array) {
        let newArray = [];
        let filtered = false;
        array.forEach(element => {
            if (element == note && !filtered) {
                filtered = true;
            }
            else {
                newArray.push(element);
            }

        })
        return newArray;
    }

    onEnd(note) {
        console.log(note)
        // this.state.notes = this.removeFirst(note, this.state.notes);
        this.setState({ cyclePickleRick: this.state.cyclePickleRick, pitch: this.state.pitch, cycle: this.state.cycle, notes: this.removeFirst(note, this.state.notes) });
    }

    cycleSound(note) {
        let cycle = this.state.cycle >= this.state.cyclePickleRick.length - 1 ? 0 : this.state.cycle + 1;
        this.setState({ cyclePickleRick: this.state.cyclePickleRick, pitch: this.state.pitch, cycle: cycle, notes: [...this.state.notes, note] });
        // this.state.notes.push(note);
    }

    playAudio() {
        // var soundPlayer = new Audio();
        // soundPlayer.src = "./Arms\ of\ an\ Angel.mp3";
        // soundPlayer.mozPreservesPitch = true;
        // soundPlayer.playbackRate = 1;
        // console.log(soundPlayer.length);
        // soundPlayer.play();


        // for (let i = 0; i < 3; i) {
        //     setTimeout(() => {
        //         this.shiftPitch(1 - (.05 * (60-1)), "/rick.wav", element.duration).send();
        //     }, element.time * 1000);
        // }

    }

    getMedia() {
        let removeUndefined = [];
        this.state.notes.forEach(element => {
            if (element) {
                removeUndefined.push(element);
            }
        });
        this.state.notes = removeUndefined;
        return (
            <MediaGrid soundPlaying={this.state.notes} />
        )
    }

    render() {

        return (
            <div>
                <Segment>

                    <div>
                        <Button onClick={this.handleClick}>HI</Button>
                        <Button onClick={this.playMidi}>Now it's zelda</Button>
                        <button onClick={this.playAudio}>Angels</button>
                    </div>
                    </Segment>
                    <div>
                        {this.getMedia()}
                    </div>


                <Segment>

                    <div class="keys">
                        <div class="blankkey" />
                        <div data-key="87" class="sharpkey">
                            <kbd>W</kbd>
                        </div>
                        <div data-key="69" class="sharpkey">
                            <kbd>E</kbd>
                        </div>
                        <div class="blankkey" />
                        <div data-key="84" class="sharpkey">
                            <kbd>T</kbd>
                        </div>
                        <div data-key="89" class="sharpkey">
                            <kbd>Y</kbd>
                        </div>
                        <div data-key="85" class="sharpkey">
                            <kbd>U</kbd>
                        </div>
                        <div class="blankkey" />
                        <div data-key="79" class="sharpkey">
                            <kbd>O</kbd>
                        </div>
                        <div data-key="80" class="sharpkey">
                            <kbd>P</kbd>
                        </div>
                        <div class="blankkey" />
                        <div class="blankkey" />
                        <div class="blankkey" />
                    </div>

                    {/* <!-- A through Enter--> */}
                    <div class="keys2">
                        <div data-key="65" class="key">
                            <kbd>A</kbd>
                        </div>
                        <div data-key="83" class="key">
                            <kbd>S</kbd>
                        </div>
                        <div data-key="68" class="key">
                            <kbd>D</kbd>
                        </div>
                        <div data-key="70" class="key">
                            <kbd>F</kbd>
                        </div>
                        <div data-key="71" class="key">
                            <kbd>G</kbd>
                        </div>
                        <div data-key="72" class="key">
                            <kbd>H</kbd>
                        </div>
                        <div data-key="74" class="key">
                            <kbd>J</kbd>
                        </div>
                        <div data-key="75" class="key">
                            <kbd>K</kbd>
                        </div>
                        <div data-key="76" class="key">
                            <kbd>L</kbd>
                        </div>
                        <div data-key="186" class="key">
                            <kbd>:</kbd>
                            <kbd>;</kbd>
                        </div>
                        <div data-key="222" class="key">
                            <kbd>"</kbd>
                            <kbd>'</kbd>
                        </div>
                    </div>
                </Segment>
            </div>
        )
    };
};

export default Home;