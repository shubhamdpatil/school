//import { getRandomIntInclusive, getRandomExcluding } from './Random'

const expect = require('chai').expect;
const math = require('mathjs');

export function getEqualFractions(max) {
    const generator = new FractionGenerator(max);
    return generator.getEqualFractions();
}

export function getUnEqualFractions(max) {
    const generator = new FractionGenerator(max);
    return generator.getUnEqualFractions();
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


class FractionGenerator {
    constructor(max) {
        this.max = max;
        this.array = [];
        this.generateArray();
    }

    generateArray() {
        for (let i = 1; i <= this.max; i++) {
            this.array.push([]);
            for (let j = 1; j <= i; j++) {
                this.array[this.array.length - 1].push(j / i);
            }
        }
    }

    getEqualFractions() {
        // get first fraction denominator
        const firstDenominator = getRandomIntInclusive(1, this.max / 2);
        // get first fraction numerator
        const firstNumerator = getRandomIntInclusive(1, firstDenominator);
        //   console.log(`first fraction: ${firstNumerator}/${firstDenominator}`);
        const secondDenominator = firstDenominator * getRandomIntInclusive(2, this.max / firstDenominator);
        const secondNumerator = firstNumerator * (secondDenominator / firstDenominator);
        //  console.log(`second fraction: ${secondNumerator}/${secondDenominator}`);
        expect(firstNumerator / firstDenominator).to.equal(secondNumerator / secondDenominator);
        return [[firstNumerator, firstDenominator], [secondNumerator, secondDenominator]];
        //return [[1, 2], [1, 16]];
    }

    exchangeFraction(fraction) {
        let temp = fraction.firstNumerator;
        fraction.firstNumerator = fraction.secondNumerator;
        fraction.secondNumerator = temp;

        temp = fraction.firstDenominator;
        fraction.firstDenominator = fraction.secondDenominator;
        fraction.secondDenominator = temp;
    }

    getUnEqualFractions() {
        // get first fraction denominator
        let fractions = {}

        fractions.firstDenominator = getRandomIntInclusive(1, this.max / 2);
        // get first fraction numerator
        fractions.firstNumerator = getRandomIntInclusive(1, fractions.firstDenominator);
        fractions.secondDenominator = fractions.firstDenominator * getRandomIntInclusive(2, this.max / fractions.firstDenominator);
        console.log(' fractions 1 ' + JSON.stringify(fractions))

        fractions.secondNumerator = fractions.firstNumerator * getRandomIntInclusive(1,
            fractions.secondDenominator / fractions.firstDenominator - 1);
        console.log(' fractions 2 ' + JSON.stringify(fractions))

        expect(fractions.firstNumerator / fractions.firstDenominator).to.not.equal(
            fractions.secondNumerator / fractions.secondDenominator);
        const exchangeFractions = getRandomIntInclusive(0, 1);
        if (exchangeFractions) {
            this.exchangeFraction(fractions);
        }

        const lcm = math.lcm(fractions.firstDenominator, fractions.secondDenominator)
        const firstFractionMultiple = lcm / fractions.firstDenominator;
        const secondractionMultiple = lcm / fractions.secondDenominator;
        console.log(' fractions 3 ' + JSON.stringify(fractions))

        return [[fractions.firstNumerator, fractions.firstDenominator], [fractions.secondNumerator, fractions.secondDenominator],
        [fractions.firstNumerator * firstFractionMultiple, fractions.firstDenominator * firstFractionMultiple],
        [fractions.secondNumerator * secondractionMultiple, fractions.secondDenominator * secondractionMultiple]];
    }
}
