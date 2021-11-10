import "./App.css";
import {
  mdiPlusCircleOutline,
  mdiPlusCircle,
  mdiMinusCircle,
  mdiMinusCircleOutline,
  mdiPlayCircle,
  mdiPlayCircleOutline,
  mdiPauseCircle,
  mdiPauseCircleOutline,
  mdiSkipPreviousCircle,
  mdiSkipPreviousCircleOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import { React, useState, useEffect } from "react";

function App() {
  const [breaklength, setBreaklength] = useState(300);
  const [sessionlength, setSessionlength] = useState(1500);
  const [clockCount, setClockCount] = useState(1500);
  const [currentTimer, setCurrentTimer] = useState("Session");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playPauseIcon, setPlayPauseIcon] = useState(mdiPlayCircle);
  const [loop, setLoop] = useState();

  useEffect(() => {
    let interval = null;
    if (!isPlaying) {
      clearInterval(loop);
      setPlayPauseIcon(mdiPlayCircle);
      console.log("Clock not running");
    } else if (isPlaying) {
      interval = setInterval(() => {
        if (clockCount === 0) {
          setCurrentTimer(currentTimer === "Session" ? "Break" : "Session");
          setClockCount(
            currentTimer === "Session" ? breaklength : sessionlength
          );
          document.getElementById("beep").play();
        } else {
          setClockCount(clockCount - 1);
        }
      }, 1000);
      setLoop(interval);
      setPlayPauseIcon(mdiPauseCircle);
      console.log("Clock running");
    }
    return () => clearInterval(interval);
  }, [isPlaying, clockCount, breaklength, sessionlength]);

  const convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const handleReset = () => {
    setBreaklength(300);
    setSessionlength(1500);
    setClockCount(1500);
    setCurrentTimer("Session");
    setIsPlaying(false);
    clearInterval(loop);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  };

  const breakProps = {
    title: "Break",
    count: breaklength,
  };

  const sessionProps = {
    title: "Session",
    count: sessionlength,
  };

  const handleTimerAdjust = (amount, type) => {
    if (type === "Break") {
      if (breaklength <= 60 && amount < 0) {
        return;
      }
      setBreaklength((prev) => prev + amount);
    } else {
      if (sessionlength <= 60 && amount < 0) {
        return;
      }
      setSessionlength((prev) => prev + amount);
      if (!isPlaying) {
        setClockCount((prev) => prev + amount);
      }
    }
  };

  const SetTimer = (props) => {
    const id = props.title.toLowerCase();
    return (
      <div className="timer-container">
        <h2 id={id + "-label"}>{props.title} Length</h2>
        <div className="flex controls">
          <button
            id={id + "-decrement"}
            onClick={() => handleTimerAdjust(-60, props.title)}
          >
            <Icon
              path={mdiMinusCircleOutline}
              title="Decrease"
              size={1}
              color="black"
            />
          </button>
          <span id={id + "-length"}>{props.count / 60}</span>
          <button
            id={id + "-increment"}
            onClick={() => handleTimerAdjust(60, props.title)}
          >
            <Icon
              path={mdiPlusCircleOutline}
              title="Increase"
              size={1}
              color="black"
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="flex">
        <SetTimer {...breakProps} />
        <SetTimer {...sessionProps} />
      </div>
      <div className="clock-container">
        <audio
          id="beep"
          preload="auto"
          src="http://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav"
        />
        <h1 id="timer-label">{currentTimer}</h1>
        <span id="time-left">{convertToTime(clockCount)}</span>
        <div className="flex">
          <button id="start_stop" onClick={handlePlayPause}>
            <Icon
              path={playPauseIcon}
              title="Play Pause"
              size={1}
              color="black"
            />
          </button>
          <button id="reset" onClick={handleReset}>
            <Icon
              path={mdiSkipPreviousCircle}
              title="Play"
              size={1}
              color="black"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
