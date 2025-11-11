import type { CrimeRecord } from '../types';

export const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu And Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const crimeTypes = [
  "Total Crimes against Senior Citizen",
  "Simple Hurt (Sec.323 & 324 IPC)",
  "Theft (Sec.379 IPC)",
  "Forgery, Cheating & Fraud",
  "Criminal Intimidation (Sec.506 IPC)",
  "Murder (Sec.302 IPC)",
  "Grievous Hurt",
  "Robbery",
  "Criminal Trespass",
  "Attempt to Commit Murder (Sec.307 IPC)"
];

// This mock data is generated based on the visual information from the provided charts.
// It is intended to be representative, not exact.
export const crimeData: CrimeRecord[] = [
    // Data points mimicking the charts. Total crimes are aggregated for the main line chart.
    // Example for one state over a few years
    { year: 2016, state: 'Maharashtra', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 4694, number_of_senior_citizen_victims: 4800, crime_rate_per_lakh_population: 7.0, cluster_label: 1 },
    { year: 2017, state: 'Maharashtra', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 4500, number_of_senior_citizen_victims: 4600, crime_rate_per_lakh_population: 4.6, cluster_label: 1 },
    { year: 2018, state: 'Maharashtra', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 4800, number_of_senior_citizen_victims: 4900, crime_rate_per_lakh_population: 5.0, cluster_label: 1 },
    { year: 2019, state: 'Maharashtra', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 5200, number_of_senior_citizen_victims: 5300, crime_rate_per_lakh_population: 5.2, cluster_label: 2 },
    { year: 2020, state: 'Maharashtra', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 4800, number_of_senior_citizen_victims: 4950, crime_rate_per_lakh_population: 4.2, cluster_label: 1 },
    { year: 2021, state: 'Maharashtra', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 5500, number_of_senior_citizen_victims: 5600, crime_rate_per_lakh_population: 5.3, cluster_label: 2 },
    { year: 2022, state: 'Maharashtra', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 6100, number_of_senior_citizen_victims: 6200, crime_rate_per_lakh_population: 4.3, cluster_label: 4 },

    { year: 2022, state: 'Madhya Pradesh', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 6200, number_of_senior_citizen_victims: 6300, crime_rate_per_lakh_population: 9.5, cluster_label: 4 },
    { year: 2022, state: 'Tamil Nadu', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 2200, number_of_senior_citizen_victims: 2300, crime_rate_per_lakh_population: 2.9, cluster_label: 3 },
    { year: 2022, state: 'Telangana', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 1900, number_of_senior_citizen_victims: 1950, crime_rate_per_lakh_population: 6.3, cluster_label: 3 },
    { year: 2022, state: 'Andhra Pradesh', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 1500, number_of_senior_citizen_victims: 1550, crime_rate_per_lakh_population: 4.0, cluster_label: 3 },
    { year: 2022, state: 'Karnataka', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 1200, number_of_senior_citizen_victims: 1250, crime_rate_per_lakh_population: 2.6, cluster_label: 0 },
    
    // Data for top crime rates
    { year: 2022, state: 'Delhi', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 900, number_of_senior_citizen_victims: 950, crime_rate_per_lakh_population: 115, cluster_label: 2 },
    { year: 2022, state: 'Chandigarh', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 200, number_of_senior_citizen_victims: 210, crime_rate_per_lakh_population: 105, cluster_label: 2 },
    
    // Data point to create a specific "escalation point" for the heatmap
    { year: 2021, state: 'Haryana', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 1500, number_of_senior_citizen_victims: 1550, crime_rate_per_lakh_population: 15.5, cluster_label: 3 },


    // Data for yearly totals (approximated from line chart)
    { year: 2016, state: 'All India', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 21500, number_of_senior_citizen_victims: 22000, crime_rate_per_lakh_population: 20.0, cluster_label: 4 },
    { year: 2017, state: 'All India', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 23000, number_of_senior_citizen_victims: 23500, crime_rate_per_lakh_population: 21.0, cluster_label: 4 },
    { year: 2018, state: 'All India', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 24500, number_of_senior_citizen_victims: 25000, crime_rate_per_lakh_population: 22.0, cluster_label: 4 },
    { year: 2019, state: 'All India', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 27800, number_of_senior_citizen_victims: 28300, crime_rate_per_lakh_population: 25.0, cluster_label: 4 },
    { year: 2020, state: 'All India', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 25000, number_of_senior_citizen_victims: 25500, crime_rate_per_lakh_population: 23.0, cluster_label: 4 },
    { year: 2021, state: 'All India', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 26200, number_of_senior_citizen_victims: 26700, crime_rate_per_lakh_population: 24.0, cluster_label: 4 },
    { year: 2022, state: 'All India', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 28500, number_of_senior_citizen_victims: 29000, crime_rate_per_lakh_population: 26.0, cluster_label: 4 },

    // Common crimes data
    { year: 2018, state: 'Maharashtra', crime_head: 'Simple Hurt (Sec.323 & 324 IPC)', number_of_incidences: 1200, number_of_senior_citizen_victims: 1250, crime_rate_per_lakh_population: 1.5, cluster_label: 1 },
    { year: 2018, state: 'Maharashtra', crime_head: 'Theft (Sec.379 IPC)', number_of_incidences: 800, number_of_senior_citizen_victims: 820, crime_rate_per_lakh_population: 1.0, cluster_label: 1 },
    { year: 2018, state: 'Maharashtra', crime_head: 'Forgery, Cheating & Fraud', number_of_incidences: 600, number_of_senior_citizen_victims: 610, crime_rate_per_lakh_population: 0.8, cluster_label: 0 },
    { year: 2018, state: 'Madhya Pradesh', crime_head: 'Simple Hurt (Sec.323 & 324 IPC)', number_of_incidences: 1500, number_of_senior_citizen_victims: 1550, crime_rate_per_lakh_population: 2.0, cluster_label: 2 },

    // Scatter plot / clustering points
    { year: 2020, state: 'Kerala', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 800, number_of_senior_citizen_victims: 810, crime_rate_per_lakh_population: 80, cluster_label: 2 },
    { year: 2021, state: 'Gujarat', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 3000, number_of_senior_citizen_victims: 3050, crime_rate_per_lakh_population: 40, cluster_label: 3 },
    { year: 2019, state: 'Rajasthan', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 400, number_of_senior_citizen_victims: 400, crime_rate_per_lakh_population: 20, cluster_label: 0 },
    { year: 2017, state: 'Uttar Pradesh', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 250, number_of_senior_citizen_victims: 250, crime_rate_per_lakh_population: 5, cluster_label: 0 },
    { year: 2022, state: 'West Bengal', crime_head: 'Total Crimes against Senior Citizen', number_of_incidences: 300, number_of_senior_citizen_victims: 300, crime_rate_per_lakh_population: 10, cluster_label: 0 },
];
// Adding more dummy data to make charts look fuller
states.forEach(state => {
    if (crimeData.some(d => d.state === state)) return; // Don't overwrite existing
    for(let year = 2016; year <= 2022; year++) {
        const incidents = Math.floor(Math.random() * 800) + 50;
        const victims = incidents + Math.floor(Math.random() * 30);
        const rate = parseFloat((Math.random() * 15).toFixed(1));
        const cluster = Math.floor(rate/4); // Simple cluster logic
        crimeData.push({
            year,
            state,
            crime_head: 'Total Crimes against Senior Citizen',
            number_of_incidences: incidents,
            number_of_senior_citizen_victims: victims,
            crime_rate_per_lakh_population: rate,
            cluster_label: cluster,
        });
        crimeTypes.slice(1).forEach(crime => {
             crimeData.push({
                year,
                state,
                crime_head: crime,
                number_of_incidences: Math.floor(incidents * (Math.random() * 0.2)),
                number_of_senior_citizen_victims: Math.floor(victims * (Math.random() * 0.2)),
                crime_rate_per_lakh_population: parseFloat((rate * (Math.random() * 0.2)).toFixed(1)),
                cluster_label: cluster,
            });
        });
    }
});