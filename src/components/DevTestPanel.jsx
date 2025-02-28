import React, { useState } from 'react';

const DevTestPanel = ({ 
  onSkipMinutes,
  onSetLevel,
  currentLevel,
  currentJob,
  onReset 
}) => {
  const [minutesToSkip, setMinutesToSkip] = useState(5);
  const [levelToSet, setLevelToSet] = useState(10);
  
  return (
    <div className="bg-red-50 p-3 mb-4 border border-red-300 rounded-md">
      <div className="text-red-800 font-bold mb-2 flex justify-between items-center">
        <span>⚙️ Developer Testing Panel</span>
        <span className="text-xs font-normal">Current Job: {currentJob} (Level {currentLevel})</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-xs block mb-1">Skip Minutes:</label>
          <div className="flex">
            <input 
              type="number" 
              value={minutesToSkip} 
              onChange={(e) => setMinutesToSkip(parseInt(e.target.value) || 0)}
              className="w-16 text-sm p-1 border rounded-l" 
            />
            <button 
              onClick={() => onSkipMinutes(minutesToSkip)}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded-r"
            >
              Skip
            </button>
          </div>
        </div>
        
        <div>
          <label className="text-xs block mb-1">Set Level:</label>
          <div className="flex">
            <input 
              type="number" 
              value={levelToSet} 
              onChange={(e) => setLevelToSet(parseInt(e.target.value) || 1)}
              className="w-16 text-sm p-1 border rounded-l" 
            />
            <button 
              onClick={() => onSetLevel(levelToSet)}
              className="bg-purple-500 text-white text-xs px-2 py-1 rounded-r"
            >
              Set
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-1">
        {[1, 11, 31, 51, 71, 91].map(level => (
          <button 
            key={level}
            onClick={() => onSetLevel(level)}
            className="bg-gray-200 hover:bg-gray-300 text-xs py-1 px-2 rounded"
          >
            Level {level}
          </button>
        ))}
      </div>
      
      <button
        onClick={onReset}
        className="w-full mt-2 bg-red-500 text-white text-xs py-1 rounded"
      >
        Reset All Progress
      </button>

      <div className="mt-2 text-xs text-red-600">
        Note: Remove this panel before production!
      </div>
    </div>
  );
};

export default DevTestPanel;
