import { NUMBER_RANGE, getRandomIntInclusive } from '../utils/Random'


let sums = [{
    index: 1,
    inputs: 4,
    problem: {
        steps: [
            {
                type: 'carryover',
                value: 'xxx'
            },
            {
                type: 'number',
                value: '123'
            },
            {
                type: 'number',
                operation: '+',
                value: '498'
            },
            {
                type: 'number',
                operation: '+',
                value: '888'
            },
            {
                type: 'line'
            },
            {

                type: 'inputs',
                length: 5
            }
        ]
    },
    answer: {
        answer: 'x458',
        steps: [
            {
                type: 'carryover',
                value: '1x3'
            },
            {
                type: 'number',
                value: '123'
            },
            {
                type: 'number',
                operation: '+',
                value: '498'
            },
            {
                type: 'number',
                operation: '+',
                value: '888'
            },
            {
                type: 'line'
            },
            {
                type: 'answer',
                value: 'x458'
            }
        ]
    }
}]

class Addition {

    constructor(rows, columns) {
        this.operands = [];
        for (let i = 0; i < rows; i++) {
            this.operands.push(getRandomIntInclusive(NUMBER_RANGE[columns].min, NUMBER_RANGE[columns].max))
        }
    }

    getOperands() {
        let operands = [...this.operands];
        operands[0].value = 'x' + operands[0].value;
        return operands;
    }

    sum(maxColumns) {
        const total = this.operands.reduce((sum, value) => {
            return sum + value;
        }, 0)
        let totalSting = total.toString().split('')
        totalSting = ('x').repeat(maxColumns - totalSting.length) + total.toString();
        return totalSting;
    }
}


function operands(rows, addition, steps) {
    for (let i = 0; i < rows; i++) {
        let operand = {}
        operand.type = 'number';
        if (i != 0) {
            operand.operation = '+';
        }
        operand.value = addition.operands[i]
        if (i == 0) {
            operand.value = 'x' + operand.value;
        }
        steps.push(operand);
    }
}

export default function getAdditionSum(rows, columns) {
    let addition = new Addition(rows, columns)
    let sum = {}
    sum.inputs = columns + 1;
    sum.problem = {}
    sum.problem.steps = [];

    sum.problem.steps.push({ type: 'line' });
    sum.problem.steps.push({ type: 'inputs' })
    sum.problem.steps = [];

    operands(rows, addition, sum.problem.steps);
    sum.problem.steps.push({ type: 'line' });
    sum.problem.steps.push({ type: 'inputs' });

    sum.answer = {}
    sum.answer.answer = addition.sum(sum.inputs);
    sum.answer.steps = [];
    operands(rows, addition, sum.answer.steps);
    sum.answer.steps.push({ type: 'line' });
    sum.answer.steps.push({ type: 'inputs' });
    sum.answer.steps.push({ type: 'answer', value: sum.answer.answer });
    return sum;
}