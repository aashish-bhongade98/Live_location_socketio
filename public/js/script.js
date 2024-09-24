
const socket = io()  //inittialise socketio - sends connection request to backend 
                    // handling it on app.js

 console.log("testing script")                   

//setting up location
if( navigator.geolocation )  // checking if browser supports geolocation
 {
    navigator.geolocation.getCurrentPosition( (position)=>{

       const {latitude, longitude}= position.coords   // getting the live cooridantes

       socket.emit("send-location", {latitude,longitude} )  //emitting an event from front end containing coords to app.js file
    }, 
    (err)=>{       // if any error in watchposition 
       console.error(err)
      },
    {      // settings for watchpostion
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0  // no caching
    } )
 }

// setting up the map view provided by Leaflet

const map = L .map("map").setView([0,0], 16)


L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
   {
      attribution: "OpenStreetMap"
   }).addTo(map)      // adding tileLayer to the map

const markers ={}

socket.on("receive-data", (data)=>{
   const {id, latitude, longitude} = data

   map.setView([latitude, longitude])

   if(markers[id])
   {
      markers[id] = setLatLng((latitude,longitude))
   }
   else{
      markers[id] = L.marker([latitude, longitude]).addTo(map)
   }
} )