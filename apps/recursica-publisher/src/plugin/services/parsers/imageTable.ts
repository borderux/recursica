/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Image table for storing unique images and referencing them by index
 * Reduces JSON size by storing each image once instead of repeating it
 * Images are stored as Base64 data for portability
 */

/**
 * Image table entry stores image data and metadata
 */
export interface ImageTableEntry {
  imageHash: string; // Original Figma image hash (for reference)
  imageData: string; // Base64-encoded image data
  width?: number; // Image width (if available)
  height?: number; // Image height (if available)
}

/**
 * ImageTable manages unique images and provides index-based access
 * Similar to InstanceTable and VariableTable, stores images once and references them by index
 */
export class ImageTable {
  private imageMap: Map<string, number>; // imageHash -> index
  private images: ImageTableEntry[]; // index -> image data
  private nextIndex: number;

  constructor() {
    this.imageMap = new Map();
    this.images = [];
    this.nextIndex = 0;
  }

  /**
   * Adds an image to the table if it doesn't already exist
   * Returns the index of the image (existing or newly added)
   *
   * @param imageHash - The Figma image hash
   * @param imageData - Base64-encoded image data
   * @param width - Optional image width
   * @param height - Optional image height
   */
  addImage(
    imageHash: string,
    imageData: string,
    width?: number,
    height?: number,
  ): number {
    // Check if image already exists
    if (this.imageMap.has(imageHash)) {
      return this.imageMap.get(imageHash)!;
    }

    // Add new image
    const index = this.nextIndex++;
    this.imageMap.set(imageHash, index);
    this.images[index] = {
      imageHash,
      imageData,
      width,
      height,
    };
    return index;
  }

  /**
   * Gets the index of an image by its hash
   * Returns -1 if not found
   */
  getImageIndex(imageHash: string): number {
    return this.imageMap.get(imageHash) ?? -1;
  }

  /**
   * Gets an image entry by index
   */
  getImageByIndex(index: number): ImageTableEntry | undefined {
    return this.images[index];
  }

  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   */
  getSerializedTable(): Record<string, ImageTableEntry> {
    const table: Record<string, ImageTableEntry> = {};
    for (let i = 0; i < this.images.length; i++) {
      table[String(i)] = this.images[i];
    }
    return table;
  }

  /**
   * Reconstructs an ImageTable from a serialized table object
   */
  static fromTable(table: Record<string, ImageTableEntry>): ImageTable {
    const imageTable = new ImageTable();
    const entries = Object.entries(table).sort(
      (a, b) => parseInt(a[0], 10) - parseInt(b[0], 10),
    );

    for (const [indexStr, image] of entries) {
      const index = parseInt(indexStr, 10);
      imageTable.imageMap.set(image.imageHash, index);
      imageTable.images[index] = image;
      imageTable.nextIndex = Math.max(imageTable.nextIndex, index + 1);
    }

    return imageTable;
  }

  /**
   * Gets the total number of images in the table
   */
  getSize(): number {
    return this.images.length;
  }
}

/**
 * Image reference format used in serialized JSON
 * The presence of _imgRef indicates this is an image reference
 */
export interface ImageReference {
  _imgRef: number;
}

/**
 * Creates an image reference object for serialization
 */
export function createImageReference(index: number): ImageReference {
  return {
    _imgRef: index,
  };
}

/**
 * Checks if an object is an image reference
 */
export function isImageReference(obj: any): boolean {
  return obj && typeof obj === "object" && typeof obj._imgRef === "number";
}
