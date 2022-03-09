const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const inputPoints = [];

canvas.width = Math.min(window.innerWidth,0.8*window.innerHeight);
canvas.height = Math.min(window.innerWidth,0.8*window.innerHeight);

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
    constructor (X, Y, closest = false, radius = 10) {
        super(X,Y);
        this.closest = closest;
        this.radius = radius;
    }
    draw () {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        if (this.closest) {
            ctx.fillStyle = "aqua";
        }
        else if (this.recursiveClosest){
            ctx.fillStyle = 'rgba(118, 165, 173,0.75)'
        }
        else {
            ctx.fillStyle = "white";
        }
        ctx.fill();
        
    }
}

class recursionSplitLine {
    splitX;
    searchWidth;

    setValues(splitX,searchWidth){
        this.splitX = splitX;
        this.searchWidth = searchWidth;
    }
    draw () {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.rect(splitX-this.searchWidth, top_padding, 2*this.searchWidth, edge_length);
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.moveTo(splitX, top_padding);
        ctx.lineTo(splitX, top_padding + edge_length);
        ctx.stroke();
        ctx.closePath();
    }
}


const vis = new recursionSplitLine();
let showSearchRange = false;
let showLeftRightClosest = false;

/*
=================================================================
Canvas Altering Functions
=================================================================
*/

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const point of inputPoints){
        point.closest = false;
        point.recursiveClosest = false;
    }

    if (inputPoints.length > 1){
        if (inputPoints.length > 2){
            console.log("output = ", closestPair(inputPoints));
            [bestDist,[p1,p2],splitX,searchDist,leftClosest,rightClosest] = closestPair(inputPoints);
            
            recursiveClosest = []
            for (const side of [leftClosest,rightClosest]){
                if(side !== undefined) {
                    recursiveClosest.push(side[0]);
                    recursiveClosest.push(side[1]);
                }
            }
            
            if (showSearchRange){
                console.log("showing vis",splitX,searchDist)
                vis.setValues(splitX,searchDist);
                vis.draw();
            }
            if (showLeftRightClosest){
                for (const point of recursiveClosest){
                    point.recursiveClosest = true;
                }
            }
        }
        else {
            [bestDist,[p1,p2]] = closestPair(inputPoints);
        }
        p1.closest = true;
        p2.closest = true;
    }

    ctx.strokeStyle = "white";

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

    inputPoints.push(new PointRep(newPointX,newPointY));

    console.log(inputPoints.map((p)=>p.toString()));
    console.log("X: "+event.clientX+", Y: "+event.clientY);

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
