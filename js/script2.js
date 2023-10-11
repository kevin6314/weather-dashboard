//----GLOBAL VARIABLES----//
var form = $('#my-form');
var submitButton = $('#submit-button');
var searchStatus = $('#search-status');
var userInput = $('#input-field');
var statusUpdate = $('#search-status');
var currentWeatherEl = $('#current-weather');
var futureWeatherEl = $('#future-weather');

//----FUNCTIONS----//

form.on('submit', function(event){

    event.preventDefault();
    var formInput = userInput.val();
    getCoordinates(formInput);
});

function getCoordinates(formInput){

    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+formInput+'&limit=2&appid=0f93a1e1cb2dce'+'22d83081cb1a965d8a';

    console.log(requestUrl);

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var long= data[0].lon;
            var latLong = 'lat='+lat+'&lon='+long;
            console.log(latLong);
            getWeather(latLong);
        });
}

function getWeather(latLong){
    
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?'+latLong+'&appid=0f93a1e1cb2dce22d'+'83081cb1a965d8a';
    console.log(requestUrl);

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {    
            storeData(data);
        });
}

function storeData(data){
    console.log('Weather API \n----------');
    console.log(data);

    if(!data){
        statusUpdate.text('Sorry, we could not find any data');
    } else {

        var currentCity= data.city.name;
        
        var currentCityObj = {
            currentDate: data.list[0].dt_txt,
            currentIcon: data.list[0].weather[0].icon,
            currentTemp: data.list[0].main.temp,
            currentWind: data.list[0].wind.speed,
            currentHumidity: data.list[0].main.humidity,
        }

        localStorage.setItem(currentCity,JSON.stringify(currentCityObj));
        console.log(currentCity);
        console.log(currentCityObj);
        getObjectFromLocalStorage(currentCity, currentCityObj);
        }
}

function getObjectFromLocalStorage(currentCity){
    
    if(localStorage.getItem(currentCity)){
        return JSON.parse(localStorage.getItem(currentCity));
    } else {
        return null;
    }
    
var storedObject = getObjectFromLocalStorage(currentCity);
    if(storedObject){
        console.log("object found",storedObject)
    } else {
        console.log("object not found");
    }

    // var currentCityContent = $("<h2>"+ currentCity + "</h2>");
    // var currentCityDate = $("<h2>"+ localStorage.getItem(currentCityObj.currentDate) + "</h2>");
    // var currentIconContent = $("<p>"+ localStorage.getItem(currentCityObj.currentIcon) + "</p>");
    // var currentTempContent = $("<p>Temp: "+ localStorage.getItem(currentCityObj.currentTemp) +"F</p>");
    // var currentWindContent = $("<p>Wind: "+ localStorage.getItem(currentCityObj.currentWind) +"MPH</p>");
    // var currentHumidityContent = $("<p>Temp: "+ localStorage.getItem(currentCityObj.currentHumidity) +"%</p>");

    // var mainCardEl = $('<div></div>').addClass('card');
    // var cardHeaderEl = $('<div></div>').addClass('card-header');
    // var cardBodyEl = $('<div></div>').addClass('card-body');

    // currentWeatherEl.append(mainCardEl);
    // mainCardEl.append(cardHeaderEl, cardBodyEl);
    // cardHeaderEl.append(currentCityContent, currentCityDate);
    // cardBodyEl.append(currentIconContent, currentTempContent, currentWindContent, currentHumidityContent);
}



