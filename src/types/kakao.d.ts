namespace kakao {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }
    class Map {
      constructor(container: HTMLElement | null, options: MapOptions);
      getLevel(): number;
      setLevel(level: number): void;
      getCenter(): LatLng;
      setCenter(latlng: LatLng): void;
      getBounds(): LatLngBounds;
      panTo(latlng: LatLng): void;
    }
    interface MapOptions {
      center: LatLng;
      level: number;
    }
    interface LatLngBounds {
      contain(latlng: LatLng): boolean;
    }
    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
    }
    interface CustomOverlayOptions {
      position: LatLng;
      content: HTMLElement | string;
      clickable?: boolean;
      yAnchor?: number;
    }
    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
    }
    interface MarkerOptions {
      position: LatLng;
      image?: MarkerImage;
      title?: string;
    }
    class MarkerImage {
      constructor(src: string, size: Size);
    }
    class Size {
      constructor(width: number, height: number);
    }
    namespace event {
      function addListener(
        target: unknown,
        type: string,
        callback: (...args: unknown[]) => void
      ): void;
      function removeListener(
        target: unknown,
        type: string,
        callback: (...args: unknown[]) => void
      ): void;
    }
    namespace services {
      enum Status {
        OK = 'OK',
      }
      class Geocoder {
        constructor();
        addressSearch(
          address: string,
          callback: (result: GeocoderResult[], status: Status) => void
        ): void;
      }
      interface GeocoderResult {
        x: string;
        y: string;
      }
    }
    function load(callback: () => void): void;
  }
}

interface Window {
  kakao: typeof kakao;
  kakaoMapInstance?: kakao.maps.Map;
}
