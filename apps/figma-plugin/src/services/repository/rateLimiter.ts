/**
 * Rate limiter utility for GitHub API operations
 * Limits commits to maximum 100 files per commit per minute
 */
export class RateLimiter {
  private commitCount = 0;
  private lastResetTime = Date.now();
  private readonly maxCommitsPerMinute = 50;
  private readonly resetIntervalMs = 60 * 1000; // 1 minute

  /**
   * Check if we can make another commit
   */
  canCommit(): boolean {
    this.resetIfNeeded();
    return this.commitCount < this.maxCommitsPerMinute;
  }

  /**
   * Record a commit operation
   */
  recordCommit(): void {
    this.resetIfNeeded();
    this.commitCount++;
  }

  /**
   * Get the delay needed before the next commit
   */
  getDelayUntilNextCommit(): number {
    this.resetIfNeeded();
    if (this.commitCount < this.maxCommitsPerMinute) {
      return 0;
    }

    const timeSinceReset = Date.now() - this.lastResetTime;
    return Math.max(0, this.resetIntervalMs - timeSinceReset);
  }

  /**
   * Wait for the rate limit to reset if needed
   */
  async waitForReset(): Promise<void> {
    const delay = this.getDelayUntilNextCommit();
    if (delay > 0) {
      console.log(
        `Rate limit reached. Waiting ${Math.ceil(delay / 1000)} seconds before next commit...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      this.resetIfNeeded();
    }
  }

  /**
   * Reset the counter if the time interval has passed
   */
  private resetIfNeeded(): void {
    const now = Date.now();
    if (now - this.lastResetTime >= this.resetIntervalMs) {
      this.commitCount = 0;
      this.lastResetTime = now;
    }
  }

  /**
   * Get current status for debugging
   */
  getStatus(): { commitCount: number; timeUntilReset: number } {
    this.resetIfNeeded();
    const timeSinceReset = Date.now() - this.lastResetTime;
    return {
      commitCount: this.commitCount,
      timeUntilReset: Math.max(0, this.resetIntervalMs - timeSinceReset),
    };
  }
}
