import api from '../api';

export interface ParkingLot {
  prkId: string;
  prkName: string;
  totalLots: number;
  availLots: number;
  distance: number;
}

export interface PlaceDetail {
  placeName: string;
  placeImageUrl: string;
  placeAddress: string;
  region: string;
  theme: string;
  tranquilityLevel: number;
  likeCount: number;
  introduction: string;
  aiTipSummary?: string;
  nearbyParkingLots?: ParkingLot[];
  longitude: string;
  latitude: string;
}
