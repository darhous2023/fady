/**
 * Real file-type detection from the first bytes of the file (magic
 * numbers), not the filename extension -- an uploaded file's extension is
 * trivially spoofable (Station 7: uploads previously only checked
 * `file.name.split(".").pop()`, so a renamed `.exe` with a `.jpg` name
 * would have passed straight through to Supabase Storage).
 */
export function sniffImageType(bytes: Uint8Array): "jpg" | "png" | "webp" | "avif" | null {
  if (bytes.length < 12) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";

  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return "png";

  // RIFF....WEBP
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return "webp";

  // ISOBMFF: box size (4 bytes) + "ftyp" + brand ("avif"/"avis"/"mif1")
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (brand === "avif" || brand === "avis" || brand === "mif1") return "avif";
  }

  return null;
}
