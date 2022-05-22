/**
 * Modified from : https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript-powerset-of-array
 * @returns all subsets of array that have length <= maxSize
 */
function getSizedSubsets (array, maxSize) { 
    return array.reduce(
            (subsets, value) => subsets.concat(
            subsets.filter(subset => subset.length < maxSize).map(set => [value,...set])
            ),
            [[]]
        );
}

console.log(getSizedSubsets([1,2,3,4,5,6],3));


