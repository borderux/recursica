/**
 * Generic rate limiter utility for batching async operations
 *
 * This class provides a configurable rate limiting mechanism that can be used
 * for any operation that needs to be rate-limited, such as API calls, file operations,
 * or database queries. It automatically handles batching of items and enforces
 * rate limits with configurable delays.
 *
 * @example
 * ```typescript
 * const rateLimiter = new RateLimiter({
 *   batchSize: 50,        // optional, defaults to 50
 *   delayBetweenBatches: 60000  // optional, defaults to 60000ms
 * });
 *
 * await rateLimiter.processBatched({
 *   items: files,
 *   processor: async (batch) => await commitFiles(batch),
 *   onBatchStart: (batchIndex, totalBatches) => console.log(`Processing batch ${batchIndex + 1}/${totalBatches}`),
 *   onBatchComplete: (batchIndex, totalBatches) => console.log(`Completed batch ${batchIndex + 1}/${totalBatches}`)
 * });
 * ```
 */
export class RateLimiter {
  /**
   * Configuration options for the rate limiter
   */
  private readonly config: {
    /** Size of each batch for processing */
    batchSize: number;
    /** Delay in milliseconds between batches */
    delayBetweenBatches: number;
  };

  /**
   * Creates a new RateLimiter instance
   *
   * @param config - Configuration options for the rate limiter
   * @param config.batchSize - Number of items per batch (default: 50) @default 50
   * @param config.delayBetweenBatches - Delay between batches in milliseconds (default: 60000ms) @default 60000
   */
  constructor(
    config: {
      batchSize?: number;
      delayBetweenBatches?: number;
    } = {}
  ) {
    this.config = {
      batchSize: config.batchSize || 50,
      delayBetweenBatches: config.delayBetweenBatches || 60 * 1000, // 60 seconds
    };
  }

  /**
   * Processes items in batches with automatic delays between batches
   *
   * This method automatically splits items into batches, processes each batch
   * through the provided processor function, and adds delays between batches.
   *
   * @param options - Configuration for batch processing
   * @param options.items - Array of items to process
   * @param options.processor - Async function that processes a batch of items
   * @param options.onBatchStart - Optional callback when a batch starts processing
   * @param options.onBatchComplete - Optional callback when a batch completes
   * @returns Promise that resolves when all batches are processed
   *
   * @example
   * ```typescript
   * await rateLimiter.processBatched({
   *   items: files,
   *   processor: async (batch) => await commitFiles(batch),
   *   onBatchStart: (batchIndex, totalBatches) => console.log(`Starting batch ${batchIndex + 1}`),
   *   onBatchComplete: (batchIndex, totalBatches) => console.log(`Completed batch ${batchIndex + 1}`)
   * });
   * ```
   */
  async processBatched<T, R>(options: {
    items: T[];
    processor: (batch: T[]) => Promise<R>;
    onBatchStart?: (batchIndex: number, totalBatches: number, batchSize: number) => void;
    onBatchComplete?: (batchIndex: number, totalBatches: number, result: R) => void;
  }): Promise<R[]> {
    const { items, processor, onBatchStart, onBatchComplete } = options;

    // Split items into batches
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += this.config.batchSize) {
      batches.push(items.slice(i, i + this.config.batchSize));
    }

    console.log(
      `Processing ${items.length} items in ${batches.length} batches of max ${this.config.batchSize} items each`
    );

    const results: R[] = [];

    // Process each batch
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      // Notify batch start
      onBatchStart?.(batchIndex, batches.length, batch.length);

      console.log(
        `Processing batch ${batchIndex + 1}/${batches.length} with ${batch.length} items`
      );

      // Process the batch
      const result = await processor(batch);
      results.push(result);

      // Notify batch completion
      onBatchComplete?.(batchIndex, batches.length, result);

      console.log(`Completed batch ${batchIndex + 1}/${batches.length}`);

      // Wait before starting the next batch (if there is one)
      if (batchIndex < batches.length - 1) {
        console.log(
          `Waiting ${this.config.delayBetweenBatches / 1000} seconds before starting next batch...`
        );
        await new Promise((resolve) => setTimeout(resolve, this.config.delayBetweenBatches));
      }
    }

    console.log(`Successfully processed all ${items.length} items in ${batches.length} batches`);
    return results;
  }

  /**
   * Gets the current configuration
   *
   * @returns Copy of the current configuration
   */
  getConfig() {
    return { ...this.config };
  }
}
