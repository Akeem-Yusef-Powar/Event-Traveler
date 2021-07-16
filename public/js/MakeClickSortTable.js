// This version of MakeTable expects objList to hold an array of objects 
// in which all the properties are already "td" tags which may contain images, 
// alignment, etc. 

function MakeClickSortTable(params) {

    if (!params.objList) {
        var message = "Cannot sort. Need an objList with at least one object";
        console.log(message);
        alert(message);
        return;  // early return -- dont try to sort.
    }

    var objList = params.objList;
    var title = params.title || "Other";
    var sortOrderPropName = params.sortOrderPropName || Object.keys(objList[0])[0];
    var sortIcon = params.sortIcon || "public/Pics/arrows_icon.png";
    var direction = params.direction || true;


    function jsSort(objList, sortProp, direction) {

        if (!objList || !objList[0]) {
            var message = "Cannot sort. Need an objList with at least one object";
            console.log(message);
            alert(message);
            return;  // early return -- dont try to sort.
        }

        var obj = objList[0];
        if (!obj[sortProp]) {
            var message = "objList does not have property " + sortProp + " -- cannot sort by that property.";
            console.log(message);
            alert(message);
            return;  // early return -- dont try to sort.
        }

        if (obj[sortProp].sortOrder === null) {
            var message = "Cannot sort objList by property " + sortProp +
                    " because this property never had it's sortOrder set (by a method in SortableTableUtils.js).";
            console.log(message);
            alert(message);
            return;  // early return -- dont try to sort.
        }

        // q and z are just elements in the array and the funcction has to return negative or positive or zero 
        // depending on the comparison of q and z.
        // using JS associative array notation (property name char string used inside square brackets 
        // as it if was an index value). 

        objList.sort(function (q, z) {  // in line (and anonymous) def'n of fn to compare list elements. 
            // the function you create is supposed to return positive (if first bigger), 0 if equal, negative otherwise.

            // using JS associative array notation, extract the 'byProperty' property from the two
            // list elements so you can compare them.

            var qVal = q[sortProp].sortOrder;
            var zVal = z[sortProp].sortOrder;

            var c = 0;
            if (qVal > zVal) {
                c = 1;
            } else if (qVal < zVal) {
                c = -1;
            }

            if (!direction) {
                c = -c;
            }
//            console.log("comparing " + qVal + " to " + zVal + " is " + c);
            return c;
        });

    } // jsSort


    function isToShow(obj, searchKey) {
        if (!searchKey || searchKey.length === 0) {
            return true; // show the object if searchKey is empty
        }
        var searchKeyUpper = searchKey.toUpperCase();
        for (var prop in obj) {
            var propVal = obj[prop].innerHTML.toUpperCase();
            if (propVal.includes(searchKeyUpper)) {

                // ignore image names
                if (!propVal.includes("<IMG")) {
                    console.log("filter applies");
                    return true;
                }
            }
        }
        console.log("filter doesn't apply");
        return false;
    } // isToShow 



    // remove the tbody from 'table' (if there is one). 
    // sort 'list' by 'sortOrderPropName'. 
    // add a new tbody to table, inserting rows from the sorted list.
    function addTableBody(table, list, sortProp, direction, filter) {

        // remove old tbody element if there is one (else you'll get the new sorted rows 
        // added to end of what's there).
        var oldBody = table.getElementsByTagName("tbody");
        if (oldBody[0]) {
            console.log("ready to remove oldBody");
            table.removeChild(oldBody[0]);
        }

        jsSort(list, sortProp, direction);

        // Add one row (to HTML table) per element in the array.
        // Each array element has a list of properties that will become 
        // td elements (Table Data, a cell) in the HTML table. 
        var tableBody = document.createElement("tbody");
        table.appendChild(tableBody);

        // To the tbody, add one row (to HTML table) per object in the object list.
        // To each row, add a td element (Table Data, a cell) that holds the object's 
        // property values. 
        for (var i in list) {
            if (isToShow(list[i], filter)) {
                var tableRow = document.createElement("tr");
                tableBody.appendChild(tableRow);

                // create one table data <td> content matching the property name
                var obj = list[i];
                for (var prop in obj) {

                    // **** THE ONLY CHANGE IS HERE ****
                    // obj[prop] should already hold a "td" tag
                    tableRow.appendChild(obj[prop]);
                    // **** END OF THE CHANGE       ****
                }
            }
        }
    } // addTableBody



    // **** ENTRY POINT ****

    // Create a container to hold the title (heading) and the HTML table
    var container = document.createElement("div");
    container.classList.add("clickSort");

    var heading1 = document.createElement("h1");
    heading1.innerHTML = "";
    container.appendChild(heading1);

    // Add a heading (for the title) and add that to the container
    var heading = document.createElement("h1");
    heading.innerHTML = title;
    container.appendChild(heading);


    var searchDiv = document.createElement("div");
    container.appendChild(searchDiv);
    searchDiv.innerHTML = "<strong>Filter by:</strong> ";

    // Create a filter text box for user input and append it.
    var searchInput = document.createElement("input");
    searchDiv.appendChild(searchInput);

    var spacer = document.createElement("p");
    searchDiv.appendChild(spacer);


    // Create a new HTML table tag (DOM object) and add that to the container.
    var newTable = document.createElement("table");
    container.appendChild(newTable);

    // To the HTML table, add a tr element to hold the headings of our table.
    var headerRow = document.createElement("tr");
    newTable.appendChild(headerRow);

    // ADD one column heading per property in the object list.
    var obj = objList[0];
    for (var propName in obj) {
        var headingCell = document.createElement("th");

        // underscores in the property name will be replaced by space in the column headings.
        headingText = propName.replace("_", " ");

        // if a property name starts with underscore then we assume that column should not 
        // be click sortable (may be it is an image column or something). 
        if (propName[0] !== "_") {
            headingText = "<img src='" + sortIcon + "'/> " + headingText;
            headingCell.sortPropName = propName;
            headingCell.forward = direction;
            headingCell.onclick = function () {
                sortOrderPropName = this.sortPropName;
                console.log("WILL SORT ON " + sortOrderPropName);
                if (this.forward) {
                    this.forward = false;
                } else {
                    this.forward = true;
                }
                direction = this.forward;
                console.log("Forward?: " + direction);
                addTableBody(newTable, objList, sortOrderPropName, direction, searchInput.value);
            };

        }
        headingCell.innerHTML = headingText;
        headerRow.appendChild(headingCell);
    }

    // After sorting objList by sortOrderPropName, create or replace the tbody 
    // populated with data from the sorted objList.
    addTableBody(newTable, objList, sortOrderPropName, direction, "");

    searchInput.onkeyup = function () {
        console.log("search filter changed to " + searchInput.value);
        addTableBody(newTable, objList, sortOrderPropName, direction, searchInput.value);
    };

    return container;

}  // MakeTableBetter