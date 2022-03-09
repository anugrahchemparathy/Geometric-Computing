const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const inputPoints = [];

canvas.width = window.innerWidth; //Math.min(window.innerWidth,window.innerHeight);
canvas.height = window.innerHeight;

window.addEventListener('resize', function () {
    canvas.width = Math.min(window.innerWidth,window.innerHeight);
    canvas.height = canvas.width;
});

let mouse = {x: 150, y: 150};
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
            ctx.fillStyle = "red";
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
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.strokeRect(left_padding, top_padding, edge_length, edge_length);

    for (const point of inputPoints){
        //console.log("tried drawing point", point.toString());
        point.draw();
    }

};

function addPoint (canvas, event) {
    const cRect = canvas. getBoundingClientRect();

    let temp_x = Math.round(event.clientX - cRect.left); // Subtract the 'left' of the canvas 
    let temp_y = Math.round(event.clientY - cRect.top); // from the X/Y positions to make 
    
    if (temp_x < left_padding+interior_padding) return;
    else if (temp_x > left_padding+edge_length-interior_padding) return;

    if (temp_y < top_padding+interior_padding) return;
    else if (temp_y > top_padding+edge_length-interior_padding) return;

    mouse.x = temp_x;
    mouse.y = temp_y; 
    inputPoints.push(new PointRep(mouse.x,mouse.y));
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

ctx.strokeRect(left_padding, top_padding, edge_length, edge_length);
