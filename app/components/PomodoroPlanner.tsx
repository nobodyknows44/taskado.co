'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  type: 'main' | 'secondary' | 'additional' | 'mini';
  completed: boolean;
}

const PomodoroPlanner: React.FC = () => {
  const [timerMode, setTimerMode] = useState<'POMODORO' | 'SHORT_BREAK' | 'LONG_BREAK'>('POMODORO');
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exercise, setExercise] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [learned, setLearned] = useState('');
  const [notes, setNotes] = useState('');

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAddTask = (type: Task['type']) => {
    setTasks([...tasks, { id: Date.now(), text: '', type, completed: false }]);
  };

  const handleTaskChange = (id: number, text: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, text } : task));
  };

  const handleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const resetTimer = useCallback(() => {
    switch (timerMode) {
      case 'POMODORO':
        setTime(25 * 60);
        break;
      case 'SHORT_BREAK':
        setTime(5 * 60);
        break;
      case 'LONG_BREAK':
        setTime(15 * 60);
        break;
    }
  }, [timerMode]);

  useEffect(() => {
    resetTimer();
  }, [timerMode, resetTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  return (
    <div className="bg-indigo-800 min-h-screen text-white p-4">
      <div className="max-w-md mx-auto bg-indigo-700 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 rounded ${timerMode === 'POMODORO' ? 'bg-indigo-600' : 'bg-indigo-800'}`}
            onClick={() => setTimerMode('POMODORO')}
          >
            POMODORO
          </button>
          <button
            className={`px-4 py-2 rounded ${timerMode === 'SHORT_BREAK' ? 'bg-indigo-600' : 'bg-indigo-800'}`}
            onClick={() => setTimerMode('SHORT_BREAK')}
          >
            SHORT BREAK
          </button>
          <button
            className={`px-4 py-2 rounded ${timerMode === 'LONG_BREAK' ? 'bg-indigo-600' : 'bg-indigo-800'}`}
            onClick={() => setTimerMode('LONG_BREAK')}
          >
            LONG BREAK
          </button>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-6xl font-bold">{formatTime(time)}</div>
          <button
            className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-full font-semibold"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">MAIN TASK</h2>
          {tasks.filter(task => task.type === 'main').map(task => (
            <div key={task.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskCompletion(task.id)}
                className="mr-2"
              />
              <input
                type="text"
                value={task.text}
                onChange={(e) => handleTaskChange(task.id, e.target.value)}
                className="flex-grow bg-indigo-600 p-2 rounded"
              />
              <button onClick={() => handleDeleteTask(task.id)} className="ml-2 text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            className="w-full p-2 border border-dashed border-indigo-500 text-left text-indigo-300"
            onClick={() => handleAddTask('main')}
          >
            + Add Task
          </button>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">SECONDARY TASKS</h2>
          {tasks.filter(task => task.type === 'secondary').map(task => (
            <div key={task.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskCompletion(task.id)}
                className="mr-2"
              />
              <input
                type="text"
                value={task.text}
                onChange={(e) => handleTaskChange(task.id, e.target.value)}
                className="flex-grow bg-indigo-600 p-2 rounded"
              />
              <button onClick={() => handleDeleteTask(task.id)} className="ml-2 text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            className="w-full p-2 border border-dashed border-indigo-500 text-left text-indigo-300"
            onClick={() => handleAddTask('secondary')}
          >
            + Add Task
          </button>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">MINI TASKS</h2>
          {tasks.filter(task => task.type === 'mini').map(task => (
            <div key={task.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskCompletion(task.id)}
                className="mr-2"
              />
              <input
                type="text"
                value={task.text}
                onChange={(e) => handleTaskChange(task.id, e.target.value)}
                className="flex-grow bg-indigo-600 p-2 rounded"
              />
              <button onClick={() => handleDeleteTask(task.id)} className="ml-2 text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            className="w-full p-2 border border-dashed border-indigo-500 text-left text-indigo-300"
            onClick={() => handleAddTask('mini')}
          >
            + Add Mini Task
          </button>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">EXERCISE</h2>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full bg-indigo-600 p-2 rounded"
            placeholder="Enter your exercise"
          />
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">THINGS I'M GRATEFUL FOR</h2>
          <textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            className="w-full bg-indigo-600 p-2 rounded"
            rows={3}
            placeholder="Enter things you're grateful for"
          />
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">THINGS I'VE LEARNED</h2>
          <textarea
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
            className="w-full bg-indigo-600 p-2 rounded"
            rows={3}
            placeholder="Enter things you've learned"
          />
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">NOTES</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-indigo-600 p-2 rounded"
            rows={3}
            placeholder="Enter any additional notes"
          />
        </div>

        <div className="flex justify-between text-indigo-400">
          <button><ChevronLeft /></button>
          <button><ChevronRight /></button>
        </div>

        <div className="text-xs text-indigo-400 mt-8 text-center">
          ©2021 — PomoPlanner — Built in NoCode (with Sktch.io) by @ybouane
        </div>
      </div>
    </div>
  );
};

export default PomodoroPlanner;