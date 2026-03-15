import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

// google stuff
setOptions({ key: import.meta.env.VITE_GOOGLE_API_KEY });

let MapsLib: google.maps.MapsLibrary;
let MapsMarkerLib: google.maps.MarkerLibrary;
let PlacesLib: google.maps.PlacesLibrary;
let GeocodingLib: google.maps.GeocodingLibrary;

// add a Map Marker to a Google Map
const addMarker = async (map: google.maps.Map, coordinates: google.maps.LatLng) => {
  if (!MapsMarkerLib) {
    MapsMarkerLib = await importLibrary('marker');
  }

  const marker = new MapsMarkerLib.AdvancedMarkerElement({
    map,
    position: coordinates,
  });
};

// return a Google Map centered on 1 bar's address
const getMap = async (anchorElement: HTMLElement, bar: Bar) => {
  if (!MapsLib) {
    MapsLib = await importLibrary('maps');
  }

  const coords = new google.maps.LatLng(bar.latitude, bar.longitude);

  const options: google.maps.MapOptions = {
    center: coords,
    zoom: 14,
    maxZoom: 15,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    mapTypeId: MapsLib.MapTypeId.ROADMAP,
    draggable: true,
    zoomControl: true,
    disableDefaultUI: true,
    mapId: 'DEMO_MAP_ID',
  };

  const map = new MapsLib.Map(anchorElement, options);

  addMarker(map, coords);

  return map;
};

// just returns the place id. uses Google Text Search Essentials, so should be a free API lookup
const getPlaceId = async (bar: Bar) => {
  if (!PlacesLib) {
    PlacesLib = await importLibrary('places');
  }

  const coords = new google.maps.LatLng(bar.latitude, bar.longitude);

  const searchRequest = {
    locationBias: coords,
    textQuery: bar.name,
    fields: ['id'],
    maxResultCount: 1,
  };

  const { places } = await PlacesLib.Place.searchByText(searchRequest);

  return places[0].id;
};

// gets hours using the Place Details Enterprise API and a place ID. Free up to 5k calls in a month
const getHours = async (bar: Bar, placeId?: string) => {
  if (!PlacesLib) {
    PlacesLib = await importLibrary('places');
  }

  // this is a separate API call which should be free
  const placeIdToUse = placeId ? placeId : await getPlaceId(bar);
  const place = new PlacesLib.Place({
    id: placeIdToUse,
  });

  const placeDetails = await place.fetchFields({
    fields: ['regularOpeningHours'],
  });

  const hours = placeDetails.place.regularOpeningHours?.weekdayDescriptions;

  return hours;
};

// uses Google Text Search Enterprise API to get id, hours, and website. Free up to 5k calls in a month
const getPlaceDetails = async (bar: Bar) => {
  if (!PlacesLib) {
    PlacesLib = await importLibrary('places');
  }

  const coords = new google.maps.LatLng(bar.latitude, bar.longitude);

  const searchRequest = {
    locationBias: coords,
    textQuery: bar.name,
    fields: ['id', 'regularOpeningHours', 'websiteURI'],
    maxResultCount: 1,
  };

  const { places } = await PlacesLib.Place.searchByText(searchRequest);

  const barPlace = places[0];

  return {
    id: barPlace.id,
    hours: barPlace.regularOpeningHours?.weekdayDescriptions,
    website: barPlace.websiteURI,
  };
};

// uses Places Geocoding Essentials API, free up to 10k requests per month
const convertAddressToLatLng = async (address: string) => {
  if (!GeocodingLib) {
    GeocodingLib = await importLibrary('geocoding');
  }

  const geocoder = new GeocodingLib.Geocoder();
  const request = {
    address,
  };

  const { results } = await geocoder.geocode(request);

  if (results.length) {
    return results[0].geometry.location;
  }
};

export { convertAddressToLatLng, getHours, getPlaceDetails, getMap };
