import React, { useState } from 'react';

export const FilterSidebar = () => {
  const [maxVram, setMaxVram] = useState(40);
  const [quantization, setQuantization] = useState<string>('all');
  const [sortBy, setSortBy] = useState('fitScore');

  const handleApplyFilters = () => {
    // In a real implementation, this would update the query parameters
    console.log('Applying filters:', { maxVram, quantization, sortBy });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Max VRAM: {maxVram}GB
        </label>
        <input
          type="range"
          min="5"
          max="40"
          value={maxVram}
          onChange={(e) => setMaxVram(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>5GB</span>
          <span>40GB</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Quantization</label>
        <select
          value={quantization}
          onChange={(e) => setQuantization(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="Q4_K_M">Q4_K_M</option>
          <option value="Q8_0">Q8_0</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
        >
          <option value="fitScore">Fit Score</option>
          <option value="weeklyPulls">Weekly Pulls</option>
          <option value="vramUsage">VRAM Usage</option>
        </select>
      </div>

      <button
        onClick={handleApplyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
};