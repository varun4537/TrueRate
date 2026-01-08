import { WilsonResult } from '../types';

/**
 * Calculates the lower bound of the Wilson score confidence interval for a Bernoulli parameter.
 * 
 * Based on the reference (Evan Miller's "How Not To Sort By Average Rating"):
 * Rating is treated as the proportion of maximum possible stars (p-hat).
 * 
 * Formula: (p + z²/2n - z * sqrt((p(1-p)/n) + z²/4n²)) / (1 + z²/n)
 * 
 * @param rating Current average rating (e.g., 4.5)
 * @param maxRating Scale maximum (e.g., 5.0)
 * @param n Number of reviews/ratings
 * @param z Z-score for confidence level (default 1.96 for 95%)
 */
export const calculateWilsonScore = (
  rating: number,
  maxRating: number,
  n: number,
  z: number = 1.96
): WilsonResult => {
  if (n === 0) {
    return {
      observedProportion: 0,
      lowerBound: 0,
      adjustedStars: 0
    };
  }

  // 1. Calculate observed proportion (p-hat)
  // Example: 4.9 / 5.0 = 0.98
  const phat = Math.min(Math.max(rating / maxRating, 0), 1);

  // 2. Wilson Score Interval Formula (Lower Bound)
  const z2 = z * z;
  
  // Center of the interval
  const centerNumerator = phat + z2 / (2 * n);
  
  // Width of the interval (Standard Error part)
  // sqrt( (p(1-p)/n) + z²/(4n²) )
  const insideSqrt = (phat * (1 - phat)) / n + z2 / (4 * n * n);
  const widthNumerator = z * Math.sqrt(insideSqrt);
  
  // Denominator
  const denominator = 1 + z2 / n;
  
  const lowerBound = (centerNumerator - widthNumerator) / denominator;

  return {
    observedProportion: phat,
    lowerBound: Math.max(0, lowerBound), // Clamp to 0
    adjustedStars: Math.max(0, lowerBound) * maxRating
  };
};