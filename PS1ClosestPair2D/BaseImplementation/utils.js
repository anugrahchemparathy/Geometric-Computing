/**
 * Helper Function to compute distance between two 2D points
 * @param {*} p1 the first point
 * @param {*} p2 the second point
 * @returns the euclidean distance
 */
export function distance (p1,p2){
    return ((p1.X-p2.X)**2 + (p1.Y-p2.Y)**2)**0.5
}


