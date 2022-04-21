var output, fileInput, file, xml;
const parser = new DOMParser();
const reader = new FileReader();

function path() {
    fileInput = document.getElementById('inputFile');
    file = fileInput.files[0];
    console.log(file);

    output = document.getElementById('output');

    reader.addEventListener("load", () => {
        //output.innerText = reader.result; //show xml in output div        
        xml = parser.parseFromString(reader.result, "application/xml");
        //console.log(xml);
        buildSurfaceList(xml);
    }, false);
    if (file) {
        reader.readAsText(file);
    }
}


// ---------------------------------------------------------------------------- //

const surfaceList = [];
const openingList = [];

function buildSurfaceList(x) {

    let tag = x.getElementsByTagName('Surface');

    //## get table
    // let sftable=document.getElementById("surfacesTable");

    for (let i = 0; i < tag.length; i++) {
        let surface = {};

        //### TABLE ROW ###
        let li = document.createElement('li');
        // let row =sftable.insertRow(i); //a row for each surface in xml


        let list = document.getElementById('surfaces');

        surface.type = tag[i].getAttribute('surfaceType');
        surface.exposed = tag[i].getAttribute('exposedToSun');
        surface.Id = tag[i].getAttribute('id');
        
        //surfaces
        for (let j = 0; j < tag[i].childNodes.length; j++) {
            if (tag[i].childNodes[j].nextElementSibling != null || tag[i].childNodes[j].nodeName != '#text') {
                if (tag[i].childNodes[j].nodeName == 'Name') {
                    surface.name = tag[i].childNodes[j].innerHTML; 
                }
                if (tag[i].childNodes[j].nodeName == 'AdjacentSpaceId') {
                    surface.adjSpaceID = tag[i].childNodes[j].getAttribute('spaceIdRef');
                }
                if (tag[i].childNodes[j].nodeName == 'RectangularGeometry') {
                    surface.rectGeomID = tag[i].childNodes[j].getAttribute('id');
                    surface.azimuth = tag[i].childNodes[j].getElementsByTagName('Azimuth')[0].innerHTML;
                    surface.tilt = tag[i].childNodes[j].getElementsByTagName('Tilt')[0].innerHTML;
                    surface.width = tag[i].childNodes[j].getElementsByTagName('Width')[0].innerHTML;
                    surface.height = tag[i].childNodes[j].getElementsByTagName('Height')[0].innerHTML;
                    surface.area = Number(surface.width) * Number(surface.height);
                }
                
                if (tag[i].childNodes[j].nodeName == 'CADObjectId') {                    
                    surface.CADObjID = tag[i].childNodes[j].innerHTML;                    
                }
                
            }
            
        }
    
        surfaceList.push(surface);
        
        //openings
        for (let j = 0; j < tag[i].childNodes.length; j++) {
            if (tag[i].childNodes[j].nextElementSibling != null || tag[i].childNodes[j].nodeName != '#text') {
                
                if (tag[i].childNodes[j].nodeName == 'Opening') {
                    let opening = {};
                    if(tag[i].childNodes[j].getAttribute('openingType')!='Air'){
                        opening.type = tag[i].childNodes[j].getAttribute('openingType');
                        opening.name = tag[i].childNodes[j].getElementsByTagName('Name')[0].innerHTML;
                        opening.Id = tag[i].childNodes[j].getAttribute('id');
                        opening.width = tag[i].childNodes[j].getElementsByTagName('Width')[0].innerHTML;
                        opening.height = tag[i].childNodes[j].getElementsByTagName('Height')[0].innerHTML;
                        opening.area = Number(opening.width) * Number(opening.height);
                        opening.CADObjID = tag[i].childNodes[j].getElementsByTagName('CADObjectId')[0].innerHTML;
                        
                        
                    }
                    else{
                        opening.type = tag[i].childNodes[j].getAttribute('openingType');
                        opening.name = tag[i].childNodes[j].getElementsByTagName('Name')[0].innerHTML;
                        opening.Id = tag[i].childNodes[j].getAttribute('id');
                        opening.width = tag[i].childNodes[j].getElementsByTagName('Width')[0].innerHTML;
                        opening.height = tag[i].childNodes[j].getElementsByTagName('Height')[0].innerHTML;
                        opening.area = Number(opening.width) * Number(opening.height);
                        opening.CADObjID = 'undefined';
                        
                        
                    }                  

                    openingList.push(opening); 
                }
            }
        }
        
        //### TABLE ROW ###
        li.textContent = `${surface.type} - ${surface.exposed} - ${surface.Id} - ${surface.adjSpaceID} - ${surface.rectGeomID} - ${surface.azimuth} - ${surface.tilt} - ${surface.area} - ${surface.CADObjID} - ${surface.name}`;
        list.appendChild(li);
    }
    console.log(surfaceList);
    console.log(openingList);
    console.log(Object.keys(surfaceList[0]));
    createTable(surfaceList, "surfacesTable");
    createTable(openingList, "openingsTable");
    // connect();
}

function createTable(data, tableName) {
    let sftable = document.getElementById(tableName);
    for (let i = 0; i < data.length; i++) {
        let row = sftable.insertRow(i); //a row for each surface in xml
        for (let j = 0; j < Object.keys(data[0]).length+1; j++) {
            let cell = row.insertCell(j);
            cell.innerHTML = Object.values(data[i])[j];            
        }

    }
    

}



