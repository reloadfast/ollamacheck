import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { ModelCard } from './ModelCard';

// Define types for our query parameters
interface ModelFilters {
  category?: string;
  sort?: string;
  limit?: number;
  page?: number;
}

export const ModelList = () => {
  const [filters, setFilters] = useState<ModelFilters>({
    category: 'code',
    sort: 'fitScore',
    limit: 20,
    page: 1,
  });

  // Fetch models using TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['models', filters],
    queryFn: () => apiClient.getModels(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading models...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-400">
        Error loading models: {error.message}
      </div>
    );
  }

  const models = data?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
};