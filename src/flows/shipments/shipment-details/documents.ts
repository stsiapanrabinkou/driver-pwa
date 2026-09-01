import type { DocumentType } from "./AddDocumentModal";

export interface ShipmentDocument {
  id: string;
  name: string;
  timestamp: string;
  uploadedBy: string;
  type: DocumentType;
}
