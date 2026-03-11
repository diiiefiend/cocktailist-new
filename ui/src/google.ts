import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

// google stuff
setOptions({key: process.env.VUE_APP_GOOGLE_API_KEY});

let MapsLib: google.maps.MapsLibrary; 
let MapsMarkerLib: google.maps.MarkerLibrary;
let PlacesLib: google.maps.PlacesLibrary;
let GeocodingLib: google.maps.Geocoder; // TODO: not sure if this is a library

// add a Map Marker to a Google Map
const addMarker = async (map: google.maps.Map, coordinates: google.maps.LatLng) => {
  if (!MapsMarkerLib) {
    MapsMarkerLib = await importLibrary('marker');
  };

  const marker = new MapsMarkerLib.AdvancedMarkerElement({
    map,
    position: coordinates,
  });
}

// return a Google Map centered on 1 bar's address
const getMap = async (anchorElement: any, bar: Bar) => {
  if (!MapsLib) {
    MapsLib = (await importLibrary('maps'));
  };

  const coords = new google.maps.LatLng(bar.latitude, bar.longitude);

  const options: google.maps.MapOptions = {
    center: coords,
    zoom: 15,
    maxZoom: 15,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    mapTypeId: MapsLib.MapTypeId.ROADMAP,
    draggable: true,
    // overviewMapControl: false,
    zoomControl: true,
    disableDefaultUI: true
  };

  const map = new MapsLib.Map(anchorElement, options);

  addMarker(map, coords);

  return map;
}


export {
  // convertAddressToLatLng,
  // getHours,
  getMap,
};