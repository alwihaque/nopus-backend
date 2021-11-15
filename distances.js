const Building = require("./Models/building");
const mongoose = require('mongoose');
const Client = require("@googlemaps/google-maps-services-js");
const axios = require('axios');
const client = new Client.Client({});

const key = "AIzaSyBV-CZQ8oWal5k09bC7KNQsM51yCUj2VT8"


async function fetch_distances(origin, destination) {

  let coord_A;
  let coord_B;

  // Origin
  await client.textSearch({
    params: {
      query: origin,
      location: {'lat': 33.791162112779595, 'lng': -84.32403938828458},
      key: key
    },
    timeout: 1000 // milliseconds
  }, axios.axiosInstance).then(r => coord_A = r.data.results[0]['geometry']['location']).catch(e => console.log(e));

  // Destination
  await client.textSearch({
    params: {
      query: destination,
      location: {'lat': 33.791162112779595, 'lng': -84.32403938828458},
      key: key
    },
    timeout: 1000 // milliseconds
  }, axios.axiosInstance).then(r => coord_B = r.data.results[0]['geometry']['location']).catch(e => console.log(e));

  // From A to B
  let result;
  await client.directions({
    params: {
      origin:coord_A,
      destination: coord_B,
      mode: Client.TravelMode.walking,
      key: key
    },
    timeout:1000
  }, axios.axiosInstance).then(r => result = r.data['routes'][0]['legs'][0]['duration']).catch(e => console.log(e));

  result = result['text'].replace(/\D/g,''); // Digits only
  result = parseFloat(result)

  return result

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
  let duration_A;
  let duration_B;
  let mapDistances = {};
    
  console.log(locations.length)
  console.log(combinations.length*2)

  for (const pair of combinations) {

    try {
      // From A to B
      duration_A = await fetch_distances(only_text(pair[0]), only_text(pair[1]));

      console.log("\n%s --> %s: %s mins", pair[0], pair[1], duration_A);

      mapDistances[[pair[0], pair[1]]] = duration_A;

      // From B to A
      duration_B = await fetch_distances(only_text(pair[1]), only_text(pair[0]));

      console.log("\n%s --> %s: %s mins", pair[1], pair[0], duration_B);
    
      mapDistances[[pair[1], pair[0]]] = duration_B;  

    } catch(e) {
      console.log(e);
    }
  }
  
  // Completed distances dictionary here
  console.log(mapDistances)
  console.log("done!");

}


// Main
const display = async () => {
    try {
        await mongoose.connect('mongodb+srv://alwihaque:alwi1234@cluster0.ua0zj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
        return await Building.find();
    }
    catch(e) {
        return e;
    }
}


display().then(x=> {
  console.log(x)
  let locations = [];

  for (const doc of x) {
    if (doc.name == "Modern Language") {
      locations.push("Modern Languages Building")
    } 
    else if (doc.name == "1462 Clifton Rd") {
      locations.push("1462 Clifton Rd, Atlanta, GA 30329")
    }
    else if(doc.name != "1462 Clfton Rd", doc.name != "MODERN") {
      locations.push(doc.name)
    }
  }

  graph_locations(locations);
    
}).catch(e => {
    console.log(e);
})