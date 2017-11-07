
export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

export function getRandomExcluding(min, max, exclude) {
    let number;
    do {
        number = getRandomIntInclusive(min, max);
    } while (exclude === number)
    return number;
}

export const NUMBER_RANGE = {
    1: {
        min: 1,
        max: 9
    },
    2: {
        min: 10,
        max: 99
    },
    3: {
        min: 100,
        max: 999
    },
    4: {
        min: 1000,
        max: 9999
    },
    5:
    {
        min: 10000,
        max: 99999
    },
    6: {
        min: 100000,
        max: 999999
    }
}

//export default getRandomIntInclusive;