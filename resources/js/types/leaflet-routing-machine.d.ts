import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    interface ControlOptions {
      waypoints?: L.LatLng[];
      router?: any;
      plan?: any;
      geocoder?: any;
      fitSelectedRoutes?: boolean;
      routeLine?: (route: any, options: any) => L.Polyline;
      autoRoute?: boolean;
      routeWhileDragging?: boolean;
      routeDragInterval?: number;
      waypointMode?: string;
      useZoomParameter?: boolean;
      showAlternatives?: boolean;
      altLineOptions?: L.PolylineOptions;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      lineOptions?: {
        styles?: L.PolylineOptions[];
        extendToWaypoints?: boolean;
        missingRouteTolerance?: number;
      };
      show?: boolean;
      collapsible?: boolean;
      collapsed?: boolean;
      containerClassName?: string;
      createMarker?: (i: number, waypoint: any, n: number) => L.Marker | null;
    }

    class Control extends L.Control {
      constructor(options?: ControlOptions);
      getWaypoints(): L.LatLng[];
      setWaypoints(waypoints: L.LatLng[]): this;
      spliceWaypoints(index: number, waypointsToRemove: number, ...waypoints: L.LatLng[]): L.LatLng[];
      getPlan(): any;
      getRouter(): any;
      on(type: string, fn: (e: any) => void): this;
    }

    function control(options?: ControlOptions): Control;
  }
}
