import React, { useState, useEffect } from 'react'
import './App.css'

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
let stopTime = 0
let totalTime = 0
let intervalID
let totalLapTime = 0
const START_TEXT = "Start";
const RESET_TEXT = "Reset";
const STOP_TEXT = "Stop";
const LAP_TEXT = "Lap";

let lapStateObj = {
  lapIndex: 0,
  timeStamp: undefined
};

function App() {
  //pass multiple objects in hooks- research
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0)
  const [lapState, setLapState] = useState([])
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
    if (isActive) {
      startTime = Date.now()
      startTimer()
      console.log("this is start time " + startTime)
      const intervalID = setInterval(() => setCurrentTime((Date.now() - startTime), 50))
      console.log("this is current time " + currentTime)
      return () => clearInterval(intervalID)
    }
    else {
      stopTimer()
    }
  }, [isActive]);

  useEffect(() => {
    if (currentTime > 0 && isActive) {
      setTotalLapDuration(totalLapDuration + currentTime)
      const currentLap = laps[0] //?? { lapIndex: 1 }
      const updatedLap = { ...currentLap, timeStamp: currentTime - totalLapTime }
      setLapState([
        updatedLap,
        ...lapState.slice(1)
      ])
      console.log("this is current lap state " + lapState)
    }
  }, [currentTime])

  function getElapsedTime() {
    return Date.now() - startTime
  }

  function startTimer() {
    setIsActive(true)
    startTime = Date.now()
    // startStopTextHandler()
    // lapResetTextHandler()
    console.log("this is start timer function " + startTime)
  }

  function stopTimer() {
    setIsActive(false)
    stopTime = Date.now()
    clearInterval(intervalID)
    console.log("this is stop time " + stopTime)
    setCurrentTime(currentTime)
    totalTime += getElapsedTime(stopTime);
    console.log("the total time is " + getFormattedTime(Date.now() - (totalTime)))
  }

  function resetTimer() {
    setIsActive(false)
    setCurrentTime(0)
    // setTotalLapTime(0)
    startTime = 0
    setlapState([])
    setMinLap({
      timeStamp: Number.MAX_VALUE,
      lapIndex: 0
    })
    setMaxLap({
      timeStamp: Number.MIN_VALUE,
      lapIndex: 0
    })
  }

  function laps() {

    function createLaps() {
      setIsActive(true)
      lapStateObj = {
        lapIndex: lapState.length + 1,
        timeStamp: (currentTime - previousTimeStamp)
      }
      setLapState(prevLapArray => [lapState, ...prevLapArray])
      previousTimeStamp = currentTime
    }

    const addLap = () => {
      const previousLap = {
        ...lapStateObj[0] ?? {
          lapIndex :1 
        },
        timeStamp: currentTime - totalLapTime

      }
      const newLap = () => {
        lapIndex: lapState.length + 1;
        timeStamp: 0
      }

      setTotalLapTime(totalLapTime - previousLap.timeStamp)
      setLapState([
        newLap,
        previousLap,
        ...lapState.slice(1)
      ])

      if (previousLap.timeStamp < minLap.timeStamp) {
        setMinLap(previousLap)
      }
      if (previousLap.timeStamp > maxLap.timeStamp) {
        setMaxLap(previousLap)
      }
    }

  }
  const toggleTimer = () => {
    console.log("toggle timer clicked. isACTIVE is now " + isActive)
    setIsActive(!isActive)
  }

  // let primary__buttonClicked = isActive ? startTimer : stopTimer
  // let secondary__buttonClicked = (isActive && !startTime) ? createLaps : resetTimer
  let startStopTextHandler = isActive ? STOP_TEXT : START_TEXT
  let lapResetTextHandler = !isActive && currentTime > 0 ? RESET_TEXT : LAP_TEXT
  let isButtonDisabled = !isActive && currentTime === 0
  return (
    <div className="main__container">
      <div id='display__timer_container'> {getFormattedTime(currentTime)}</div>
      <div className='button__container'>
        <button onClick={isActive ? laps : resetTimer} id="secondary__button" className="button__round" disabled={isButtonDisabled}> {lapResetTextHandler} </button>
        <button onClick={toggleTimer} id="primary__button" className="button__round primary__button_style green"> {startStopTextHandler} </button>
      </div>
      <div id="display__laps_container">
        <table className="laps__table">
          <tbody>
            {lapState.map(lap => {
              return <tr key={lap.lapIndex} className="table__item-row" >
                <td className="item__row-index">lap {lap.lapIndex}</td><td className="item__row-timestamp"> {getFormattedTime(lap.timeStamp)}</td>
              </tr> //using key value pairs call getFormattedTime here
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
