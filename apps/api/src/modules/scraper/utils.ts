export function estimateVramGb(paramsBillions: number, bitsPerWeight: number = 4): number {
  // paramsBillions is already in billions, so convert to GB directly.
  // Formula: (params_billion * bits_per_weight) / 8, then apply 15% overhead.
  return (paramsBillions * bitsPerWeight) / 8 * 1.125;
}

export function calculateFitScore(
  estimatedVramGb: number,
  weeklyPulls: number,
  isCodeModel: boolean = false
): number {
  const vramMargin = Math.max(0, 40 - estimatedVramGb);
  let baseScore = vramMargin * 10 + weeklyPulls;

  if (isCodeModel) {
    baseScore += 50;
  }

  return Math.round(baseScore);
}
