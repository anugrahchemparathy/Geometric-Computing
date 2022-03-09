const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const inputPoints = [];

canvas.width = window.innerWidth; //Math.min(window.innerWidth,window.innerHeight);
canvas.height = window.innerWidth;

window.addEventListener('resize', function () {
    canvas.width = Math.min(window.innerWidth,window.innerHeight);
    canvas.height = canvas.width;
});


let left_padding = canvas.width * 0.15;
let top_padding = canvas.width * 0.05;
let edge_length = canvas.width * 0.7;
let interior_padding = edge_length * 0.02;


/*
=================================================================
Drawable Point implementation
=================================================================
*/

class PointRep extends Point{
    constructor (X, Y, fill = false, radius = 10) {
        super(X,Y);
        this.fill = fill;
        this.radius = radius;
    }
    draw () {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        if (this.fill) {
            ctx.fillStyle = "aqua";
            ctx.fill();
        }
        else {
            ctx.fillStyle = "white";
            ctx.fill();
        }
        
    }
}

/*
=================================================================
Canvas Altering Functions
=================================================================
*/

function animate() {
    ctx.strokeStyle = "white";
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.strokeRect(left_padding, top_padding, edge_length, edge_length);

    for (const point of inputPoints){
        point.draw();
    }

};

function addPoint (canvas, event) {
    const cRect = canvas. getBoundingClientRect();

    let newPointX = event.clientX - cRect.left;
    let newPointY = event.clientY - cRect.top;
    
    if (newPointX < left_padding+interior_padding) return;
    else if (newPointX > left_padding+edge_length-interior_padding) return;

    if (newPointY < top_padding+interior_padding) return;
    else if (newPointY > top_padding+edge_length-interior_padding) return;


    for (const point of inputPoints){
        //all X and Y coordinates must be distinct
        if (point.X === newPointX || point.Y === newPointY) return;
    }
    for (const point of inputPoints){
        point.fill = false
    }

    inputPoints.push(new PointRep(newPointX,newPointY));

    console.log(inputPoints.map((p)=>p.toString()));
    console.log("X: "+event.clientX+", Y: "+event.clientY);

    if (inputPoints.length > 1){
        [bestDist,[p1,p2]] = closestPair(inputPoints);
        p1.fill = true;
        p2.fill = true;
    }

    animate();
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
ctx.strokeRect(left_padding, top_padding, edge_length, edge_length);
