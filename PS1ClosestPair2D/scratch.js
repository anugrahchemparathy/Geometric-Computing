class Point {
    constructor(x,y){
        this.X = x;
        this.Y = y;
    }
    distance(other){
        return ((this.X-other.X)**2 + (this.Y-other.Y)**2)**0.5
    }
}


/**
 * Function to find and return the closest pair of a points
 * @param {*} points an array of Point objects
 * @returns an ordered pair array of Point object
 */

function closestPair(Points) {
    
    const PointsX = Points.sort((p1,p2) => p1.X - p2.X);
    const PointsY = Points.sort((p1,p2) => p1.Y - p2.Y);
    
    closestPairRecurse(PointsX,PointsY);


}
/**
 * Helper function to implement recursion
 * @param {*} PointsX sorted array of Point objects by X coordinate
 * @param {*} PointsY sorted array of Point objects by Y coordinate
 * @returns an array [dist, ordered pair] containing the shortest distance in the input arrays and the corresponding pair of points
 */
function closestPairRecurse(PointsX,PointsY){
    const numPoints = PointsX.size;

    if (numPoints == 1) return([Number.POSITIVE_INFINITY,undefined]);
    else if (numPoints == 2) return([PointsX[0].distance(PointsX[1]),PointsX]);


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

    for (let i = 0; i < middleStrip.size; i++){
        const p1 = middleStrip[i];
        for(let j = i+1; j < middleStrip.size; j++){
            const p2 = middleStrip[j]
            if (p2.Y - p1.X > searchDist) break;

            if (p1.distance(p2) < bestDist){
                bestDist = p1.distance(p2);
                bestPair = [p1,p2];
            }
        }
    }
    return bestPair;




    

}

myPoints = [new Point(1,1), new Point(2,2), new Point(3,3), new Point(4,2)];