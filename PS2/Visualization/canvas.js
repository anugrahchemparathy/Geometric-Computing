var gridInput = document.getElementById("changeGrids");
window.onload = function() {
    gridInput.addEventListener("input", function() {
        console.log(gridInput.value);
        if (gridInput.value > 0){
            gridWidth = gridInput.value;
            animate();
        }
    });
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = Math.min(window.innerWidth,window.innerWidth);
canvas.height = Math.min(window.innerWidth,0.9*window.innerHeight);

window.addEventListener('resize', function () {
    canvas.width = Math.min(window.innerWidth,window.innerHeight);
    canvas.height = canvas.width;
});


let gridWidth = 10;
const inputPoints = [];
let gridPoints = new Map(); // (r,c) => [list of points in this grid cell]


let left_padding = canvas.height * 0.05;
let top_padding = canvas.height * 0.05;
let edge_length_vertical = canvas.height * 0.9;
let edge_length_horizontal = canvas.width * 0.9;
let interior_padding = edge_length_vertical * 0.02;
let unitRadius = edge_length_vertical/50; // arbitrarily define this to be the size of a single unit of measurement


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
        this.radius = radius;
    }
    draw () {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        if (this.bordered) {
            ctx.fillStyle = "aqua";
        }
        else {
            ctx.fillStyle = "white";
        }
        ctx.fill();
        
    }
}



/*
=================================================================
Canvas Altering Functions
=================================================================
*/

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawGrid(gridWidth);
    adjustGrid(gridWidth);

    ctx.strokeStyle = "white";
    ctx.strokeRect(left_padding, top_padding, edge_length_horizontal, edge_length_vertical);

    for (const point of inputPoints){
        point.draw();
    }

};

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
        if (point.X === newPointX || point.Y === newPointY) return;
    }

    inputPoints.push(new PointRep(newPointX,newPointY));

    console.log(inputPoints.map((p)=>p.toString()));
    console.log("X: "+event.clientX+", Y: "+event.clientY);

    animate();

}

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


function adjustGrid(k){
    for (const point of inputPoints) point.bordered = true;

    gridPoints = [];

    let gridSpacing = unitRadius * k; // by canvas dimensions
    for (let r = 0; r * gridSpacing < edge_length_vertical; r++){
        layer = []
        for(let c = 0; c * gridSpacing < edge_length_horizontal; c++){
            layer.push([]);
        }
        gridPoints.push(layer);
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

    
}


canvas.addEventListener('mousedown', function(e) {
    addPoint(canvas, e);
})


/*
=================================================================
General Setup
=================================================================
*/

ctx.strokeStyle = "white";
animate();
