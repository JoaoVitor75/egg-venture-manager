
export interface EggType {
  id: string;
  name: string;
  count: number;
  trays: number;
  units: number;
}

export interface Aviary {
  id: string;
  name: string;
  trayValue: number;
}

export interface Batch {
  id: string;
  name: string;
  aviaries: Aviary[];
  active: boolean;
}

export type CollectionMode = 'trays' | 'units';
