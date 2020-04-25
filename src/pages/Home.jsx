import React, { Component } from 'react';
import { Howl, Howler } from 'howler';
import { PitchShifter } from 'soundtouchjs';

class Home extends Component {
    state = { data: -1, cycleFile: ["/im.mp3", "/pickle.mp3", "/rick.mp3"], pitch: 1  };

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    keyDown(event) {
        

        let cycle = this.state.data;
        if (cycle >= 2) {
            cycle = 0;
        }
        else {
            cycle = cycle + 1;
        }

        this.setState({cycleFile: this.state.cycleFile, data: cycle, pitch: this.state.pitch + .05 });
        console.log(event)
        if (event.key === "a") {
            console.log("PRessed a")
            this.shiftPitch(this.state.pitch, "/rick.wav").send();
        }
        else if (event.key === "s") {
            this.shiftPitch(1, "/rick.wav").send();
        }
        else if (event.key === "d") {
            this.shiftPitch(1, "/rick.wav", 5).send();
        }

    }

    keyUp(event) {
        console.log("KEY UPss")

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

            let shifter = new PitchShifter(context, buffer, 1024);

            shifter.on('play', (detail) => {
                console.log(detail)
                if (detail.percentagePlayed >= 100) {
                    shifter.disconnect();
                }
            });
            if(duration) {
                shifter.tempo = shifter.duration/duration;
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

        var soundPlayer = new Audio();
        soundPlayer.src = "/pickle.mp3";
        
        soundPlayer.mozPreservesPitch = true;
        soundPlayer.playbackRate = 0.1;
        console.log(soundPlayer)
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