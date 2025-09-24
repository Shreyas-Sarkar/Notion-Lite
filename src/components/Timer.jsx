import { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [time, setTime] = useState(studyDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('study'); 

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {

      if (sessionType === 'study') {
        setTime(breakDuration * 60);
        setSessionType('break');
      } else {
        setTime(studyDuration * 60);
        setSessionType('study');
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, sessionType]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(studyDuration * 60);
    setSessionType('study');
  };

  return (
    <div className="timer-section">
      <h3>Study Timer</h3>
      <div className="timer-settings">
        <div className="duration-input">
          <label>Study Duration (min):</label>
          <input
            type="number"
            min="1"
            max="60"
            value={studyDuration}
            onChange={(e) => {
              const value = Math.min(60, Math.max(1, parseInt(e.target.value) || 1));
              setStudyDuration(value);
              if (sessionType === 'study' && !isRunning) {
                setTime(value * 60);
              }
            }}
            disabled={isRunning}
          />
        </div>
        <div className="duration-input">
          <label>Break Duration (min):</label>
          <input
            type="number"
            min="1"
            max="30"
            value={breakDuration}
            onChange={(e) => {
              const value = Math.min(30, Math.max(1, parseInt(e.target.value) || 1));
              setBreakDuration(value);
              if (sessionType === 'break' && !isRunning) {
                setTime(value * 60);
              }
            }}
            disabled={isRunning}
          />
        </div>
      </div>
      <div className="timer-display">
        <div className="session-type">{sessionType === 'study' ? '📚 Study Session' : '☕ Break Time'}</div>
        <div className="time-remaining">{formatTime(time)}</div>
      </div>
      <div className="timer-controls">
        <button 
          className={`timer-button ${isRunning ? 'pause' : 'start'}`}
          onClick={handleStartPause}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button 
          className="timer-button reset"
          onClick={handleReset}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
