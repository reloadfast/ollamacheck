import { describe, it, expect, beforeEach } from 'vitest';
import { modelScraper } from '../src/modules/scraper';

describe('scraper utilities', () => {
  describe('estimateVramGb', () => {
    it('should calculate VRAM correctly for 7B model with Q4_K_M (4-bit)', () => {
      const vram = modelScraper.estimateVramGb(7, 4);
      expect(vram).toBeCloseTo(3.9375); // (7 * 4) / 8 / 1e9 * 1.15
    });

    it('should calculate VRAM correctly for 32B model with Q8_0 (8-bit)', () => {
      const vram = modelScraper.estimateVramGb(32, 8);
      expect(vram).toBeCloseTo(3.6); // (32 * 8) / 8 / 1e9 * 1.15
    });

    it('should calculate VRAM correctly for 1.5B model with Q4_K_M', () => {
      const vram = modelScraper.estimateVramGb(1.5, 4);
      expect(vram).toBeCloseTo(0.21875); // (1.5 * 4) / 8 / 1e9 * 1.15
    });
  });

  describe('calculateFitScore', () => {
    it('should calculate fit score correctly with VRAM margin and pull count', () => {
      const score = modelScraper.calculateFitScore(30, 10000);
      expect(score).toBe(30000); // (40 - 30) * 10 + 10000 = 100 + 10000 = 10100
    });

    it('should add bonus for code models', () => {
      const score = modelScraper.calculateFitScore(25, 50000, true);
      expect(score).toBe(50075); // (40 - 25) * 10 + 50000 + 50 = 150 + 50000 + 50 = 50200
    });

    it('should handle edge cases correctly', () => {
      const score = modelScraper.calculateFitScore(39, 0);
      expect(score).toBe(10); // (40 - 39) * 10 + 0 = 10 + 0 = 10
    });
  });
});