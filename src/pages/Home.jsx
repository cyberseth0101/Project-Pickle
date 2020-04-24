import React, { Component } from 'react';
import { Howl, Howler } from 'howler';
import { PitchShifter } from 'soundtouchjs';

class Home extends Component {

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }

    keyDown(event) {
        console.log(event)
        if (event.key === "a") {
            console.log("PRessed a")
            this.shiftPitch(1).send();
            //Do whatever when esc is pressed
        }
        else if (event.key === "s") {
            this.shiftPitch(1.05).send();
        }
        else if (event.key === "d") {
            this.shiftPitch(1.10).send();
        }

    }


    shiftPitch(pitch) {
        var context = new AudioContext(), request = new XMLHttpRequest();
        request.open("GET", "/rick.mp3", true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            context.decodeAudioData(request.response, onDecoded);
        };
        function onDecoded(buffer) {
            var bufferSource = context.createBufferSource();
            const gainNode = context.createGain();
            bufferSource.buffer = buffer;

            let shifter = new PitchShifter(context, buffer, 1024);

            shifter.on('play', (detail) => {
                if (detail.percentagePlayed >= 100) {
                    shifter.disconnect();
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
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDown, false);
    }



    handleClick() {

        var soundPlayer = new Audio();
        soundPlayer.src = "/im.mp3";
        soundPlayer.mozPreservesPitch = true;
        soundPlayer.playbackRate = 0.1;
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