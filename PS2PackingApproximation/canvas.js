const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 0.85 * window.innerWidth
canvas.height = Math.min(canvas.width, 0.7*window.innerHeight);

let showGrid = true;


let left_padding = canvas.width * 0.05;
let top_padding = canvas.height * 0.05;
let edge_length_vertical = canvas.height * 0.9;
let edge_length_horizontal = canvas.width * 0.9;
let interior_padding = edge_length_vertical * 0.02;
let unitRadius = edge_length_vertical/10; // arbitrarily define this to be the size of a single unit of measurement


// let subRadius = unitRadius / 2; // the radius of the subpoints
let gridWidth = 5;
let gridSpacing = unitRadius * gridWidth ; //the practical canvas spacing equal to 1 grid cell

const inputPoints = [];
let gridPoints = [[]]; // [r][c] => [list of points in this grid cell]
let packedPoints = [[]];


// console.log(`left_padding = ${left_padding}`);
// console.log(`top_padding = ${top_padding}`);
// console.log(`interior_padding = ${interior_padding}`);
// console.log(`unitRadius = ${unitRadius}`);

/*
=================================================================
Drawable Point implementation
=================================================================
*/

class PointRep extends Point{
    constructor (X, Y, radius = unitRadius) {
        super(X,Y);
        this.bordered = true;
        this.included = false;
        this.radius = radius;
    }
    draw () {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.radius, 0, 2 * Math.PI);
        if (this.bordered && showGrid) {
            ctx.stroke();
        }
        else {
            ctx.stroke();
            if (this.included) ctx.fillStyle = "cyan";
            else ctx.fillStyle = "white";
            ctx.fill();
        }
        ctx.closePath();
    }
}



/*
=================================================================
Canvas Altering Functions
=================================================================
*/

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showGrid) drawGrid(gridWidth);
    
    ctx.strokeStyle = "white";
    ctx.strokeRect(left_padding, top_padding, edge_length_horizontal, edge_length_vertical);

    for (const point of inputPoints){
        point.draw();
    }
    for (let r = 0; r * gridSpacing < edge_length_vertical; r++){
        for(let c = 0; c * gridSpacing < edge_length_horizontal; c++){
            for (const point of packedPoints[r][c]) point.draw();
        }
    }
    //console.log(gridPoints);
    //console.log(packedPoints);

};


/*
=================================================================
Miscellaneous Grid Stuff
=================================================================
*/


function drawGrid(k) {
    ctx.strokeStyle = "white";
    
    let gridSpacing = unitRadius * k; // by canvas dimensions
    for (let r = 1; r * gridSpacing < edge_length_vertical; r++){
        ctx.beginPath();
        ctx.moveTo(left_padding, top_padding + gridSpacing * r);
        ctx.lineTo(left_padding + edge_length_horizontal, top_padding + gridSpacing * r);
        ctx.stroke();
        ctx.closePath();
    }
    for (let c = 1; c * gridSpacing < edge_length_horizontal; c++){
        ctx.beginPath();
        ctx.moveTo(left_padding + gridSpacing * c, top_padding);
        ctx.lineTo(left_padding + gridSpacing * c, top_padding + edge_length_vertical);
        ctx.stroke();
        ctx.closePath();
    }
}

function resetGrid(k){
    clearPointFields(inputPoints);

    gridPoints = [];
    packedPoints = [];

    for (let r = 0; r * gridSpacing < edge_length_vertical; r++){
        gridLayer = []
        packedLayer = []
        for(let c = 0; c * gridSpacing < edge_length_horizontal; c++){
            gridLayer.push([]);
            packedLayer.push([]);

        }
        gridPoints.push(gridLayer);
        packedPoints.push(packedLayer);

    }

    for (const point of inputPoints){
        columnIndex = Math.floor((point.X - left_padding) / gridSpacing);
        rowIndex = Math.floor((point.Y - top_padding) / gridSpacing);

        if (point.X < left_padding + columnIndex * gridSpacing + unitRadius || point.X > left_padding + (columnIndex+1) * gridSpacing - unitRadius) continue;
        if (point.Y < top_padding + rowIndex * gridSpacing + unitRadius || point.Y > top_padding + (rowIndex+1) * gridSpacing - unitRadius) continue;

        point.bordered = false;
        let slot = gridPoints[rowIndex][columnIndex]
        slot.push(point);
    }

    for (let r = 0; r * gridSpacing < edge_length_vertical; r++){
        for(let c = 0; c * gridSpacing < edge_length_horizontal; c++){
            getSizedSubsetsRecursive(gridPoints[r][c], k ** 2, r, c, evaluationFunction = checkSubsetOverlap);
            for (const point of packedPoints[r][c]) point.included = true;
        }
    }

}

function adjustGrid(k, point){

    columnIndex = Math.floor((point.X - left_padding) / gridSpacing);
    rowIndex = Math.floor((point.Y - top_padding) / gridSpacing);

    if (point.X < left_padding + columnIndex * gridSpacing + unitRadius || point.X > left_padding + (columnIndex+1) * gridSpacing - unitRadius) return;
    if (point.Y < top_padding + rowIndex * gridSpacing + unitRadius || point.Y > top_padding + (rowIndex+1) * gridSpacing - unitRadius) return;

    point.bordered = false;
    let slot = gridPoints[rowIndex][columnIndex]
    slot.push(point);


    clearPointIncludedFields(packedPoints[rowIndex][columnIndex]);
    getSizedSubsetsRecursive(gridPoints[rowIndex][columnIndex], k ** 2, rowIndex, columnIndex, evaluationFunction = checkSubsetOverlap);
    for (const point of packedPoints[rowIndex][columnIndex]) point.included = true;
}

/*
=================================================================
Miscellaneous functions
=================================================================
*/

function addPoint (canvas, event) {
    const cRect = canvas. getBoundingClientRect();

    let newPointX = event.clientX - cRect.left;
    let newPointY = event.clientY - cRect.top;
    
    if (newPointX < left_padding+interior_padding) return;
    else if (newPointX > left_padding+edge_length_horizontal-interior_padding) return;

    if (newPointY < top_padding+interior_padding) return;
    else if (newPointY > top_padding+edge_length_vertical-interior_padding) return;


    for (const point of inputPoints){
        //all X and Y coordinates must be distinct
        if (point.X === newPointX && point.Y === newPointY) return;
    }

    const newPoint = new PointRep(newPointX,newPointY);

    inputPoints.push(newPoint);

    // console.log(inputPoints.map((p)=>p.toString()));
    // console.log("X: "+event.clientX+", Y: "+event.clientY);

    adjustGrid(gridWidth, newPoint);
    animate();
}


function clearPointFields(pointArray){
    for (const point of pointArray){
        point.bordered = true;
        point.included = false;
    }
}

function clearPointIncludedFields(pointArray){
    for (const point of pointArray){
        point.included = false;
    }
}



canvas.addEventListener('mousedown', function(e) {
    addPoint(canvas, e);
})


/*
=================================================================
General Setup
=================================================================
*/

var gridInput = document.getElementById("changeGrids");
window.onload = function() {
    gridInput.addEventListener("input", function() {
        if (gridInput.value > 0){
            gridWidth = gridInput.value;
            gridSpacing = gridWidth * unitRadius;

            resetGrid(gridWidth);
            animate();
        }
    });
}

ctx.strokeStyle = "white";
resetGrid(gridWidth);
animate();
