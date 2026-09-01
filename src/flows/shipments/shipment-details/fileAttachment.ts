// Shared by every "attach a file" card in this flow (AddDocumentModal,
// CompleteDeliveryModal's POD photo) so the mechanism — and its visible
// metadata (extension, size) — stays identical wherever a driver attaches a
// file, not reinvented per screen.

// Same fixed height for both the empty prompt and the attached-file card —
// the card's own content changes state, but the box it sits in shouldn't
// resize around it.
export const ATTACH_CARD_HEIGHT = 88;

export function splitFileName(fileName: string): { base: string; extension: string } {
  const dot = fileName.lastIndexOf(".");
  if (dot <= 0) return { base: fileName, extension: "" };
  return { base: fileName.slice(0, dot), extension: fileName.slice(dot + 1).toUpperCase() };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
