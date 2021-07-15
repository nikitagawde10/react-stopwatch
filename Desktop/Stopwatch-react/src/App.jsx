import React, { useState, useEffect } from 'react'
import './App.css'
import './Fonts/MyFont-UltraLight.otf'
function getFormattedTime(passedTimeInMilliseconds) {
  const totalSeconds = passedTimeInMilliseconds / 1000;
  const [minutes, seconds, centiSeconds] = [
    totalSeconds / 60,
    totalSeconds % 60,
    (passedTimeInMilliseconds % 1000) / 10,
  ].map((total) => Math.floor(total).toString().padStart(2, '0'));

  return `${minutes} : ${seconds} . ${centiSeconds}`;
}

let startTime = 0
let totalLapTime = 0
const START_TEXT = "Start";
const RESET_TEXT = "Reset";
const STOP_TEXT = "Stop";
const LAP_TEXT = "Lap";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([])
  const [totalLapDuration, setTotalLapDuration] = useState(0)
  const [minLap, setMinLap] = useState({
    lapIndex: 0,
    timeStamp: Number.MAX_VALUE
  })
  const [maxLap, setMaxLap] = useState({
    lapIndex: 0,
    timeStamp: Number.MIN_VALUE
  })
  //everytime isActive (state/ property) changes it's going to call whatever is written in useEffect

  useEffect(() => {
    if (isRunning) {
      startTimer();
      const intervalID = setInterval(() =>
        setElapsedTime(Date.now() - startTime + elapsedTime, 50)
      );
      return () => clearInterval(intervalID);
    }
  }, [isRunning]);

  useEffect(() => {
    if (elapsedTime > 0 && isRunning) {
      setTotalLapDuration(totalLapDuration + elapsedTime)
      const currentLap = laps[0] ?? { lapIndex: laps.length + 1 }
      const updatedLap = { ...currentLap, timeStamp: elapsedTime - totalLapTime }
      setLaps([
        updatedLap,
        ...laps.slice(1)
      ])
    }
  }, [elapsedTime])


  function handleLap() {
    console.log("Laps clicked")
    // function createLaps() {
    //   setIsRunning(true)
    //   setLaps(prevLapArray => [laps, ...prevLapArray])
    //   previousTimeStamp = elapsedTime
    // }

    // const addLap = () => {
    //   const previousLap = {
    //     ...laps[0] ?? {
    //       lapIndex: 1
    //     },
    //     timeStamp: elapsedTime - totalLapTime

    //   }
    //   const newLap = () => {
    //     lapIndex: laps.length + 1;
    //     timeStamp: 0
    //   }

    //   setTotalLapTime(totalLapTime - previousLap.timeStamp)
    //   setLaps([
    //     newLap,
    //     previousLap,
    //     ...laps.slice(1)
    //   ])

    //   if (previousLap.timeStamp < minLap.timeStamp) {
    //     setMinLap(previousLap)
    //   }
    //   if (previousLap.timeStamp > maxLap.timeStamp) {
    //     setMaxLap(previousLap)
    //   }
    // }

  }

  const handleStartStop = () => {
    isRunning ? stopTimer() : startTimer();
  };

  const startTimer = () => {
    setIsRunning(true);
    startTime = Date.now();
  }

  const stopTimer = () => {
    setIsRunning(false);
  }

  const handleLapOrReset = () => {
    isRunning ? handleLap() : handleReset();
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  let lapResetTextHandler = isRunning ? LAP_TEXT : RESET_TEXT;
  let isButtonDisabled = !isRunning && elapsedTime === 0;
  let startStopTexthandler = isRunning ? STOP_TEXT : START_TEXT;
  let primaryButtonColor = isRunning ? 'red' : 'green'
  return (
    <div className="main__container">
      <div id='display__timer_container'> {getFormattedTime(elapsedTime)}</div>
      <div className="button__container">
        <button onClick={handleLapOrReset} disabled={isButtonDisabled} id="secondary__button" className="button__round">
          {lapResetTextHandler}
        </button>
        <button onClick={handleStartStop} id="primary__button" className={`button__round primary__button_style ${primaryButtonColor}`}>
          {toggleTimer}
          {startStopTexthandler}
        </button>
      </div>
      <div id="display__laps_container">
        <ul className="laps__table">
          {laps.map(lap => {
            return <li key={lap.lapIndex} className="table__item-row" >
              <span className="item__row-index">Lap {lap.lapIndex}</span><span className="item__row-timestamp"> {getFormattedTime(lap.timeStamp)}</span>
            </li> 
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
