import { PointsToDollars } from '@/interfaces/management/points-to-dollars.interface';

export interface PointsDetails {
  purchasedPoints: PointsToDollars;
  redeemedPoints: PointsToDollars;
  total: PointsToDollars;
}
