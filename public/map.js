import exifr from '../src/bundles/full.mjs'

import { gpsOnlyOptions, Exifr } from '../src/bundles/full.mjs'   // import exifr stuff from src folder

let $log = document.querySelector('#log')   // div for outputting performance info, not necessary
let memUsed = 0

let dropzone = document.getElementById('dropzone');     // upload div
dropzone.addEventListener('dragenter', e => e.preventDefault())
dropzone.addEventListener('dragover', e => e.preventDefault())
dropzone.addEventListener('drop', e => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
})

document.querySelector('input[type="file"]').addEventListener('change', e => {
    e.preventDefault()
    handleFiles(e.target.files)
})

async function handleFiles(files) {
    files = Array.from(files)
    

    let promises = files.map(exifr.gps).map(promise => promise.catch(() => { })) // gets gps coords
    let coords = await Promise.all(promises)      // array of coordinates used to display on map
    console.log("Coords Array: " + coords);

    var arr = new Array(files.length); // photo data array
    var add = new Array(files.length); // address array
    for (var i = 0; i < files.length; i++) { // for each photo...
        console.log("I: " + i);
        
        files[i].src=URL.createObjectURL(files[i]);
        console.log(files[i]);

        let arrTest = await exifr.parse(files[i], true);
        // get exif data
        //let size = (await exifr.thumbnailUrl(files[i])).naturalWidth;
        //        console.log("Image width: " + size);
       
        arr[i] = new Array(6);

        // populate each array element with an array of Lat, Long, and Date.
        if (arrTest.latitude) {
            arr[i][0] = arrTest.latitude
        }
        else { arr[i][0] = "undefined" }

        if (arrTest.longitude) {
            arr[i][1] = arrTest.longitude
        }
        else { arr[i][1] = "undefined" }

        if (arrTest.CreateDate) {
            arr[i][2] = arrTest.CreateDate.toGMTString()
            
        }
        else { arr[i][2] = "undefined" }
        if(i<arr.length){
            arr[i][4]=files[i].src
            console.log(arr[i][4]+"ooooooooooooo")
        }
        else { arr[i][4] = "undefined" }

        //   arr[i] = [[arrTest.latitude], [arrTest.longitude], [arrTest.CreateDate.toGMTString()]];

        const geocoder = new google.maps.Geocoder();

        if (arrTest.latitude && arrTest.longitude) {
            reverseGeocode(geocoder, arrTest.latitude, arrTest.longitude, map, function (addy) { // reverse geocode function call
               
                add.push(addy) // add to address array
                console.log("ADD: " + add[i])
                if (i = (files.length - 1)) { // if all photos have been parsed
                    renderMap(coords, arr, add);
                }
                else {
                    console.log("Error in reverseGeocode– i (" + i + ") doesn't match files.length-1 (" + (files.length - 1) + ").  Can't render map.");
                }
            });
        } else {
            console.log("Error: Photo #" + (i + 1) + " does not have coordinates"); // Need to have a way for people to add it manually
            alert("Error: Photo #" + (i + 1) + " does not have coordinates");
            //add.push("undefined")
        }

        console.log("Photo " + (i + 1) + ":\nDate: " + JSON.stringify(arr[i][2]) + "\nLatitude: " + arr[i][0] + "\nLongitude: " + arr[i][1] + "\nAddress: " + arr[i][3] + "\nURL: " +arr[i][4]);
    }
  
   




   
    }


async function reverseGeocode(geocoder, lat, long, map, callback) {
    const latlngStr = [lat, long];
    //console.log("LatLngStr: " + latlngStr);
    const latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1]),
    };
    var addy
    console.log("LatLng: " + latlngStr);
    geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
            if (results[0]) {     // results is an array, with the first element being Google's most accurate prediction and subsequent elements being less accurate results in order.  About 9-12 results usually based on testing.
                addy = results[0].formatted_address;
                console.log("Addy: " + addy);
                callback(addy);
            } else {
                window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + status);
        }
    });
}

// test image for custom map icon.  For our purposes, we'll need to add each photo to an array to display on line 72
const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

