
import { Station, Project, ProjectStatus, MaterialStatus, TPIStatus } from './types';

export const STATIONS: Station[] = [
  { id: 'recv', name: 'Receiving Inspection', requiresSignOff: '*', minTpiNoticeDays: 7 },
  { id: 'cut', name: 'Cut to Length', requiresSignOff: null, minTpiNoticeDays: 0 },
  { id: 'blast', name: 'Blasting (Pre-clad survey)', requiresSignOff: null, minTpiNoticeDays: 0 },
  { id: 'weld_overlay', name: 'Weld Overlay', requiresSignOff: '**', minTpiNoticeDays: 7 },
  { id: 'weld_bore', name: 'Weld Overlay Bore', requiresSignOff: '**', minTpiNoticeDays: 7 },
  { id: 'machining', name: 'Machining', requiresSignOff: null, minTpiNoticeDays: 0 },
  { id: 'ndt', name: 'NDT (PAUT/PT/RT)', requiresSignOff: '*', minTpiNoticeDays: 7 },
  { id: 'hydro', name: 'Hydrotest', requiresSignOff: '*', minTpiNoticeDays: 7 },
  { id: 'final_insp', name: 'Final Inspection', requiresSignOff: '*', minTpiNoticeDays: 7 },
  { id: 'surface', name: 'Surface Treatment', requiresSignOff: '**', minTpiNoticeDays: 7 },
  { id: 'packing', name: 'Packing', requiresSignOff: '*', minTpiNoticeDays: 7 },
  { id: 'loadout', name: 'Load Out', requiresSignOff: '**', minTpiNoticeDays: 7 },
];

export const INITIAL_MATERIALS = [
  { id: 'm1', name: 'Carbon Steel Pipe 12"', quantity: 150, unit: 'm', status: MaterialStatus.IN_STOCK },
  { id: 'm2', name: 'Inconel 625 Wire', quantity: 500, unit: 'kg', status: MaterialStatus.IN_TRANSIT, etaDate: '2025-05-15' },
  { id: 'm3', name: 'Forged Flanges ANSI 600', quantity: 40, unit: 'pcs', status: MaterialStatus.UNDER_PRODUCTION, leadTimeDays: 45 },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Kashagan Field Expansion',
    client: 'NCOC',
    status: ProjectStatus.IN_PROGRESS,
    pos: [
      {
        id: 'po1',
        projectId: 'p1',
        poNumber: 'PO-2024-001',
        date: '2024-11-20',
        lineItems: [
          {
            id: 'li1',
            poId: 'po1',
            name: 'Production Spool S-001',
            spec: '12" SCH80 CS + 3mm INC625',
            currentStationId: 'weld_overlay',
            materials: ['m1', 'm2'],
            status: 'Active',
            qcProgress: {
              'recv': { stationId: 'recv', internalSignOff: true, tpiSignOff: true, tpiBookingStatus: TPIStatus.CONFIRMED, completedAt: '2024-12-01' },
              'cut': { stationId: 'cut', internalSignOff: true, tpiSignOff: false, tpiBookingStatus: TPIStatus.NOT_REQUIRED, completedAt: '2024-12-05' },
              'blast': { stationId: 'blast', internalSignOff: true, tpiSignOff: false, tpiBookingStatus: TPIStatus.NOT_REQUIRED, completedAt: '2024-12-10' },
              'weld_overlay': { stationId: 'weld_overlay', internalSignOff: false, tpiSignOff: false, tpiBookingStatus: TPIStatus.PENDING, inspectionDate: '2025-05-22' },
            }
          }
        ]
      }
    ]
  }
];
