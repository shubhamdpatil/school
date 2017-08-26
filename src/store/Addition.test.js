
import Addition from './Addition'

describe('Addition Tests', () => {
    it('correct answer', () => {
        var addition = new Addition();
        let op1 = addition.operands[0];
        let op2 = addition.operands[1]
        let attemptedAnswer = op1 + op2;
        addition.checkAnswer(attemptedAnswer)
        expect(addition.answerCorrect).toEqual(true);
    });
    it('wrong answer', () => {
        var addition = new Addition();
        let op1 = addition.operands[0];
        let op2 = addition.operands[1];
        let attemptedAnswer = op1 + op2 + 1;
        addition.checkAnswer(attemptedAnswer)
        expect(addition.answerCorrect).toEqual(false);
    })
})