function renderMap(coords, arr, add) {
    let map = new google.maps.Map(document.querySelector('#map'), {
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    })
    console.log("ADDDDDDDD: " + add);
    coords = coords.filter(coord => coord)
    let points = coords.map(coord => new google.maps.LatLng(coord.latitude, coord.longitude))
    console.log("Points: " + points);
    var bounds = new google.maps.LatLngBounds()
    points.forEach(point => bounds.extend(point))
    //console.log("Points after: " + points);
    map.fitBounds(bounds)
    //let markers = points.map(point => new google.maps.Marker({map, position: point, icon: image, animation: google.maps.Animation.DROP})) // map markers created

    var infowindow = new google.maps.InfoWindow();

    var loadFile;
    
 
    for (var i = 0; i < arr.length; i++) {
      
        const sortedActivities = arr.sort((a, b) => b.date- a.date);

        var firstdate = new Date(sortedActivities[i][2])
        var seconDate = new Date(sortedActivities[i][2]);
        // console.log(sortedActivities);
        var lastdate=new Date( sortedActivities[sortedActivities.length - 1][2])
        var differece =( lastdate - firstdate) / (1000 * 60 * 60 * 24);
      //  console.log(Math.ceil(differece));
        //console.log(nrOfDays);
    

        //console.log(result);

        var testIcon = {
            url:arr[i][4] , size: new google.maps.Size(100, 100)
        
        };
        var testImage = arr[i][4];
        

        var lat = arr[i][0], long = arr[i][1], date = arr[i][2], latlng = new google.maps.LatLng(lat, long), address = add[i + arr.length];
        var content = '<div style="float:left"><img width="275px" height="auto" src="' + testImage + '"></div><div style="float:right; padding: 3px;"><p><b>Date: </b>' + date + '</p><p><b>Latitude: </b>' + lat + '</p><p><b>Longitude: </b>' + long + '</p><p><b>Address: </b>' + address + '</p><p><b>Notes: </b><br><br></p></div>';
        var marker = new google.maps.Marker({
            map: map,
            title: "test",
            icon: testIcon,
            position: latlng
        });
        google.maps.event.addListener(marker, 'click', (function (marker, content) {
            return function () {
                infowindow.setContent(content);
                infowindow.open(map, marker);
            }
        })(marker, content));
    }
    

    /*    const uluru = { lat: 43, lng: 11 };
          const contentString =
            '<div id="content">' +
            '<div id="siteNotice" style="float:left">' +
            '<img src="http://i.stack.imgur.com/g672i.png">' +
            "</div>" +
            '<div style="float:left">' +
            '<h1 id="firstHeading" class="firstHeading">Generic Park</h1>' +
            '<p><b>Date:</b> 3/8/2019</p>' +
            '<div id="bodyContent">' +
            "<p><b>Generic Park</b>, the largest park in <b>Generic State.</b>  " +
            "It lies 335&#160;km (208&#160;mi) " +
            "south west of the nearest large town, example town; 450&#160;km " +
            "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
            "features of the generic park." +
            "It has many springs, waterholes, " +
            "rock caves and ancient paintings. Generic park is listed as a World " +
            "Heritage Site.</p>" +
            '<p><a href="https://parksite.com">Visit Generic Park Site</a></p>' +
            "</div>" +
            "</div>" +
            "</div>";
          const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          const marker = new google.maps.Marker({
            position: uluru,
            map,
            title: "Uluru (Ayers Rock)",
          });
          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });*/
}
function createATrip( arr) {
   

    for (var i = 0; i < arr.length; i++) {

        const sortedActivities = arr.sort((a, b) => b.date - a.date);
        var firstdate = new Date(sortedActivities[0][2])

        console.log(sortedActivities);

        var lastdate = new Date(sortedActivities[sortedActivities.length - 1][2])
        var differece = Math.ceil( (lastdate - firstdate) / (1000 * 60 * 60 * 24));
    
}
    var list = new List()
for(var i=0;i<=differece;i++){
    var item1 = new Item()
    list.push(item1);}
    console.log

}
