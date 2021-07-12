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
function App() {
  //pass multiple objects in hooks- research
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0)
  const [lapState, setLapState] = useState([])

  //everytime isActive (state/ property) changes it's going to call whatever is written in useEffect

  useEffect(() => {
    if (isActive) {
      startTime = Date.now()
      console.log("this is start time " + startTime)
      const intervalID = setInterval(() => setCurrentTime((Date.now() - startTime), 50)) 
      return () => clearInterval(intervalID)
    }
  }, [isActive]);

  function getElapsedTime() {
    return Date.now() - startTime
  }

  function startTimer() {
    setIsActive(true)
    startTime = Date.now()
    startStopTextHandler()
    lapResetTextHandler()
    console.log("this is start timer function " + startTime)
  }

  function stopTimer() {
    setIsActive(false)
    stopTime = Date.now()
    clearInterval(intervalID)
    console.log("this is stop time " + stopTime)
    setCurrentTime(currentTime)
    totalTime += getElapsedTime(stopTime);
    console.log("the total time is " + totalTime)
  }

  function resetTimer() {
    setIsActive(false)
    setCurrentTime(0)
    // setlapState([])
  }

  function createLaps() {
    setIsActive(true)
    let lapState = {
      lapIndex: lapState.length + 1,
      timeStamp: (currentTime - previousTimeStamp)
    }
    setLapState(prevLapArray => [lapState, ...prevLapArray])
    previousTimeStamp = currentTime

  }

  let startStopButtonClicked =  isActive ? startTimer : stopTimer
  let lapResetButtonClicked =  (isActive && !startTime) ? createLaps : resetTimer
  let startStopTextHandler = isActive ? "Pause" : "Start"
  let lapResetTextHandler = isActive ? "Lap" : "Reset"
  return (
    <div className="stopWatchDiv">
      <div id='displayTimerDiv'> {getFormattedTime(currentTime)}</div>
      <div className='buttonsDiv'>
        <button onClick={lapResetButtonClicked} id="lapResetButton" className="buttonStyle"> {lapResetTextHandler} </button>
        <button onClick={() => setIsActive(!isActive)} id="startStopButton" className="buttonStyle startButton green"> {startStopTextHandler} </button>
        {/* <button onClick={() => setIsActive(!isActive) } className="buttonStyle startButton green">{startStopTextHandler}</button> */}

      </div>
      <div id="displayLapDiv">
        <table className="laps">
          {lapState.map(lap => {
            return <tr key={lap.lapIndex}>lap {lap.lapIndex} : {getFormattedTime(lap.timeStamp)}</tr> //using key value pairs call getFormattedTime here
          })}
        </table>
      </div>
    </div>
  )
}

export default App
