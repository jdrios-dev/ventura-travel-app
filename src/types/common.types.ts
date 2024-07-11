export interface CommonState {
  userData: string;
  userRole: string;
  myPhotos: [];
  albumTemp: [];
  tripPhotos: [];
  itinerary: string;
}

export type Language = 'en' | 'de' | 'fr' | 'es' | 'nl';
