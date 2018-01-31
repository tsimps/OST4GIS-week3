(function(){

  var map = L.map('map', {
    center: [39.9522, -75.1639],
    zoom: 14
  });
  var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  /* =====================

  # Lab 2, Part 4 — (Optional, stretch goal)

  ## Introduction

    You've already seen this file organized and refactored. In this lab, you will
    try to refactor this code to be cleaner and clearer - you should use the
    utilities and functions provided by underscore.js. Eliminate loops where possible.

  ===================== */

  // Mock user input
  // Filter out according to these zip codes:
  var acceptedZipcodes = [19106, 19107, 19124, 19111, 19118, 19143];
  // Filter according to enrollment that is greater than this variable:
  var minEnrollment = 300;

  // helper function to clean up the zip codes
  // If we have '19104 - 1234', splitting and taking the first (0th) element
  // as an integer should yield a zip in the format above
  var cleanZip = function(zip) {
      if (typeof zip === 'string') {
      split = zip.split(' ');
      normalized_zip = parseInt(split[0]);
      zip = normalized_zip;
    }
  };

  var assignGrades = function(dat) {
    if (typeof dat.GRADE_ORG === 'number') {  // if number
      dat.HAS_KINDERGARTEN = dat.GRADE_LEVEL < 1;
      dat.HAS_ELEMENTARY = 1 < dat.GRADE_LEVEL < 6;
      dat.HAS_MIDDLE_SCHOOL = 5 < dat.GRADE_LEVEL < 9;
      dat.HAS_HIGH_SCHOOL = 8 < dat.GRADE_LEVEL < 13;
    } else {  // otherwise (in case of string)
      dat.HAS_KINDERGARTEN = dat.GRADE_LEVEL.toUpperCase().indexOf('K') >= 0;
      dat.HAS_ELEMENTARY = dat.GRADE_LEVEL.toUpperCase().indexOf('ELEM') >= 0;
      dat.HAS_MIDDLE_SCHOOL = dat.GRADE_LEVEL.toUpperCase().indexOf('MID') >= 0;
      dat.HAS_HIGH_SCHOOL = dat.GRADE_LEVEL.toUpperCase().indexOf('HIGH') >= 0;
    }
  };

  // filter data helper functions

  // takes an object and returns boolean, true if dat === "OPEN"
  var isOpen = function(dat) {
    return dat.toUpperCase() == 'OPEN';
  }; // returns boolean

  // takes an object and returns boolenan, true if dat is "CHARTER" or 'PRIVATE'
  var isPublic = function(dat) {
    return (dat.toUpperCase() !== 'CHARTER' || dat.toUpperCase() !== 'PRIVATE');
  }; // returns boolean

  // returns true if school is some form of K-12 school
  var isSchool = function(dat) {
    return (dat.HAS_KINDERGARTEN || dat.HAS_ELEMENTARY ||
      dat.HAS_MIDDLE_SCHOOL ||
      dat.HAS_HIGH_SCHOOL);
    }; // returns boolean

  var filterCondition = function(dat) {
    filter_condition = (isOpen(dat.ACTIVE) &&
                        isSchool(dat) &&
                        dat.ENROLLMENT > minEnrollment &&
                        acceptedZipcodes.indexOf(dat.ZIPCODE) >= 0);
    return filter_condition;
  };


  // filter  data
  var filtered_data = [];
  var filtered_out = [];

  // clean data and filter data
  for (var i = 0; i < schools.length - 1; i++) { // REPLACE THIS JAWN

    // clean the zip code data and the grade level data
    cleanZip(schools[i].ZIPCODE);
    assignGrades(schools[i]);

    // implement the filter and sort into two arrays
    if (filterCondition(schools[i])) {
      filtered_data.push(schools[i]);
    } else {
      filtered_out.push(schools[i]);
    }

  }

  // output to the console the level of cleaning & filtering for user validation
  console.log('Included:', filtered_data.length);
  console.log('Excluded:', filtered_out.length);

  // main loop
  var color;

  for (i = 0; i < filtered_data.length - 1; i++) {

    // Constructing the styling  options for our map
    if (filtered_data[i].HAS_HIGH_SCHOOL){
      color = '#0000FF';
    } else if (filtered_data[i].HAS_MIDDLE_SCHOOL) {
      color = '#00FF00';
    } else {
      color = '##FF0000';
    }
    // The style options
    var pathOpts = {'radius': filtered_data[i].ENROLLMENT / 30,
                    'fillColor': color};
    L.circleMarker([filtered_data[i].Y, filtered_data[i].X], pathOpts)
      .bindPopup(filtered_data[i].FACILNAME_LABEL)
      .addTo(map);
  }



})();

/*
Still to do:
Refactor the loops using underscorejs
?Try to find recurisive solution?
*/
