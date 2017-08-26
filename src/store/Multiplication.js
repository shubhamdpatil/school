
import { getRandomIntInclusive } from '../utils/Random'
import { getNumbers } from './Utils';


export default class Multiplication {

    constructor(digits, size) {

        this.formattedOperands = [];
        this.multiplySum(digits, size);
        this.answerCorrect = false;
        this.attemptedAnswer = null;
        //this.log();
    }

    log() {
        for (let i = 0; i < this.operands.length; i++) {
            console.log(this.operands[i])
        }
        console.log('answer ' + this.answer)
    }

    multiplySum(digits, size) {
        this.operands = getNumbers(digits, size);
        this.multiply();
    }

    multiply() {
        this.answer = Math.imul(this.operands[0], this.operands[1])
    }
   
    checkAnswer(answer) {
        this.attemptedAnswer = answer;
        this.answerCorrect = this.attemptedAnswer === this.answer;
        return this.answerCorrect;
    }
}
