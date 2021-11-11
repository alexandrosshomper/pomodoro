import "./App.css";
import {
  mdiPlusCircleOutline,
  mdiMinusCircleOutline,
  mdiPlayCircle,
  mdiPauseCircle,
  mdiSkipPreviousCircle,
} from "@mdi/js";
import Icon from "@mdi/react";
import { React, useState, useEffect, useRef } from "react";
const audioSrc =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

function App() {
  //Initials
  const initBreakLength = 5 * 60;
  const initSessionLength = 25 * 60;
  const initDisplay = 25 * 60;
  const initTimerOn = false;
  const initOnBreak = false;
  //States
  const [breakLength, setBreakLength] = useState(initBreakLength);
  const [sessionLength, setSessionLength] = useState(initSessionLength);
  const [display, setDisplay] = useState(initDisplay);
  const [timerOn, setTimerOn] = useState(initTimerOn);
  const [onBreak, setOnBreak] = useState(initOnBreak);

  let player = useRef(null);

  useEffect(() => {
    if (display <= 0) {
      setOnBreak(true);
      breakSound();
    } else if (!timerOn && display === breakLength) {
      setOnBreak(false);
    }
  }, [display, onBreak, timerOn, breakLength, sessionLength]);

  const breakSound = () => {
    player.currentTime = 0;
    player.play();
  };

  const formatDisplayTime = (time) => {
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    return (
      (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs)
    );
  };

  const formatTime = (time) => {
    return time / 60;
  };

  const updateTime = (amount, type) => {
    if (type === "Break") {
      if ((breakLength <= 60 && amount < 0) || breakLength >= 60 * 60) {
        return;
      }
      setBreakLength((prev) => prev + amount);
    } else {
      if ((sessionLength <= 60 && amount < 0) || sessionLength >= 60 * 60) {
        return;
      }
      setSessionLength((prev) => prev + amount);
      if (!timerOn) {
        setDisplay(sessionLength + amount);
      }
    }
  };

  const timeControl = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplay((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              // breakSound();
              onBreakVariable = true;
              return breakLength;
            } else if (prev <= 0 && onBreakVariable) {
              // breakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionLength;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setDisplay(25 * 60);
    setBreakLength(5 * 60);
    setSessionLength(25 * 60);
    player.pause();
    player.currentTime = 0;
    setTimerOn(false);
    setOnBreak(false);
  };

  return (
    <div className="App">
      <h1>freePomodoro</h1>
      <div className="flex">
        <Length
          updateTime={updateTime}
          type={"Break"}
          time={breakLength}
          formatTime={formatTime}
        />
        <Length
          updateTime={updateTime}
          type={"Session"}
          time={sessionLength}
          formatTime={formatTime}
        />
      </div>
      <div className="clock-container">
        <h1 id="timer-label">{onBreak ? "Break" : "Session"}</h1>
        <span id="time-left">{formatDisplayTime(display)}</span>
        <div className="flex">
          <button id="start_stop" onClick={timeControl}>
            <Icon
              path={timerOn ? mdiPauseCircle : mdiPlayCircle}
              title="Play Pause"
              size={1}
              color="black"
            />
          </button>
          <button id="reset" onClick={resetTime}>
            <Icon
              path={mdiSkipPreviousCircle}
              title="Play"
              size={1}
              color="black"
            />
          </button>
        </div>
      </div>
      <audio ref={(t) => (player = t)} src={audioSrc} id="beep" />
    </div>
  );
}

function Length({ updateTime, type, time, formatTime }) {
  const id = type.toLowerCase();
  return (
    <div className="timer-container">
      <h2 id={id + "-label"}>{type} Length</h2>
      <div className="flex controls">
        <button id={id + "-decrement"} onClick={() => updateTime(-60, type)}>
          <Icon
            path={mdiMinusCircleOutline}
            title="Decrease"
            size={1}
            color="black"
          />
        </button>
        <span id={id + "-length"}>{formatTime(time)}</span>
        <button id={id + "-increment"} onClick={() => updateTime(60, type)}>
          <Icon
            path={mdiPlusCircleOutline}
            title="Decrease"
            size={1}
            color="black"
          />
        </button>
      </div>
    </div>
  );
}

export default App;
