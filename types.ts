
export enum ProjectStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD'
}

export enum MaterialStatus {
  IN_STOCK = 'IN_STOCK',
  IN_TRANSIT = 'IN_TRANSIT',
  UNDER_PRODUCTION = 'UNDER_PRODUCTION'
}

export enum TPIStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: MaterialStatus;
  etaDate?: string;
  leadTimeDays?: number;
}

export interface Station {
  id: string;
  name: string;
  requiresSignOff: '*' | '**' | null;
  minTpiNoticeDays: number;
}

export interface QCProgress {
  stationId: string;
  internalSignOff: boolean;
  tpiSignOff: boolean;
  tpiBookingStatus: TPIStatus;
  inspectionDate?: string;
  completedAt?: string;
}

export interface LineItem {
  id: string;
  poId: string;
  name: string;
  spec: string;
  currentStationId: string;
  materials: string[]; // Material IDs
  qcProgress: Record<string, QCProgress>;
  status: 'Draft' | 'Active' | 'Delivered';
}

export interface PO {
  id: string;
  projectId: string;
  poNumber: string;
  date: string;
  lineItems: LineItem[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  pos: PO[];
}

export interface WorkstationCapacity {
  id: string;
  name: string;
  dailyCapacityHours: number;
  utilization: Record<string, number>; // Date string -> Hours used
}
