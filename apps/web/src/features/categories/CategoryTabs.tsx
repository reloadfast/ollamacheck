import React from 'react';

export const CategoryTabs = () => {
  // Mock categories data - in a real implementation this would come from API
  const categories = [
    { id: 'code', label: 'Code Agents', active: true },
    { id: 'vision', label: 'Vision', active: false },
    { id: 'nlp', label: 'NLP', active: false },
    { id: 'embeddings', label: 'Embeddings', active: false },
  ];

  return (
    <div className="flex space-x-4 mb-6 border-b border-gray-800 pb-2">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            category.active
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};