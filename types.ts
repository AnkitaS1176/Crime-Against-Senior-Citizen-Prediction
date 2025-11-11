export interface CrimeRecord {
  year: number;
  state: string;
  crime_head: string;
  number_of_incidences: number;
  number_of_senior_citizen_victims: number;
  crime_rate_per_lakh_population: number;
  cluster_label?: number;
}

export interface ClusterData {
  avgIncidents: number;
  avgCrimeRate: number;
  topStates: string[];
  topCrimeTypes: string[];
}
