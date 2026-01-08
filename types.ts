export interface ProductData {
  id: 'A' | 'B';
  name: string;
  rating: number; // e.g., 4.5
  maxRating: number; // e.g., 5
  reviewCount: number; // e.g., 100
  loading?: boolean;
}

export interface WilsonResult {
  observedProportion: number; // p-hat
  lowerBound: number; // The Wilson score
  adjustedStars: number; // lowerBound * maxRating
}

export enum ComparisonState {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  READY = 'READY'
}