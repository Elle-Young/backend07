'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const superagent = require('superagent');
const PORT = process.env.PORT;
// LOCATION DATA
function FormattedData(data) {
 this.search_query = data.results[0].formatted_address;
 this.formatted_query = data.formattedQuery;
 this.latitude = data.results[0].geometry.bounds.latitude;
 this.longitude = data.results[0].geometry.bounds.longitude;
}


app.get('/location', (request, response) => {
  const searchQuery = request.query.data;
  console.log(searchQuery);
  const urlToVisit = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GOOGLE_MAPS}`;
  
  return superagent.get(urlToVisit)
    .then(data =>{
      console.log(data.text);
      new FormattedData(data.text);
      console.log(geoData);
      ;

 }).catch(error => {
  response.status(500).send(error.message);
  console.error(error);
});
})
// WEATHER DATA
function WeatherGetter(weatherValue) {
 this.forecast = weatherValue.summary;
 this.time = new Date(weatherValue.time * 1000).toDateString();
}
app.get('/weather', (request, response) => {
 try {
   const darkskyData = require('./data/darksky.json');
   const dailyData = darkskyData.daily.data.map(value => {
     // console.log('value.summary is', value.summary);
     // console.log('value.time is', value.time);
     return new WeatherGetter(value);
   })
   response.send(dailyData);
 } catch (error) {
   console.error(error);
   response.status(500).send('Something went wrong!');
 }
})
app.listen(PORT, () => { console.log(`app is up on PORT ${PORT}`) });