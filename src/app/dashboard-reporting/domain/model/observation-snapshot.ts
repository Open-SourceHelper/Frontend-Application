/** Proyección de lectura de BC06 utilizada únicamente para elaborar reportes. */
export interface ObservationSnapshot {
  id: string;
  childId: string;
  createdAt: string;
  author: string;
  description: string;
  category?: string;
}
