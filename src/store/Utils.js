import { getRandomIntInclusive } from '../utils/Random'

export function getNumbers(digits, size) {
    let operands = [];
    let range = rangeForDigits(digits);
    for (let i = 0; i < size; i++) {
        operands.push(getRandomIntInclusive(range[0], range[1]))
    }
    return operands;
}

/* JSON.stringify = function (o, function(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
        }
        // Store value in our collection
        cache.push(value);
    }
    return value;
})
 */

export function randomNumber(digits) {
    let range = rangeForDigits(digits);
    let number = getRandomIntInclusive(range[0], range[1])
    return number;
}

export function randomNumberSmallerThan(max) {
    return getRandomIntInclusive(1, max);
}

function rangeForDigits(digits) {
    let result = [];
    for (let i = 0; i < digits; i++) {
        i === 0 ? result[0] = '1' : result[0] += '0';
        i === 0 ? result[1] = '9' : result[1] += '9';
    }
    return result;
}

