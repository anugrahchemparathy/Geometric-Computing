//const Point = require('./Point.js');
//const utils = require('./utils.js');




/**
 * Function to find and return the closest pair of a points 
 * given that all points have unique X,Y coordinates
 * @param {*} points an array of length > 1 of Point objects
 * @returns an ordered pair array of Point object
 */
function closestPair(Points) {    
    const PointsX = [...Points].sort((p1,p2) => p1.X - p2.X);
    const PointsY = [...Points].sort((p1,p2) => p1.Y - p2.Y);

    if (Points.length < 2) throw new Error('Points should contain at least two points');
    for (let i = 0; i < Points.length; i++){
        if(PointsX[i] === PointsX[i+1]) throw new Error('X coordinates should be unique');
        if(PointsY[i] === PointsY[i+1]) throw new Error('Y coordinates should be unique');
    }
    
    const [bestDist,[p1,p2]] = closestPairRecurse(PointsX,PointsY);
}
/**
 * Helper function to implement recursion
 * @param {*} PointsX sorted array of Point objects by X coordinate
 * @param {*} PointsY sorted array of Point objects by Y coordinate
 * @returns an array [dist, ordered pair] containing the shortest distance in the input arrays and the corresponding pair of points
 */
function closestPairRecurse(PointsX,PointsY){
    stringPoints = PointsX.map(p=>p.toString());
    const numPoints = PointsX.length;
    console.log("recursing on PointsX", stringPoints);
    console.log("numPoints =", numPoints);

    if (numPoints == 1) return([Number.POSITIVE_INFINITY,undefined]);
    else if (numPoints == 2) return([utils.distance(PointsX[0],PointsX[1]),PointsX]);

    const medianIndex = Math.floor(numPoints/2);
    const splitX = PointsX[medianIndex].X;

    const leftPointsX = PointsX.slice(0,medianIndex);
    const rightPointsX = PointsX.slice(medianIndex);
    const leftPointsY = PointsY.filter(p => p.X < splitX);
    const rightPointsY = PointsY.filter(p => p.X >= splitX);
    
    const [leftDist, leftClosest] = closestPairRecurse(leftPointsX,leftPointsY);
    const [rightDist, rightClosest] = closestPairRecurse(rightPointsX,rightPointsY);

    const searchDist = Math.min(leftDist,rightDist);
    let bestPair = leftDist < rightDist ? leftClosest : rightClosest;
    let bestDist = searchDist;

    const middleStrip = PointsY.filter(p => Math.abs(splitX - p.X) <= searchDist);

    for (let i = 0; i < middleStrip.length; i++){
        const p1 = middleStrip[i];
        for(let j = i+1; j < middleStrip.length; j++){
            const p2 = middleStrip[j]
            if (p2.Y - p1.X > searchDist) break;

            if (utils.distance(p1,p2) < bestDist){
                bestDist = utils.distance(p1,p2);
                bestPair = [p1,p2];
            }
        }
    }
    return [bestDist,bestPair];

}

const myPoints = [new Point.Point(1,1), new Point.Point(2,2), new Point.Point(3,3), new Point.Point(4,2.1)];

closestPair(myPoints);