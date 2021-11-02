


import { Client, TravelMode } from "@googlemaps/google-maps-services-js";

import axiosInstance from 'axios';

const client = new Client({});

async function fetch_distances(origin, destination) {

  let coord_A;
  let coord_B;

  // Origin
  await client.textSearch({
    params: {
      query: origin,
      location: {'lat': 33.791162112779595, 'lng': -84.32403938828458},
      key: process.env.GOOGLE_MAPS_API_KEY
    },
    timeout: 1000 // milliseconds
  }, axiosInstance).then(r => coord_A = r.data.results[0]['geometry']['location']).catch(e => console.log(e));

  // Destination
  await client.textSearch({
    params: {
      query: destination,
      location: {'lat': 33.791162112779595, 'lng': -84.32403938828458},
      key: process.env.GOOGLE_MAPS_API_KEY
    },
    timeout: 1000 // milliseconds
  }, axiosInstance).then(r => coord_B = r.data.results[0]['geometry']['location']).catch(e => console.log(e));

  let result;
  await client.directions({
    params: {
      origin:coord_A,
      destination: coord_B,
      mode: TravelMode.walking,
      key: process.env.GOOGLE_MAPS_API_KEY
    },
    timeout:1000
  }, axiosInstance).then(r => result = r.data['routes'][0]['legs'][0]['duration']).catch(e => console.log(e));

  return result['text']

};


function only_text(text) {
  return text.replace(/[0-9]/g, '');
}


async function graph_locations(locations) {

  // All possible connections between locations
  var combinations = [].concat(...locations.map( 
      (v, i) => locations.slice(i+1).map( w => [v, w]))
  );

  // Itereate and calculate edges for all pairs
  let duration;

  for (const pair of combinations) {

    duration = await fetch_distances(only_text(pair[0]), only_text(pair[1]));

    console.log("\n%s --> %s: %s", pair[0], pair[1], duration)
  }
}

// Main
let input_locations = [];

// Case 1
input_locations = ["Rich Building 108", "White Hall 112", "Grace Crum Rollins TBA", "New Psyc Bldg 225"];

console.log("\n-----CASE 2-----");
console.log("Input locations: %s\n\nOutput:", input_locations);
graph_locations(input_locations).then(r => console.log(""));
