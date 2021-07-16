function savedTrips(dataset) {
    console.log(dataset)

    var container = document.createElement("div");

    ajax(dataset, processTrips, container);

    function processTrips(tripList) {

        console.log("parsed stats list:");
        console.log(tripList); // list as an array of objects

        var savedTripList = []; // empty array
        // convert elements to table elements
        for (var i = 0; i < tripList.length; i++) {
            savedTripList[i] = {}; // i-th element of array is empty object.
            savedTripList[i]._Image = SortableTableUtils.makeImage(tripList[i].image, "10rem");
            savedTripList[i].Location = SortableTableUtils.makeText(tripList[i].location);
            savedTripList[i].User = SortableTableUtils.makeText(tripList[i].userName);
            savedTripList[i].Date = SortableTableUtils.makeDate(tripList[i].date);
            savedTripList[i].Points = SortableTableUtils.makeNumber(tripList[i].points, false); // true --> format as currency
            savedTripList[i].Link = SortableTableUtils.makeLink(tripList[i].link);
        }

        container.appendChild(MakeClickSortTable({
            objList: savedTripList,
            title: "Saved Trips",
            sortIcon: "public/Pics/arrows_icon_white.png"
        }));

    }
    return container;
}