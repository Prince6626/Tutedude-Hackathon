declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        Geocoder: new () => any;
        Size: new (width: number, height: number) => any;
        LatLng: new (lat: number, lng: number) => any;
      };
    };
  }
}

export {}; 