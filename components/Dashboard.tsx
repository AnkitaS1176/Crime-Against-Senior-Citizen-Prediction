import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ChartCard } from './ChartCard';
import { crimeData, states } from '../data/mockData';
import type { CrimeRecord } from '../types';
import { InsightGenerator } from './InsightGenerator';
import { ClusterAnalysis } from './ClusterAnalysis';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#da70d6', '#a4de6c', '#d0ed57', '#ffc658'];

export const Dashboard: React.FC = () => {

  const yearlyCrime = useMemo(() => {
    const totalsByYear: { [year: number]: number } = {};
    crimeData.forEach(record => {
      if (record.crime_head === 'Total Crimes against Senior Citizen') {
        totalsByYear[record.year] = (totalsByYear[record.year] || 0) + record.number_of_incidences;
      }
    });
    return Object.keys(totalsByYear).map(year => ({
      year: parseInt(year),
      'Total Incidents': totalsByYear[parseInt(year)],
    })).sort((a, b) => a.year - b.year);
  }, []);

  const topStatesIncidents2022 = useMemo(() => {
    return crimeData
      .filter(d => d.year === 2022 && d.crime_head === 'Total Crimes against Senior Citizen')
      .sort((a, b) => b.number_of_incidences - a.number_of_incidences)
      .slice(0, 10)
      .map(d => ({ name: d.state, 'Total Incidents': d.number_of_incidences }))
      .reverse();
  }, []);

  const topStatesRate2022 = useMemo(() => {
    return crimeData
      .filter(d => d.year === 2022 && d.crime_head === 'Total Crimes against Senior Citizen')
      .sort((a, b) => b.crime_rate_per_lakh_population - a.crime_rate_per_lakh_population)
      .slice(0, 10)
      .map(d => ({ name: d.state, 'Crime Rate': d.crime_rate_per_lakh_population }))
      .reverse();
  }, []);
  
  const commonCrimes = useMemo(() => {
    const crimeCounts: { [crime: string]: number } = {};
    crimeData
      .filter(d => d.crime_head !== 'Total Crimes against Senior Citizen')
      .forEach(d => {
        crimeCounts[d.crime_head] = (crimeCounts[d.crime_head] || 0) + d.number_of_incidences;
      });
    return Object.entries(crimeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, 'Total Incidents': count }))
      .reverse();
  }, []);
  
  const clusterData = useMemo(() => {
    return crimeData
      .filter(d => d.crime_head === 'Total Crimes against Senior Citizen');
  }, []);
  
  const clusterSummary = useMemo(() => {
    const summary: { [cluster: number]: { incidences: number[], rates: number[], count: number } } = {};
    clusterData.forEach(d => {
      if (d.cluster_label === undefined) return;
      if (!summary[d.cluster_label]) {
        summary[d.cluster_label] = { incidences: [], rates: [], count: 0 };
      }
      summary[d.cluster_label].incidences.push(d.number_of_incidences);
      summary[d.cluster_label].rates.push(d.crime_rate_per_lakh_population);
      summary[d.cluster_label].count++;
    });

    return Object.entries(summary).map(([cluster, data]) => ({
      name: `Cluster ${cluster}`,
      'Avg Incidents': data.incidences.reduce((a, b) => a + b, 0) / data.count,
      'Avg Crime Rate': data.rates.reduce((a, b) => a + b, 0) / data.count,
    }));
  }, [clusterData]);

  const top5CrimeTypes = useMemo(() =>
    Object.entries(
      crimeData
        .filter(d => d.crime_head !== 'Total Crimes against Senior Citizen')
        .reduce((acc, curr) => {
          acc[curr.crime_head] = (acc[curr.crime_head] || 0) + curr.number_of_incidences;
          return acc;
        }, {} as Record<string, number>)
    )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name]) => name),
  []);

  const crimeTrendsData = useMemo(() => {
    const trendData: Record<number, any> = {};
    crimeData
      .filter(d => top5CrimeTypes.includes(d.crime_head))
      .forEach(d => {
        if (!trendData[d.year]) {
          trendData[d.year] = { year: d.year };
        }
        trendData[d.year][d.crime_head] = (trendData[d.year][d.crime_head] || 0) + d.number_of_incidences;
      });
    return Object.values(trendData).sort((a,b) => a.year - b.year);
  }, [top5CrimeTypes]);

  const crimeProportionsData = useMemo(() => {
    const yearlyTotals: Record<number, number> = {};
    const proportions: Record<number, any> = {};

    const filteredData = crimeData.filter(d => d.crime_head !== 'Total Crimes against Senior Citizen');

    filteredData.forEach(d => {
        yearlyTotals[d.year] = (yearlyTotals[d.year] || 0) + d.number_of_incidences;
    });

    filteredData.forEach(d => {
        if (!proportions[d.year]) {
            proportions[d.year] = { year: d.year };
        }
        if (top5CrimeTypes.includes(d.crime_head)) {
            proportions[d.year][d.crime_head] = (proportions[d.year][d.crime_head] || 0) + d.number_of_incidences;
        } else {
             proportions[d.year]['Other'] = (proportions[d.year]['Other'] || 0) + d.number_of_incidences;
        }
    });

    return Object.values(proportions).map(yearData => {
        const total = Object.entries(yearData).reduce((sum, [key, val]) => (key !== 'year' ? sum + (val as number) : sum), 0);
        const percentages = { year: yearData.year };
        for (const key in yearData) {
            if (key !== 'year') {
                percentages[key] = (yearData[key] / total) * 100;
            }
        }
        return percentages;
    }).sort((a,b) => a.year - b.year);
  }, [top5CrimeTypes]);

  const heatmapData = useMemo(() => {
    const pData = crimeData
      .filter(d => d.crime_head === 'Total Crimes against Senior Citizen' && d.state !== 'All India')
      .reduce((acc, curr) => {
        if (!acc[curr.state]) {
          acc[curr.state] = {};
        }
        acc[curr.state][curr.year] = curr.crime_rate_per_lakh_population;
        return acc;
      }, {} as Record<string, Record<number, number>>);

    return Object.entries(pData).map(([state, yearData]) => ({
      state,
      ...yearData,
    }));
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border border-gray-200 rounded-md shadow-sm">
          <p className="font-bold">{label}</p>
          <p className="text-sm text-blue-600">{`Total Incidents: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const BarCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border border-gray-200 rounded-md shadow-sm">
          <p className="font-bold">{label}</p>
          {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const ScatterCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
          <p className="font-bold">{data.state}, {data.year}</p>
          <p>Incidents: {data.number_of_incidences}</p>
          <p>Crime Rate: {data.crime_rate_per_lakh_population}</p>
          <p>Cluster: {data.cluster_label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <InsightGenerator allCrimeData={crimeData} states={states} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Total Crimes Against Senior Citizens in India (2016-2022)">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={yearlyCrime} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="Total Incidents" stroke="#1d4ed8" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 States by Incidents (2022)">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topStatesIncidents2022} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} content={<BarCustomTooltip />} />
              <Legend />
              <Bar dataKey="Total Incidents" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 States by Crime Rate (per 1 Lakh Pop.) - 2022">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topStatesRate2022} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }}/>
              <Tooltip cursor={{fill: 'rgba(254, 242, 242, 0.5)'}} content={<BarCustomTooltip />} />
              <Legend />
              <Bar dataKey="Crime Rate" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Common Crimes (2016-2022)">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={commonCrimes} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }}/>
              <Tooltip cursor={{fill: 'rgba(240, 253, 244, 0.5)'}} content={<BarCustomTooltip />} />
              <Legend />
              <Bar dataKey="Total Incidents" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <ChartCard title="Clustering: Incidents vs. Crime Rate">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="number_of_incidences" name="Incidents" unit="" />
              <YAxis type="number" dataKey="crime_rate_per_lakh_population" name="Crime Rate" unit="" />
              <ZAxis type="number" range={[50, 500]} dataKey="number_of_senior_citizen_victims" name="Victims" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ScatterCustomTooltip />} />
              <Legend />
              {[0, 1, 2, 3, 4].map((clusterId) => (
                <Scatter 
                  key={`cluster-${clusterId}`} 
                  name={`Cluster ${clusterId}`} 
                  data={clusterData.filter(d => d.cluster_label === clusterId)} 
                  fill={COLORS[clusterId % COLORS.length]} 
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Average Incidents and Crime Rate per Cluster">
          <ResponsiveContainer width="100%" height={400}>
             <BarChart data={clusterSummary} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                <Tooltip content={<BarCustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="Avg Incidents" fill="#3b82f6" />
                <Bar yAxisId="right" dataKey="Avg Crime Rate" fill="#ef4444" />
              </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="States Distribution in High-Incidence Clusters">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={
                    Object.entries(
                      crimeData
                      .filter(d => d.cluster_label && [1, 2, 3, 4].includes(d.cluster_label))
                      .reduce((acc, curr) => {
                          acc[curr.state] = (acc[curr.state] || 0) + 1;
                          return acc;
                      }, {} as Record<string, number>)
                    )
                    .map(([name, value]) => ({name, value}))
                    .sort((a,b) => b.value - a.value)
                    .slice(0, 6)
                  }
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {
                    states.slice(0,6).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
        </ChartCard>
       </div>
       
       <div className="mt-8 border-t-2 pt-8 border-dashed">
         <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Deeper Analysis & Trends for Research</h2>
          <div className="mt-8">
            <ChartCard title="Crime Hotspots Matrix: Rate by State and Year">
              <ResponsiveContainer width="100%" height={800}>
                {/* A proper heatmap is difficult in recharts, so using a stacked bar as a visual proxy */}
                <BarChart layout="vertical" data={heatmapData} margin={{ top: 20, right: 20, bottom: 20, left: 120 }} barCategoryGap={0}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="state" width={120} tick={{ fontSize: 12 }} />
                   <Tooltip
                    cursor={{fill: 'rgba(200, 200, 200, 0.1)'}}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc' }}
                    formatter={(value, name) => [`${(value as number).toFixed(2)}`, `Crime Rate (${name})`]}
                  />
                  {[2016, 2017, 2018, 2019, 2020, 2021, 2022].map((year, index) => (
                    <Bar key={year} dataKey={year} stackId="a" fill={ `hsl(0, 70%, ${90 - (index * 6)}%)`}>
                       {heatmapData.map((entry, entryIndex) => {
                          const rate = entry[year] || 0;
                           // From green (low) to red (high)
                          const hue = Math.max(0, 120 - rate * 6); 
                          const saturation = 70;
                          const lightness = 60;
                          return <Cell key={`cell-${entryIndex}`} fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`} />;
                       })}
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <ChartCard title="Trends of Top 5 Crime Types (2016-2022)">
               <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={crimeTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {top5CrimeTypes.map((crime, index) => (
                      <Line key={crime} type="monotone" dataKey={crime} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Proportion of Crime Types Over Years">
               <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={crimeProportionsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis unit="%" />
                        <Tooltip />
                        <Legend />
                        {[...top5CrimeTypes, "Other"].map((crime, index) => (
                            <Area key={crime} type="monotone" dataKey={crime} stackId="1" stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>
         </div>
         <div className="mt-8">
            <ClusterAnalysis allCrimeData={crimeData} />
         </div>
       </div>
    </div>
  );
};