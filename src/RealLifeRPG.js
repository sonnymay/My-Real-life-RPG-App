import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Plus,
  CheckCircle,
  ArrowRight,
  Trash2,
  X,
  Save,
  Clock,
} from "lucide-react";

const RealLifeRPG = () => {
  // Load saved data from localStorage or use defaults
  const loadSavedData = () => {
    try {
      // Clear existing localStorage for a fresh start (you can remove this line later)
      localStorage.removeItem("realLifeRPGData");

      const savedData = localStorage.getItem("realLifeRPGData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Override timer values to ensure we start at 0
        return {
          ...parsedData,
          totalTimeTrackedSeconds: 0,
          dailyTrackedMinutes: 0,
          levelsGained: 0,
        };
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }

    // Default data if nothing is saved
    return {
      level: 1, // Changed from 5 to 1
      exp: 0, // Changed from 23 to 0
      jobClass: "Swordsman",
      job: "Novice",
      totalTimeTrackedSeconds: 0, // Starting at 00:00:00
      dailyGoalMinutes: 180, // 3 hours
      dailyTrackedMinutes: 0, // Starting at 0 minutes
      levelsGained: 0,
      taskList: [
        { id: 1, name: "Complete project proposal", completed: false },
        { id: 2, name: "Exercise for 30 minutes", completed: true },
        { id: 3, name: "Read 20 pages", completed: false },
        { id: 4, name: "Learn React hooks", completed: false },
      ],
    };
  };

  const savedData = loadSavedData();

  // State management
  const [level, setLevel] = useState(savedData.level);
  const [exp, setExp] = useState(savedData.exp);
  const [jobClass, setJobClass] = useState(savedData.jobClass);
  const [job, setJob] = useState(savedData.job);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [taskList, setTaskList] = useState(savedData.taskList);
  const [newTaskName, setNewTaskName] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // Current session time
  const [totalTimeTrackedSeconds, setTotalTimeTrackedSeconds] = useState(
    savedData.totalTimeTrackedSeconds
  );
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(
    savedData.dailyGoalMinutes
  );
  const [dailyTrackedMinutes, setDailyTrackedMinutes] = useState(
    savedData.dailyTrackedMinutes
  );
  const [levelsGained, setLevelsGained] = useState(savedData.levelsGained);

  // References for timer
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Reset confirmation
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Progress percentage to next level
  const expToLevel = 100;
  const expPercentage = (exp / expToLevel) * 100;

  // Save data to localStorage
  const saveData = () => {
    try {
      const dataToSave = {
        level,
        exp,
        jobClass,
        job,
        totalTimeTrackedSeconds,
        dailyGoalMinutes,
        dailyTrackedMinutes,
        levelsGained,
        taskList,
      };
      localStorage.setItem("realLifeRPGData", JSON.stringify(dataToSave));
      // Show save notification (in a real app)
      console.log("Game progress saved!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Reset progress for a new day (would typically be automatic)
  const resetDailyProgress = () => {
    setDailyTrackedMinutes(0);
    setLevelsGained(0);
    saveData();
  };

  // Format time for display
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // Get time display based on timer state
  const getTimeDisplay = () => {
    if (isTimerRunning) {
      // Show current session + total time when running
      const totalSeconds = totalTimeTrackedSeconds + elapsedSeconds;
      return formatTime(totalSeconds);
    } else {
      // Show just total time when paused
      return formatTime(totalTimeTrackedSeconds);
    }
  };

  // Timer effect - completely rewritten for reliability
  useEffect(() => {
    if (isTimerRunning) {
      // Record the start time of this session
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        // Calculate current session time
        const sessionTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        // Update elapsed seconds for this session
        setElapsedSeconds(sessionTime);

        // Check for minute increments (every 60 seconds)
        if (sessionTime > 0 && sessionTime % 60 === 0) {
          // Update daily tracked minutes
          setDailyTrackedMinutes((prev) => prev + 1);

          // Add exp every minute (20 exp per minute = 100 exp per 5 minutes)
          setExp((prevExp) => {
            const newExp = prevExp + 20;
            if (newExp >= expToLevel) {
              // If exp reaches the threshold, reset it and level up
              gainLevel();
              return newExp - expToLevel; // Carry over excess exp
            }
            return newExp;
          });

          // Check for level gain (every 5 minutes = 300 seconds)
          if (sessionTime % 300 === 0) {
            gainLevel();
          }
        }
      }, 1000);
    } else {
      // Just clear the timer interval - we'll update totalTime in toggleTimer
      clearInterval(timerRef.current);
    }

    // Cleanup on unmount
    return () => {
      clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Function to gain a level
  const gainLevel = () => {
    // Increment level
    setLevel((prevLevel) => prevLevel + 1);

    // Increment levels gained today
    setLevelsGained((prev) => prev + 1);

    // Check if job should change based on new level
    const newLevel = level + 1;
    updateJobBasedOnLevel(newLevel, jobClass);

    // Play a sound or animation here in a full implementation
    console.log("Level up!");
  };

  // Get the base class color scheme
  const getClassColorScheme = () => {
    switch (jobClass) {
      case "Swordsman":
        return {
          badge: "bg-red-100 text-red-800",
          progress: "bg-red-600",
          next: "bg-red-500",
          character: "bg-red-500",
        };
      case "Archer":
        return {
          badge: "bg-green-100 text-green-800",
          progress: "bg-green-600",
          next: "bg-green-500",
          character: "bg-green-500",
        };
      case "Mage":
        return {
          badge: "bg-purple-100 text-purple-800",
          progress: "bg-purple-600",
          next: "bg-purple-500",
          character: "bg-purple-500",
        };
      case "Thief":
        return {
          badge: "bg-gray-100 text-gray-800",
          progress: "bg-gray-600",
          next: "bg-gray-500",
          character: "bg-gray-500",
        };
      case "Acolyte":
        return {
          badge: "bg-yellow-100 text-yellow-800",
          progress: "bg-yellow-600",
          next: "bg-yellow-500",
          character: "bg-yellow-500",
        };
      case "Merchant":
        return {
          badge: "bg-amber-100 text-amber-800",
          progress: "bg-amber-600",
          next: "bg-amber-500",
          character: "bg-amber-500",
        };
      default:
        return {
          badge: "bg-blue-100 text-blue-800",
          progress: "bg-blue-600",
          next: "bg-blue-500",
          character: "bg-blue-500",
        };
    }
  };

  const colors = getClassColorScheme();

  // Calculate next job threshold based on class
  const getNextJobInfo = () => {
    // Define job progressions for different classes
    const jobProgressions = {
      Swordsman: [
        { level: 11, job: "Swordsman" },
        { level: 31, job: "Knight" },
        { level: 51, job: "Lord Knight" },
        { level: 71, job: "Rune Knight" },
        { level: 91, job: "Eternal Knight" },
        { level: 100, job: "Max Level" },
      ],
      Archer: [
        { level: 11, job: "Archer" },
        { level: 31, job: "Hunter" },
        { level: 51, job: "Sniper" },
        { level: 71, job: "Falcon Ranger" },
        { level: 91, job: "Eternal Marksman" },
        { level: 100, job: "Max Level" },
      ],
      Mage: [
        { level: 11, job: "Mage" },
        { level: 31, job: "Wizard" },
        { level: 51, job: "High Wizard" },
        { level: 71, job: "Archmage" },
        { level: 91, job: "Eternal Sorcerer" },
        { level: 100, job: "Max Level" },
      ],
      Thief: [
        { level: 11, job: "Thief" },
        { level: 31, job: "Assassin" },
        { level: 51, job: "Guillotine Cross" },
        { level: 71, job: "Shadow Reaper" },
        { level: 91, job: "Eternal Phantom" },
        { level: 100, job: "Max Level" },
      ],
      Acolyte: [
        { level: 11, job: "Acolyte" },
        { level: 31, job: "Priest" },
        { level: 51, job: "High Priest" },
        { level: 71, job: "Divine Cleric" },
        { level: 91, job: "Eternal Saint" },
        { level: 100, job: "Max Level" },
      ],
      Merchant: [
        { level: 11, job: "Merchant" },
        { level: 31, job: "Blacksmith" },
        { level: 51, job: "Whitesmith" },
        { level: 71, job: "Titan Forgemaster" },
        { level: 91, job: "Eternal Tycoon" },
        { level: 100, job: "Max Level" },
      ],
    };

    // Get the progression for the current class
    const progression = jobProgressions[jobClass] || jobProgressions.Swordsman;

    // Find the next job in the progression
    for (const jobInfo of progression) {
      if (level < jobInfo.level) {
        return jobInfo;
      }
    }

    // If at max level
    return progression[progression.length - 1];
  };

  const nextJobInfo = getNextJobInfo();

  // Calculate progress to next job
  const jobProgressPercentage = (level / nextJobInfo.level) * 100;

  // Handle class selection
  const selectClass = (className) => {
    setJobClass(className);
    // Reset job if needed based on level
    updateJobBasedOnLevel(level, className);
    setShowClassSelector(false);
  };

  // Update job title based on level and selected class
  const updateJobBasedOnLevel = (currentLevel, selectedClass) => {
    const jobProgressions = {
      Swordsman: [
        { level: 1, job: "Novice" },
        { level: 11, job: "Swordsman" },
        { level: 31, job: "Knight" },
        { level: 51, job: "Lord Knight" },
        { level: 71, job: "Rune Knight" },
        { level: 91, job: "Eternal Knight" },
      ],
      Archer: [
        { level: 1, job: "Novice" },
        { level: 11, job: "Archer" },
        { level: 31, job: "Hunter" },
        { level: 51, job: "Sniper" },
        { level: 71, job: "Falcon Ranger" },
        { level: 91, job: "Eternal Marksman" },
      ],
      Mage: [
        { level: 1, job: "Novice" },
        { level: 11, job: "Mage" },
        { level: 31, job: "Wizard" },
        { level: 51, job: "High Wizard" },
        { level: 71, job: "Archmage" },
        { level: 91, job: "Eternal Sorcerer" },
      ],
      Thief: [
        { level: 1, job: "Novice" },
        { level: 11, job: "Thief" },
        { level: 31, job: "Assassin" },
        { level: 51, job: "Guillotine Cross" },
        { level: 71, job: "Shadow Reaper" },
        { level: 91, job: "Eternal Phantom" },
      ],
      Acolyte: [
        { level: 1, job: "Novice" },
        { level: 11, job: "Acolyte" },
        { level: 31, job: "Priest" },
        { level: 51, job: "High Priest" },
        { level: 71, job: "Divine Cleric" },
        { level: 91, job: "Eternal Saint" },
      ],
      Merchant: [
        { level: 1, job: "Novice" },
        { level: 11, job: "Merchant" },
        { level: 31, job: "Blacksmith" },
        { level: 51, job: "Whitesmith" },
        { level: 71, job: "Titan Forgemaster" },
        { level: 91, job: "Eternal Tycoon" },
      ],
    };

    // Get the progression for the selected class
    const progression =
      jobProgressions[selectedClass] || jobProgressions.Swordsman;

    // Find the current job based on level
    let currentJob = progression[0].job;
    for (let i = progression.length - 1; i >= 0; i--) {
      if (currentLevel >= progression[i].level) {
        currentJob = progression[i].job;
        break;
      }
    }

    setJob(currentJob);
  };

  const toggleTimer = () => {
    // If we're stopping the timer
    if (isTimerRunning) {
      // Add current session time to total time
      setTotalTimeTrackedSeconds((prev) => prev + elapsedSeconds);

      // Save progress
      setTimeout(() => saveData(), 100);
    } else {
      // Starting the timer, reset session time
      setElapsedSeconds(0);
    }

    // Toggle timer state
    setIsTimerRunning(!isTimerRunning);
  };

  // Reset timer functionality
  const resetTimer = () => {
    // Stop timer if running
    if (isTimerRunning) {
      setIsTimerRunning(false);
    }

    // Reset all timer values
    setTotalTimeTrackedSeconds(0);
    setElapsedSeconds(0);
    setDailyTrackedMinutes(0);
    setLevelsGained(0);

    // Save the reset state
    setTimeout(() => saveData(), 100);

    // Hide confirmation
    setShowResetConfirm(false);
  };

  const toggleTaskCompletion = (id) => {
    setTaskList(
      taskList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    // Save task state
    setTimeout(saveData, 100);
  };

  const deleteTask = (id) => {
    setTaskList(taskList.filter((task) => task.id !== id));
    // Save task state
    setTimeout(saveData, 100);
  };

  const addNewTask = () => {
    if (newTaskName.trim() === "") return;

    const newTask = {
      id: Date.now(), // Unique ID based on timestamp
      name: newTaskName,
      completed: false,
    };

    setTaskList([...taskList, newTask]);
    setNewTaskName("");
    setShowAddTask(false);

    // Save task state
    setTimeout(saveData, 100);
  };

  // Calculate daily progress percentage
  const dailyProgressPercentage = Math.min(
    (dailyTrackedMinutes / dailyGoalMinutes) * 100,
    100
  );

  return (
    <div className="font-sans p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-md">
      {/* Header with Save Button */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Real-Life RPG</h1>
        <div className="flex gap-2">
          <button
            onClick={saveData}
            className="flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md"
          >
            <Save size={14} className="mr-1" /> Save
          </button>
          <button
            onClick={resetDailyProgress}
            className="flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md"
          >
            <Clock size={14} className="mr-1" /> Reset Day
          </button>
        </div>
      </div>

      {/* Character Info & Class Selector */}
      <div className="bg-white p-4 rounded-lg mb-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Your Character</h2>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowClassSelector(!showClassSelector)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Change Class
            </button>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}
            >
              {job}
            </div>
          </div>
        </div>

        {/* Class Selector Dropdown */}
        {showClassSelector && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium mb-2">Select Job Class:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => selectClass("Swordsman")}
                className={`p-2 rounded-md text-xs text-center ${
                  jobClass === "Swordsman"
                    ? "bg-red-100 text-red-800 font-bold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Swordsman
              </button>
              <button
                onClick={() => selectClass("Archer")}
                className={`p-2 rounded-md text-xs text-center ${
                  jobClass === "Archer"
                    ? "bg-green-100 text-green-800 font-bold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Archer
              </button>
              <button
                onClick={() => selectClass("Mage")}
                className={`p-2 rounded-md text-xs text-center ${
                  jobClass === "Mage"
                    ? "bg-purple-100 text-purple-800 font-bold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Mage
              </button>
              <button
                onClick={() => selectClass("Thief")}
                className={`p-2 rounded-md text-xs text-center ${
                  jobClass === "Thief"
                    ? "bg-gray-100 text-gray-800 font-bold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Thief
              </button>
              <button
                onClick={() => selectClass("Acolyte")}
                className={`p-2 rounded-md text-xs text-center ${
                  jobClass === "Acolyte"
                    ? "bg-yellow-100 text-yellow-800 font-bold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Acolyte
              </button>
              <button
                onClick={() => selectClass("Merchant")}
                className={`p-2 rounded-md text-xs text-center ${
                  jobClass === "Merchant"
                    ? "bg-amber-100 text-amber-800 font-bold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Merchant
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Level {level}</span>
            <span className="text-sm font-medium">
              {exp}/{expToLevel} EXP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${colors.progress}`}
              style={{ width: `${expPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">
              Next Job: {nextJobInfo.job}
            </span>
            <span className="text-sm font-medium">
              Level {level}/{nextJobInfo.level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${colors.next}`}
              style={{ width: `${jobProgressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span>Novice</span>
            <span>{jobClass === "Novice" ? "Novice" : jobClass}</span>
            <span>
              {jobClass === "Swordsman"
                ? "Knight"
                : jobClass === "Archer"
                ? "Hunter"
                : jobClass === "Mage"
                ? "Wizard"
                : jobClass === "Thief"
                ? "Assassin"
                : jobClass === "Acolyte"
                ? "Priest"
                : jobClass === "Merchant"
                ? "Blacksmith"
                : ""}
            </span>
            <span>
              {jobClass === "Swordsman"
                ? "Lord Knight"
                : jobClass === "Archer"
                ? "Sniper"
                : jobClass === "Mage"
                ? "High Wizard"
                : jobClass === "Thief"
                ? "Guillotine Cross"
                : jobClass === "Acolyte"
                ? "High Priest"
                : jobClass === "Merchant"
                ? "Whitesmith"
                : ""}
            </span>
            <span>
              {jobClass === "Swordsman"
                ? "Rune Knight"
                : jobClass === "Archer"
                ? "Falcon Ranger"
                : jobClass === "Mage"
                ? "Archmage"
                : jobClass === "Thief"
                ? "Shadow Reaper"
                : jobClass === "Acolyte"
                ? "Divine Cleric"
                : jobClass === "Merchant"
                ? "Titan Forgemaster"
                : ""}
            </span>
            <span>
              {jobClass === "Swordsman"
                ? "Eternal Knight"
                : jobClass === "Archer"
                ? "Eternal Marksman"
                : jobClass === "Mage"
                ? "Eternal Sorcerer"
                : jobClass === "Thief"
                ? "Eternal Phantom"
                : jobClass === "Acolyte"
                ? "Eternal Saint"
                : jobClass === "Merchant"
                ? "Eternal Tycoon"
                : ""}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div
              className={`h-1 rounded-l-full bg-gray-500`}
              style={{ width: `${(level / 100) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-gray-400 mt-1">
            <span>1</span>
            <span>11</span>
            <span>31</span>
            <span>51</span>
            <span>71</span>
            <span>91</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Character Scene - Simplified */}
      <div className="w-full h-64 bg-gradient-to-b from-orange-200 via-red-200 to-purple-300 rounded-lg mb-4 relative overflow-hidden">
        {/* Dark Floor */}
        <div className="absolute bottom-0 w-full h-16 bg-gray-800"></div>

        {/* Character Image - Full Size */}
        <div className="absolute inset-0 flex justify-center items-end">
          <img
            src={`/images/characters/${job
              .toLowerCase()
              .replace(" ", "-")}.png`}
            alt={job}
            className="h-56 max-w-full object-contain mb-16"
          />
        </div>

        {/* Class Icon - Keep it */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full">
          {jobClass === "Swordsman" && (
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
          )}
          {jobClass === "Archer" && (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          )}
          {jobClass === "Mage" && (
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
          )}
          {jobClass === "Thief" && (
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
              T
            </div>
          )}
          {jobClass === "Acolyte" && (
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          )}
          {jobClass === "Merchant" && (
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
          )}
        </div>

        {/* Level Display */}
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 px-2 py-1 rounded-md text-sm font-bold">
          LVL {level}
        </div>
      </div>

      {/* Timer - THE CORE LEVELING MECHANISM */}
      <div className="bg-white p-4 rounded-lg mb-4 shadow border-2 border-green-300">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Training Session</h2>
          <div className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
            LEVEL SOURCE
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{getTimeDisplay()}</div>
            <div className="text-sm text-gray-500 font-bold">
              {levelsGained} levels gained today
            </div>
            <div className="text-sm bg-green-100 text-green-800 px-2 py-1 mt-1 rounded-md">
              5 minutes = 1 level
            </div>
            {/* Reset Timer Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-red-600 hover:text-red-800 mt-2"
            >
              Reset Timer
            </button>
          </div>
          <button
            onClick={toggleTimer}
            className={`p-4 rounded-full ${
              isTimerRunning
                ? "bg-red-100 text-red-500"
                : "bg-green-500 text-white"
            }`}
          >
            {isTimerRunning ? <Pause size={28} /> : <Play size={28} />}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Daily Progress</span>
            <span>
              {Math.floor(dailyTrackedMinutes / 60)}h {dailyTrackedMinutes % 60}
              m / {Math.floor(dailyGoalMinutes / 60)}h goal (
              {Math.floor(dailyTrackedMinutes / 5)} levels)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${dailyProgressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-3">
            <div>
              Level Progress:
              <span className="font-medium text-green-600">
                {" "}
                5 mins = 1 level
              </span>
            </div>
            <div>
              Current pace:
              <span className="font-medium text-green-600">
                {" "}
                12 levels/hour
              </span>
            </div>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold mb-2">Reset Timer?</h3>
              <p className="text-gray-600 mb-4">
                This will reset your timer to 00:00:00. Your progress for today
                will be lost. Are you sure?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={resetTimer}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-semibold">Quests / To-Do List</h2>
            <div className="text-xs text-gray-500 mt-1">
              {taskList.filter((task) => task.completed).length}/
              {taskList.length} completed
            </div>
          </div>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="text-blue-500 flex items-center text-sm"
          >
            {showAddTask ? (
              <X size={16} className="mr-1" />
            ) : (
              <Plus size={16} className="mr-1" />
            )}
            {showAddTask ? "Cancel" : "Add Task"}
          </button>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter new task..."
              className="w-full p-2 rounded border border-blue-200 mb-2"
            />
            <button
              onClick={addNewTask}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
              disabled={newTaskName.trim() === ""}
            >
              Add Quest
            </button>
          </div>
        )}

        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
          <strong>Note:</strong> Tasks don't affect leveling. Only running the
          timer counts toward levels (5 mins = 1 level).
        </div>

        <ul className="space-y-2">
          {/* Sort the tasks - incomplete tasks first, then completed tasks */}
          {[...taskList]
            .sort((a, b) => {
              // Sort by completion status (incomplete first)
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
              }
              // Keep original order within each group
              return 0;
            })
            .map((task) => (
              <li
                key={task.id}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  task.completed ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <span
                  className={task.completed ? "line-through text-gray-500" : ""}
                >
                  {task.name}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`p-1 rounded-full ${
                      task.completed ? "text-green-500" : "text-gray-400"
                    } hover:bg-gray-100`}
                    title="Mark as complete"
                  >
                    <CheckCircle
                      size={20}
                      className={task.completed ? "fill-green-500" : ""}
                    />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 rounded-full text-red-400 hover:bg-gray-100"
                    title="Delete task"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
        </ul>

        {taskList.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No quests yet. Add your first quest!
          </div>
        )}

        {taskList.length > 0 && (
          <div className="mt-4 text-center">
            <button className="text-blue-600 text-sm flex items-center mx-auto">
              See all quests <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealLifeRPG;
