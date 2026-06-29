// src/types/pdf-parse-fork.d.ts
declare module 'pdf-parse-fork' {
  function pdf(buffer: Buffer): Promise<PDFData>
  export default pdf
}