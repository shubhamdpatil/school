import { getRandomIntInclusive } from '../utils/Random'
import { randomNumber, randomNumberSmallerThan } from './Utils';

export default class Division {

    constructor(digits, size) {
        this.formattedOperands = [];

        this.dividend = 0;
        this.divisor = 0;
        this.quotent = 0;
        this.remainder = 0;

        this.divideSum(digits, size);
        this.answerCorrect = false;
        this.attemptedAnswer = null;
       // this.log();
    }

    log() {
        console.log('dividend: ' + this.dividend.toString() + ' divisor: '
            + this.divisor + 'quotent: ' + this.quotent +
            ' remainder: ' + this.remainder);
    }

    divideSum(digits, size) {
        this.dividend = randomNumber(digits);
        this.divisor = randomNumberSmallerThan(this.dividend);
        this.dividend = 8640;
        this.divisor = 15;
        this.divide();
    }

    divide() {
        this.quotent = Math.floor(this.dividend / this.divisor)
        this.remainder = this.dividend % this.divisor;
    }

    checkAnswer(quotent, remainder) {
        this.answerCorrect = this.quotent === quotent && this.remainder === remainder;
        return this.answerCorrect;
    }
}
