import React, { useState } from 'react';

interface Model {
  id: string;
  slug: string;
  name: string;
  tag: string;
  paramsBillions: number;
  quantization: string;
  estimatedVramGb: number;
  weeklyPulls: number;
  fitScore: number;
  pullCommand: string;
  lastScrapedAt: Date;
  createdAt: Date;
}

export const ModelCard = ({ model }: { model: Model }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(model.pullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate VRAM bar color based on usage
  const vramPercentage = Math.min(100, (model.estimatedVramGb / 40) * 100);
  let vramBarColor = 'bg-green-500';
  if (vramPercentage > 80) {
    vramBarColor = 'bg-red-500';
  } else if (vramPercentage > 60) {
    vramBarColor = 'bg-yellow-500';
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{model.name}</h3>
          <p className="text-sm text-gray-400">{model.tag}</p>
        </div>
        <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">
          {model.paramsBillions}B params
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>VRAM Usage</span>
          <span>{model.estimatedVramGb.toFixed(1)}GB / 40GB</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${vramBarColor}`}
            style={{ width: `${vramPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-400">Weekly pulls:</span>{' '}
          <span className="font-mono">{model.weeklyPulls.toLocaleString()}</span>
        </div>
        <span className="bg-purple-900 text-purple-200 text-xs px-2 py-1 rounded">
          Score: {model.fitScore}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleCopy}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy Pull Command'}
        </button>
        <span className="text-xs text-gray-500">
          {new Date(model.lastScrapedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-3 p-2 bg-gray-900 rounded text-sm font-mono break-all">
        {model.pullCommand}
      </div>
    </div>
  );
};