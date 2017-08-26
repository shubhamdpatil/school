
import { getRandomIntInclusive } from '../utils/Random'

export default class Addition {

    constructor(digits, size, operation) {
        /*  if (addition) {
             this.addSum(digits, size);
         } else {
             this.subtractSum(digits, size);
         } */
        //this.subtractSum(digits, size);
        this.formattedOperands = [];
        if (operation == 'addition') {
            this.addSum(digits, size);
        } else if (operation == 'subtraction') {
            this.subtractSum(digits, size);
        } else {
            console.log('unknown operation');
        }
        this.operation = operation;
        this.answerCorrect = false;
        this.attemptedAnswer = null;
    }


    addSignToOperands(digits, size, sign = '+') {
        for (let i = 0; i < this.operands.length; i++) {
            let s = this.operands[i].toString();
            if (s.length < digits) {
                for (let j = 0; j < digits - s.length; j++) {
                    s = ' '.repeat(1) + s;
                }
            }
            i == 0 ? s = ' '.repeat(1) + s : s = sign + s.toString();
            this.formattedOperands.push(s);
            // this.operands[i] = s;
        }
        let s = this.answer.toString();
        if (s.length < digits) {
            s = ' '.repeat(1) + s;
        }
        this.formattedAnswer = s.toString().split('');;
    }

    log() {
        for (let i = 0; i < this.operands.length; i++) {
            console.log(this.operands[i])
        }
    }

    addSum(digits, size) {
        this.getNumbersForAddition(digits, size);
        this.addSignToOperands(digits, size);
    }

    getNumbersForAddition(digits, size) {
        this.operands = [];
        let range = this.rangeForDigits(digits);
        for (let i = 0; i < size; i++) {
            this.operands.push(getRandomIntInclusive(range[0], range[1]))
        }
        this.answer = this.sum();
    }

    subtractSum(digits, size) {
        this.getNumbersForAddition(digits, size)
        let answer_ = this.answer;
        this.answer = this.operands[0];
        this.operands[0] = answer_;

        let operand1 = this.operands[0].toString().split('');;
        this.addSignToOperands(operand1.length, size, '-');
    }

    rangeForDigits(digits) {
        let result = [];
        for (let i = 0; i < digits; i++) {
            i === 0 ? result[0] = '1' : result[0] += '0';
            i === 0 ? result[1] = '9' : result[1] += '9';
        }
        return result;
    }

    checkAnswer(answer) {
        this.attemptedAnswer = answer;
        this.answerCorrect = this.attemptedAnswer === this.answer;
        return this.answerCorrect;
    }

    sum() {
        let total = this.operands.reduce((sum, value) => {
            return sum + value;
        }, 0)
        return total;
    }
}
