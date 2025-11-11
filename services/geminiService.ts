import { GoogleGenAI, Type } from "@google/genai";
import type { CrimeRecord, ClusterData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export async function generateInsights(state: string, year: number, data: CrimeRecord[]): Promise<string> {
  if (!ai) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }

  const simplifiedData = data
    .filter(d => d.crime_head === 'Total Crimes against Senior Citizen')
    .map(({ year, number_of_incidences, crime_rate_per_lakh_population }) => ({
      year,
      incidents: number_of_incidences,
      crime_rate: crime_rate_per_lakh_population
    })).sort((a,b) => a.year - b.year);

  const prompt = `
You are an expert data analyst and researcher specializing in criminology in India. Your task is to analyze historical data on crimes against senior citizens and provide actionable insights.

**Analysis Request**
- **Topic**: Crimes against Senior Citizens
- **Region**: ${state}, India
- **Focus Year**: ${year}
- **Historical Data Provided**: A summary of total incidents and crime rate per lakh population for ${state} up to the focus year.

**Data Summary:**
\`\`\`json
${JSON.stringify(simplifiedData, null, 2)}
\`\`\`

**Your Task:**
Based on the provided data, generate a concise research report with the following structure. Use Markdown for formatting.

1.  **Executive Summary**: A brief overview of the crime situation for senior citizens in ${state} as of ${year}.
2.  **Key Trend Analysis**: Analyze the trend of total incidents and crime rate leading up to ${year}. Is it increasing, decreasing, or stable? Point out any significant fluctuations.
3.  **Potential Contributing Factors**: Based on common knowledge of socio-economic factors in India, suggest 2-3 plausible (but hypothetical) factors that could be influencing these trends in ${state}. Preface this section with "Hypothetical factors could include:".
4.  **Data-Driven Prediction for ${year + 1}**: Based purely on the numerical trend, provide a simple, plausible prediction for the "Total Incidents" for the next year (${year + 1}). Explain your reasoning (e.g., linear trend, recent acceleration).

Ensure your analysis is objective, data-centric, and presented in a clear, professional format. Do not invent data not present in the summary.
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate insights from the AI model. The service may be unavailable or the API key may be invalid.");
  }
}


export async function generateClusterInsights(clusterId: number, clusterData: ClusterData): Promise<string> {
  if (!ai) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }

  const prompt = `
You are a senior criminologist and socio-economic analyst tasked with interpreting machine learning cluster data. Your goal is to uncover the 'story' behind each cluster and propose research directions.

**Analysis Request: Profile of Crime Cluster ${clusterId}**

**Data Profile:**
- **Cluster ID**: ${clusterId}
- **Average Incidents**: ${clusterData.avgIncidents.toFixed(2)}
- **Average Crime Rate (per 1 Lakh Pop.)**: ${clusterData.avgCrimeRate.toFixed(2)}
- **Dominant States in this Cluster**: ${clusterData.topStates.join(', ')}
- **Most Prevalent Crime Types in this Cluster**: ${clusterData.topCrimeTypes.join(', ')}

**Your Task:**
Based on this data profile, produce a short but insightful research brief. Use Markdown for formatting.

1.  **Cluster Archetype**: Give this cluster a descriptive title. For example, "High-Risk Urban Hotspots" or "Low-Incidence Rural Regions".
2.  **Profile Summary**: Briefly describe the key characteristics of this cluster based on the data. Is it defined by high volume, high rate, or a specific type of crime?
3.  **Hidden Research Findings & Hypothesis**: This is the most critical part. Formulate a hypothesis that explains *why* these states and crime types might be grouped together. What is the underlying socio-economic story? Consider factors like urbanization, policing effectiveness, economic conditions, or social structures.
4.  **Proposed Research Questions**: Based on your hypothesis, list 2-3 specific, actionable research questions that a sociologist or criminologist could investigate to validate or refute your hypothesis. For example, "Does the prevalence of 'Cheating & Fraud' in this cluster correlate with the digital banking adoption rate among seniors in its dominant states?"

Your analysis should be insightful, connecting the quantitative data to real-world phenomena and providing a clear path for further research.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error generating insights for Cluster ${clusterId}:`, error);
    throw new Error(`Failed to generate insights for Cluster ${clusterId}.`);
  }
}