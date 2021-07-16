import exifr from '../src/bundles/full.mjs'

import { gpsOnlyOptions, Exifr } from '../src/bundles/full.mjs'   // import exifr stuff from src folder

let $log = document.querySelector('#log')   // div for outputting performance info, not necessary
let memUsed = 0
var length = (document.querySelectorAll('.all').length);
var arry = new Array(length)

let dropzone= document.getElementById('tripPic1').src;     // upload div
var urltouse = dropzone;

//console.log(urltouse);

const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
var file = new File([urltouse], "name");
//file.add(new File([urltouse], "name1"));
//var coords;
//let blob = await fetch(urltouse).then(r => r.blob());
var manual = getLastItem(urltouse)

for (let i = 1; i <= length; i++) {
    var dropzone1 = document.getElementById('tripPic' + i).src;
    arry.push(dropzone1);

}

//console.log(array);
const array = arry.filter(el => {
    return el != null && el != '';
});
console.log(array);
//var file = new File([urltouse], "name");
//file.add(new File([urltouse], "name1"));
//var coords;




//var manual = getLastItem(urltouse) 
if (manual == "LDN") {
    file.latitude = 51.5002;
    file.longitude = 0.0036;
    console.log(file);
    noexif();
}
else if (manual == "cambodia") {
    file.latitude = 13.4125;
    file.longitude = 103.8670;
    noexif();
}
else if (manual == "tanzania") {
    file.latitude = 6.3690;
    file.longitude = 34.8888;
    noexif();
}
else if (manual == "dam") {
    file.latitude = 52.3676;
    file.longitude = 4.9041;
    noexif();
}
else if (manual == "bar") {
    file.latitude = 41.3840;
    file.longitude = 2.1762;
    noexif();
}
else if (manual == "FUJI") {
    file.latitude = 35.3606;
    file.longitude = 138.7274;
    noexif();
}
else if (manual == "paris") {
    file.latitude = 48.8584;
    file.longitude = 2.2945;
    noexif();
}
else if (manual == "italy") {
    file.latitude = 45.439390
    file.longitude = 12.329930
    noexif();
}
else if (manual == "Ksamil1tripPic") {
    file.latitude = 39.773109
    file.longitude = 19.997257
    noexif();
}
else if (manual == "Ksamil2tripPic") {
    file.latitude = 39.773109
    file.longitude = 19.997257
    noexif();
}
else if (manual == "KsamiltripPic") {
    file.latitude = 39.773109
    file.longitude = 19.997257
    noexif();
}

else if (manual == "HK") {
    file.latitude = 22.280000
    file.longitude = 114.173600
    noexif();
}
else {

    let promises = array.map(exifr.gps).map(promise => promise.catch(() => { })) // gets gps coords
    let coords = await Promise.all(promises)      // array of coordinates used to display on map
    console.log("Coords Array: " + coords);


    let map = new google.maps.Map(document.querySelector('#maptouse'), {
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    })

    coords = coords.filter(coord => coord)
    let points = coords.map(coord => new google.maps.LatLng(coord.latitude, coord.longitude))
    console.log("Points: " + points);
    var bounds = new google.maps.LatLngBounds()
    points.forEach(point => bounds.extend(point))
    //console.log("Points after: " + points);
    map.fitBounds(bounds)


    var infowindow = new google.maps.InfoWindow();



    for (i = 0; i < array.length; i++) {
        let { latitude, longitude } = await exifr.gps(array[i])

        var testIcon = {
            url: array[i], size: new google.maps.Size(100, 100)

        };
        var testImage = array[i];

        var latlngStr = [latitude, longitude];
        //console.log("LatLngStr: " + latlngStr);


        var lat = latitude, long = longitude, latlng = new google.maps.LatLng(lat, long);
        var content = '<div style="float:left"><img width="275px" height="auto" src="' + testImage + '">\'</p><p><b>Latitude: </b>' + lat + '</p><p><b>Longitude: </b>' + long;
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
}
function noexif() {
    let map = new google.maps.Map(document.querySelector('#map'), {
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    })


    let points = new google.maps.LatLng(file.latitude, file.longitude);

    var bounds = new google.maps.LatLngBounds()
    bounds.extend(points);
    //console.log("Points after: " + points);
    map.fitBounds(bounds)
    //let markers = points.map(point => new google.maps.Marker({map, position: point, icon: image, animation: google.maps.Animation.DROP})) // map markers created

    var infowindow = new google.maps.InfoWindow();

    var loadFile;




    var testIcon = {
        url: dropzone, size: new google.maps.Size(100, 100)

    };
    var testImage = dropzone;

    const latlngStr = [file.latitude, file.longitude];
    //console.log("LatLngStr: " + latlngStr);
    const latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1]),
    };

    var content = '<div style="float:left"><img width="275px" height="auto" src="' + testImage + '">\'</p><p><b>Latitude: </b>' + file.latitude + '</p><p><b>Longitude: </b>' + file.longitude;
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
