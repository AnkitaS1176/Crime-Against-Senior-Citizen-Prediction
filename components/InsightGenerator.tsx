import React, { useState, useCallback } from 'react';
import { generateInsights } from '../services/geminiService';
import type { CrimeRecord } from '../types';
import { SparklesIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface InsightGeneratorProps {
  allCrimeData: CrimeRecord[];
  states: string[];
}

export const InsightGenerator: React.FC<InsightGeneratorProps> = ({ allCrimeData, states }) => {
  const [selectedState, setSelectedState] = useState<string>(states[0] || '');
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(null);

  // FIX: Explicitly convert values to numbers during sorting to avoid arithmetic
  // errors when TypeScript fails to infer the correct type.
  const years = [...new Set(allCrimeData.map(d => d.year))].sort((a, b) => Number(b) - Number(a));

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);

    const relevantData = allCrimeData.filter(d => d.state === selectedState && d.year <= selectedYear);
    if (relevantData.length === 0) {
      setError(`No data available for ${selectedState} up to ${selectedYear}.`);
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateInsights(selectedState, selectedYear, relevantData);
      setInsights(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedState, selectedYear, allCrimeData]);
  
  const formatInsights = (text: string) => {
    return text
      .split('\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('* **')) {
          return <p key={index} className="mt-2 text-gray-700">{paragraph.replace(/\* \*\*/g, '').replace(/\*\*/g, '')}</p>;
        }
        if (paragraph.startsWith('**')) {
          return <h4 key={index} className="text-md font-semibold text-gray-800 mt-4">{paragraph.replace(/\*\*/g, '')}</h4>;
        }
        if (paragraph.startsWith('*')) {
          return <li key={index} className="ml-5 list-disc text-gray-600">{paragraph.substring(1).trim()}</li>;
        }
        return <p key={index} className="mt-2 text-gray-600">{paragraph}</p>;
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <DocumentMagnifyingGlassIcon className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">AI-Powered Research Assistant</h2>
      </div>
      <p className="text-gray-600 mb-6">Select a state and year to generate an analysis of crime trends, potential contributing factors, and data-driven predictions using the Gemini API.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700">State</label>
          <select id="state-select" value={selectedState} onChange={e => setSelectedState(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-700">Year</label>
          <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5 mr-2" />
              Generate Insights
            </>
          )}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      
      {insights && (
        <div className="mt-6 p-4 border-t border-gray-200">
           <h3 className="text-xl font-semibold text-gray-800 mb-2">Generated Analysis</h3>
           <div className="prose prose-sm max-w-none">
            {formatInsights(insights)}
           </div>
        </div>
      )}
    </div>
  );
};