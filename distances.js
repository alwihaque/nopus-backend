const Building = require("./Models/building");
const mongoose = require('mongoose');
const Client = require("@googlemaps/google-maps-services-js");
const axios = require('axios');
const client = new Client.Client({});

const key = "AIzaSyDHclpZjLZi6vC5bJaPU3dyEEz4yrMugKY"


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
      let source = pair[0];

      if(source === "Modern Languages Building") {
        source = "Modern Language";
      }
      else if(source === "1462 Clifton Rd, Atlanta, GA 30329") {
        source = "1462 Clifton Rd";
      }
      let sourceObj = await Building.findOne({name: source});
      if(sourceObj.to === undefined || sourceObj.to === null) {
        sourceObj.to = [];
      }
      let destination = pair[1];
      if(destination === "Modern Languages Building") {
        source = "Modern Language";
      }
      else if (destination === "1462 Clifton Rd, Atlanta, GA 30329") {
        source = "1462 Clifton Rd";
      }
      let destObj = await Building.findOne({name: destination});
      const toB = {
        name: destObj.name,
        destination: destObj._id,
        time: duration_A
      };
      sourceObj.to.push(toB);
      await sourceObj.save();
      mapDistances[[pair[0], pair[1]]] = duration_A;
      // From B to A
      duration_B = await fetch_distances(only_text(pair[1]), only_text(pair[0]));
      console.log("\n%s --> %s: %s mins", pair[1], pair[0], duration_B);
      source = pair[1];
      if(source === "Modern Languages Building") {
        source = "Modern Language";
      }
      else if(source === "1462 Clifton Rd, Atlanta, GA 30329") {
        source = "1462 Clifton Rd";
      }
      sourceObj = await Building.findOne({name: source});
      if(sourceObj.to === undefined || sourceObj.to === null) {
        sourceObj.to = [];
      }
      destination = pair[0];
      if(destination === "Modern Languages Building") {
        source = "Modern Language";
      }
      else if (destination === "1462 Clifton Rd, Atlanta, GA 30329") {
        source = "1462 Clifton Rd";
      }
      destObj = await Building.findOne({name: destination});
      const toA = {
        name: destObj.name,
        destination: destObj._id,
        time: duration_B
      };
      sourceObj.to.push(toA);
      await sourceObj.save();
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