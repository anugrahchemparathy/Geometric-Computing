/**
 * Unused function, but a little easier to read/follow than the recursive version, but conversely much more inefficient
 * Modified from : https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript-powerset-of-array
 * @returns all subsets of array that have length <= maxSize
 */
function getSizedSubsets (sourceArray, maxSize) { 
    return sourceArray.reduce(
            (subsets, value) => subsets.concat(
            subsets.filter(subset => subset.length < maxSize).map(set => [value,...set])
            ),
            [[]]
        );
}

//console.log(getSizedSubsets([1,2,3,4,5,6],3));

/**
 * Function to apply an evaluationFunction on all subsets of a function (which we generate recursively)
 * @param {*} index the index of the highest location element we have already put in the subset
 * @param {*} evaluationFunction 
 */
function getSizedSubsetsRecursive (sourceArray, maxSize, r, c, evaluationFunction, holdingArray = [], index = 0) { 
    // console.log(`holding array = ${holdingArray} index = ${index}`);
    if (holdingArray.length < maxSize){
        for (let i = index; i < sourceArray.length; i++){
            holdingArray.push(sourceArray[i]);
            getSizedSubsetsRecursive(sourceArray, maxSize, r, c, evaluationFunction, holdingArray, i+1);
            holdingArray.pop();
        }
    }
    //apply whatever function you want to this subset
    //console.log(holdingArray);
    if (holdingArray.length > packedPoints[r][c].length && evaluationFunction(holdingArray)){
        console.log(`change! holdingArray = ${holdingArray} r = ${r} c = ${c}`);
        packedPoints[r][c] = [...holdingArray];
    }
}

function checkSubsetOverlap(subset) {
    for (let i = 0; i < subset.length; i++){
        for (let j = i+1; j < subset.length; j++){
            if (pointDistance(subset[i], subset[j]) < 2 * unitRadius) return false;
            console.log(pointDistance(subset[i], subset[j]), unitRadius);
        }
    }
    return true;
}

function pointDistance(point1, point2){
    return ((point1.X - point2.X) ** 2 + (point1.Y - point2.Y) ** 2 ) ** 0.5 ;
}

//getSizedSubsetsRecursive([1,2,3,4,5,6],3);