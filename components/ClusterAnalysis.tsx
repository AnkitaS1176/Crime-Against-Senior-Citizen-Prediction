import React, { useState, useMemo, useCallback } from 'react';
import type { CrimeRecord, ClusterData } from '../types';
import { generateClusterInsights } from '../services/geminiService';
import { LightBulbIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface ClusterAnalysisProps {
    allCrimeData: CrimeRecord[];
}

const formatInsights = (text: string) => {
    return text
      .split('\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('**')) {
            const cleanText = paragraph.replace(/\*\*/g, '');
             if(cleanText.includes("Archetype:") || cleanText.includes("Summary:") || cleanText.includes("Hypothesis:") || cleanText.includes("Questions:")) {
                return <h4 key={index} className="text-md font-semibold text-gray-800 mt-4">{cleanText}</h4>;
             }
             return <h3 key={index} className="text-lg font-bold text-blue-700 mt-4">{cleanText}</h3>;
        }
        if (paragraph.startsWith('*')) {
          return <li key={index} className="ml-5 list-disc text-gray-600">{paragraph.substring(1).trim()}</li>;
        }
        return <p key={index} className="mt-2 text-gray-600">{paragraph}</p>;
      });
  };

export const ClusterAnalysis: React.FC<ClusterAnalysisProps> = ({ allCrimeData }) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [loadingClusters, setLoadingClusters] = useState<Record<number, boolean>>({});
    const [clusterInsights, setClusterInsights] = useState<Record<number, string | null>>({});
    const [error, setError] = useState<string | null>(null);

    const clusterDataProfiles = useMemo(() => {
        const profiles: Record<number, ClusterData> = {};
        const clusterIds = [...new Set(allCrimeData.map(d => d.cluster_label).filter(c => c !== undefined))] as number[];

        for (const id of clusterIds) {
            const dataInCluster = allCrimeData.filter(d => d.cluster_label === id);
            
            const totalIncidents = dataInCluster.reduce((sum, d) => sum + d.number_of_incidences, 0);
            const totalCrimeRate = dataInCluster.reduce((sum, d) => sum + d.crime_rate_per_lakh_population, 0);
            
            const stateCounts = dataInCluster.reduce((acc, d) => {
                acc[d.state] = (acc[d.state] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const crimeTypeCounts = dataInCluster
                .filter(d => d.crime_head !== 'Total Crimes against Senior Citizen')
                .reduce((acc, d) => {
                    acc[d.crime_head] = (acc[d.crime_head] || 0) + d.number_of_incidences;
                    return acc;
            }, {} as Record<string, number>);

            profiles[id] = {
                avgIncidents: totalIncidents / dataInCluster.length,
                avgCrimeRate: totalCrimeRate / dataInCluster.length,
                // FIX: Explicitly cast values to Number during sort comparison to prevent type errors.
                topStates: Object.entries(stateCounts).sort(([,a],[,b]) => Number(b) - Number(a)).slice(0,3).map(([name]) => name),
                // FIX: Explicitly cast values to Number during sort comparison to prevent type errors.
                topCrimeTypes: Object.entries(crimeTypeCounts).sort(([,a],[,b]) => Number(b) - Number(a)).slice(0,3).map(([name]) => name),
            };
        }
        return profiles;
    }, [allCrimeData]);

    const handleGenerate = useCallback(async (clusterId: number) => {
        setLoadingClusters(prev => ({ ...prev, [clusterId]: true }));
        setError(null);
        
        try {
            const result = await generateClusterInsights(clusterId, clusterDataProfiles[clusterId]);
            setClusterInsights(prev => ({ ...prev, [clusterId]: result }));
        } catch(e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setLoadingClusters(prev => ({ ...prev, [clusterId]: false }));
        }

    }, [clusterDataProfiles]);
    
    const clusterIds = Object.keys(clusterDataProfiles).map(Number).sort((a,b) => a - b);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
                <LightBulbIcon className="h-8 w-8 text-amber-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">AI-Powered Cluster Analysis</h2>
            </div>
             <p className="text-gray-600 mb-6">Uncover the hidden stories in the data. Each cluster represents a different archetype of crime risk against seniors. Generate an AI-driven research brief to understand the unique characteristics and potential socio-economic factors for each group.</p>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {clusterIds.map(id => (
                         <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`${
                                activeTab === id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Cluster {id}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                {clusterIds.map(id => (
                    <div key={id} className={activeTab === id ? 'block' : 'hidden'}>
                        <div className="p-4 bg-gray-50 rounded-lg">
                           <h3 className="font-semibold text-gray-700">Cluster {id} Profile Summary</h3>
                           <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                                <li><strong>Avg. Incidents:</strong> {clusterDataProfiles[id]?.avgIncidents.toFixed(2)}</li>
                                <li><strong>Avg. Crime Rate:</strong> {clusterDataProfiles[id]?.avgCrimeRate.toFixed(2)}</li>
                                <li><strong>Dominant States:</strong> {clusterDataProfiles[id]?.topStates.join(', ') || 'N/A'}</li>
                                <li><strong>Prevalent Crimes:</strong> {clusterDataProfiles[id]?.topCrimeTypes.join(', ') || 'N/A'}</li>
                           </ul>
                        </div>

                        <div className="mt-4 text-center">
                             <button
                                onClick={() => handleGenerate(id)}
                                disabled={loadingClusters[id]}
                                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-300"
                                >
                                {loadingClusters[id] ? (
                                    <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Research Brief...
                                    </>
                                ) : (
                                    <>
                                    <SparklesIcon className="h-5 w-5 mr-2" />
                                    Generate Research Brief for Cluster {id}
                                    </>
                                )}
                                </button>
                        </div>
                        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

                        {clusterInsights[id] && (
                            <div className="mt-6 p-4 border-t border-gray-200">
                                <div className="prose prose-sm max-w-none">
                                    {formatInsights(clusterInsights[id]!)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}