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
  const [breaklength, setBreaklength] = useState(5);
  const [sessionlength, setSessionlength] = useState(25);
  const [clockCount, setClockCount] = useState(25 * 60);
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
            currentTimer === "Session" ? breaklength * 60 : sessionlength * 60
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
    console.log("Count is: " + count);
    let minutes = Math.floor(count / 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let seconds = count % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    const time = minutes + ":" + seconds;
    return time;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const handleReset = () => {
    setBreaklength(5);
    setSessionlength(25);
    setClockCount(25 * 60);
    setCurrentTimer("Session");
    setIsPlaying(false);
    clearInterval(loop);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  };

  const handleBreakIncrease = () => {
    if (!isPlaying && breaklength < 60) {
      setBreaklength(breaklength + 1);
      if (currentTimer === "Break") {
        setClockCount((breaklength + 1) * 60);
      }
    }
  };
  const handleBreakDecrease = () => {
    if (!isPlaying && breaklength > 1) {
      setBreaklength(breaklength - 1);
      if (currentTimer === "Break") {
        setClockCount((breaklength - 1) * 60);
      }
    }
  };
  const breakProps = {
    title: "Break",
    count: breaklength,
    handleDecrease: handleBreakDecrease,
    handleIncrease: handleBreakIncrease,
  };

  const handleSessionIncrease = () => {
    const oldSessionLength = sessionlength;
    if (!isPlaying && sessionlength < 60) {
      setSessionlength((oldSessionLength) => oldSessionLength + 1);
      if (currentTimer === "Session") {
        setClockCount((oldSessionLength) => (oldSessionLength + 1) * 60);
      }
    }
  };
  const handleSessionDecrease = () => {
    if (!isPlaying && sessionlength > 1) {
      setSessionlength(sessionlength - 1);
      if (currentTimer === "Session") {
        setClockCount((sessionlength - 1) * 60);
      }
    }
  };
  const sessionProps = {
    title: "Session",
    count: sessionlength,
    handleDecrease: handleSessionDecrease,
    handleIncrease: handleSessionIncrease,
  };

  const SetTimer = (props) => {
    const id = props.title.toLowerCase();
    return (
      <div className="timer-container">
        <h2 id={id + "-label"}>{props.title} Length</h2>
        <div className="flex controls">
          <button id={id + "-decrement"} onClick={props.handleDecrease}>
            <Icon
              path={mdiMinusCircleOutline}
              title="Decrease"
              size={1}
              color="black"
            />
          </button>
          <span id={id + "-length"}>{props.count}</span>
          <button id={id + "-increment"} onClick={props.handleIncrease}>
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
