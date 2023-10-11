//----GLOBAL VARIABLES----//
var form = $('#my-form');
var submitButton = $('#submit-button');
var searchStatus = $('#search-status');
var userInput = $('#input-field');
var statusUpdate = $('#search-status');
var searchHistory = $('#search-history');
var currentWeatherEl = $('#current-weather');
var futureWeatherEl = $('#future-weather');

//----FUNCTIONS----//

form.on('submit', function(event){

    event.preventDefault();
    var formInput = userInput.val();
    getCoordinates(formInput);

});

searchHistory.on('click',function(event){
    
    event.preventDefault();
    var buttonText = $(event.target).text();
    getCoordinates(buttonText);

})

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
            renderData(data);
        });
}

function renderData(data){
    console.log('Weather API \n----------');
    console.log(data);

    if(!data){
        statusUpdate.text('Sorry, we could not find any data');
    } else {

        currentWeatherEl.empty();
        futureWeatherEl.empty();

        var city = data.city.name;
        var currentDate = data.list[0].dt_txt;
        var currentIcon = data.list[0].weather[0].icon; //will need to fix this
        var currentTemp = data.list[0].main.temp;
        var currentWind = data.list[0].wind.speed;
        var currentHumidity = data.list[0].main.humidity;

        var currentCity = $("<h2>"+ city + "</h2>");
        var currentIconContent = $("<p>"+ currentIcon+ "</p>");
        var currentTempContent = $("<p>Temp: "+ currentTemp +"F</p>");
        var currentWindContent = $("<p>Wind: "+ currentWind +"MPH</p>");
        var currentHumidityContent = $("<p>Temp: "+ currentHumidity +"%</p>");

        var mainCardEl = $('<div></div>').addClass('card');
        var cardHeaderEl = $('<div></div>').addClass('card-header');
        var cardBodyEl = $('<div></div>').addClass('card-body');

        currentWeatherEl.append(mainCardEl);
        mainCardEl.append(cardHeaderEl, cardBodyEl);
        cardHeaderEl.append(currentCity, currentDate);
        cardBodyEl.append(currentIconContent, currentTempContent, currentWindContent, currentHumidityContent);

        var dataToShow = [0,8,16,24,32];

        for(i=0; i<dataToShow.length; i++){
            var j = dataToShow[i];
        
            //var futureDate = new Date(data.list[i].dt); //date forecasted
            var futureDate = data.list[j].dt_txt;
            var futureIcon = data.list[j].weather[0].icon; //will need to fix this
            var futureTemp = data.list[j].main.temp;
            var futureWind = data.list[j].wind.speed;
            var futureHumidity = data.list[j].main.humidity;

            // console.log(futureTemp);
            var futurecardEl = $('<div></div>').addClass('card text-white bg-dark mb-3 mx-1').css('max-width', '18rem');
            var futurecardTitleEl = $('<h5></h5>').addClass('card-title');
            var futurecardTextEl = $('<p></p>').addClass('card-text');
            var futurecardBodyEl = $('<div></div>').addClass('card-body');
            var futurecardHeaderEl = $('<div></div>').addClass('card-header');

            var futureIconContent = $("<p>"+ futureIcon+ "</p>");
            var futureTempContent = $("<p>Temp: "+ futureTemp +"F</p>");
            var futureWindContent = $("<p>Wind: "+ futureWind +"MPH</p>");
            var futureHumidityContent = $("<p>Temp: "+ futureHumidity +"%</p>");
            
            futurecardTextEl.append(futureIconContent, futureTempContent, futureWindContent, futureHumidityContent);
            futurecardTitleEl.text(futureDate);
            futurecardBodyEl.append(futurecardTitleEl, futurecardTextEl);
            futurecardEl.append(futurecardHeaderEl, futurecardBodyEl);
            futureWeatherEl.append(futurecardEl);
         }

    var previousSearches = $("<a>"+ city + "</a>").addClass("btn btn-secondary my-1 w-100");
    searchHistory.append(previousSearches);

    }
}



