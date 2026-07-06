import { describe, it, expect } from "vitest";
import { sniffImageType } from "./sniffImageType";

describe("sniffImageType", () => {
  it("detects JPEG from its magic bytes", () => {
    expect(sniffImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]))).toBe("jpg");
  });

  it("detects PNG from its magic bytes", () => {
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]))).toBe("png");
  });

  it("detects WEBP from its RIFF....WEBP header", () => {
    const bytes = new Uint8Array(12);
    bytes.set([0x52, 0x49, 0x46, 0x46], 0); // RIFF
    bytes.set([0x57, 0x45, 0x42, 0x50], 8); // WEBP
    expect(sniffImageType(bytes)).toBe("webp");
  });

  it("detects AVIF from its ISOBMFF ftyp box", () => {
    const bytes = new Uint8Array(12);
    bytes.set([0, 0, 0, 0x1c], 0);
    bytes.set([0x66, 0x74, 0x79, 0x70], 4); // ftyp
    bytes.set([0x61, 0x76, 0x69, 0x66], 8); // avif
    expect(sniffImageType(bytes)).toBe("avif");
  });

  it("rejects a renamed non-image file (e.g. an executable with a spoofed .jpg extension)", () => {
    expect(sniffImageType(new Uint8Array([0x4d, 0x5a, 0x90, 0, 0, 0, 0, 0, 0, 0, 0, 0]))).toBeNull();
  });

  it("rejects a buffer that's too short to contain any real header", () => {
    expect(sniffImageType(new Uint8Array([0xff, 0xd8]))).toBeNull();
  });
});
