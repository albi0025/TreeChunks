"use strict";

//You can delete me. I am only used to test functions in the scrape.js
//file.

var scrapeRunner = require('./scrape');

var url = "http://ws.petango.com/Webservices/adoptablesearch/" + "wsAdoptableAnimals.aspx?species=Dog&sex=All&agegroup=All&colnum=" + "1&authkey=1t4v495156y98t2wd78317102f933h83or1340ptjm31spd04d";

scrapeRunner.scrapePetango(url, function (arr) {});