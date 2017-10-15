
import React, { Component } from 'react';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import { getRandomIntInclusive, NUMBER_RANGE } from './../utils/Random'
import { cloneDeep } from 'lodash';
import Arrow from './../utils/Arrow';

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

class Div extends Component {
    constructor(props) {
        super(props);
        this.HALF_BIG_FONT_HEIGHT = 15;
        this.BIG_FONT_HEIGHT = '30px'
        this.SMALL_FONT_HEIGHT = '20px'
        this.CARRYOVER_HEIGHT = 30;
        this.LINE_HEIGHT = 0;
        this.INPUT_HEIGHT = 80;
        this.LETTER_WIDTH = 20;
        this.TEXT_HEIGHT = 30
        this.Y_START = 30;
        this.X_START = 0;
        this.showAnswer = false;
        this.lineKey = 0;
        this.colors = ['YellowGreen',
            'Violet',
            'Tomato',
            'RoyalBlue',
            'GoldenRod',
            'DarkCyan',
            'DarkOrchid',
            'IndianRed',
            'ForestGreen',
            'OrangeRed',
            'OliveDrab'];
        this.formDivisionOperation();
    }

    setDimension() {
        for (let i = 0; i <= this.answers.length; i++) {
            const el = findDOMNode(this.refs['sum' + i]);
            if (el) {
                const bbox = el.getBBox();
                el.setAttributeNS(null, 'width', bbox.width + 40)
                el.setAttributeNS(null, 'height', bbox.height + 20)
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.setDimension();
    }

    componentDidMount() {
        this.setDimension();
    }

    getDivisionSteps(dividend, divisor, remainder, result) {
        let dividendN = +dividend, divisorN = +divisor, remainderN = +remainder;
        if (dividend.length === 0) {
            return;
        }
        let quotent, quotentN;
        let newDividendN = +(remainder + dividend[0]);
        if (newDividendN < divisorN) {
            quotent = '0';
            quotentN = 0;
        } else {
            quotent = Math.floor(+newDividendN / divisorN).toString();
            quotentN = Math.floor(+newDividendN / divisorN);
        }
        let newRemainder = newDividendN % divisorN;
        let operand1 = newDividendN.toString();
        let operand2 = (quotentN * divisor).toString();
        operand2 = '0'.repeat(operand1.length - operand2.length) + operand2;

        if (result.length > 0) {
            quotent = result[result.length - 1].quotent + quotent;
        }
        result.push({
            quotent: quotent, remainder: newRemainder.toString(), operand1: operand1,
            operand2: operand2
        });

        if (dividend.length > 1) {
            this.getDivisionSteps(dividend.slice(1), divisor, newRemainder, result)
        }
    }


    formDivisionOperation() {
        this.Y = this.Y_START;
        this.X = this.X_START;
        this.dividend = getRandomIntInclusive(NUMBER_RANGE[4].min, NUMBER_RANGE[4].max).toString();
        this.divisor = getRandomIntInclusive(11, 20).toString();
       // this.dividend = '864512'//randomNumber(parseInt(this.props.dividend)).toString();
        //this.divisor = '34'//randomNumber(parseInt(this.props.divisor)).toString();
        this.result = [];
        this.getDivisionSteps(this.dividend, this.divisor, '', this.result);
        this.dividend = this.dividend.toString().split('').map((e) => (+e))
        this.divisor = this.divisor.toString().split('').map((e) => (+e))
        this.quotent = 'x'.split('').map((e) => (e));
        this.answers = [];
        this.displayProblem();
        this.displayAnswer();
    }

    problemLine(digits, start, y, color) {
        const xStart = this.LETTER_WIDTH + start * this.LETTER_WIDTH
        let texts = digits.map((e, i) => {
            const visibility = e === 'x' ? 'hidden' : 'visible';
            const fill = color && i == digits.length - 1 ? color : 'black';
            return <text key={i} x={xStart + i * this.LETTER_WIDTH} y={y} style={{
                fill: fill, textAnchor: 'middle', fontWeight: 'normal', fontSize: this.BIG_FONT_HEIGHT, visibility: visibility
            }}>{e} </text>
        });
        return <g key={this.lineKey++}> {texts} </g>
    }

    line(l) {
        this.Y += 10;
        const y = this.Y;
        const x1 = l.x1 * this.LETTER_WIDTH - this.LETTER_WIDTH / 2;
        const x2 = x1 + l.length * this.LETTER_WIDTH;
        return (<line key={this.lineKey++} x1={x1} y1={y} x2={x2} y2={y} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />)
    }

    verticalLine(x) {
        let y = this.Y;
        const x1 = x * this.LETTER_WIDTH;
        return (<line key={this.lineKey++} x1={x1} y1={y} x2={x1} y2={y + this.TEXT_HEIGHT} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />)
    }

    displayProblem() {
        this.problem = {};
        this.problem.textlines = [];
        this.problem.textlines.push({
            type: 'raw', element: this.problemLine(this.quotent, this.divisor.length + 1, this.Y)
        });
        this.problem.textlines.push({ type: 'raw', element: this.line({ x1: this.divisor.length + 1.5, length: this.dividend.length + 0.5}) });
        this.problem.textlines.push({ type: 'raw', element: this.verticalLine(this.divisor.length + 1) });
        this.Y += 30;
        this.problem.textlines.push({ type: 'raw', element: this.problemLine(this.divisor, 0, this.Y) });
        this.problem.textlines.push({ type: 'raw', element: this.problemLine(this.dividend, this.divisor.length + 1, this.Y) });
        this.answerY = this.Y;
    }

    minus(x, y) {
        return (<g>
            <line x1={x} y1={y - 10} x2={x + 15} y2={y - 10} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />
        </g>)
    }

    textline(line) {
        this.Y += this.TEXT_HEIGHT;
        const y = this.Y;
        const xStart = (line.start - line.texts.length + 1) * this.LETTER_WIDTH;
        const operation = line.operation ? this.minus(xStart - 1.5 * this.LETTER_WIDTH, y) : null;
        const textsReversed = line.texts.slice(0).reverse();
        const fill = line.color ? line.color : 'black';
        let lastX;
        const texts = line.texts.map((e, i) => {
            lastX = xStart + i * this.LETTER_WIDTH;
            return <text key={i} x={lastX} y={y} style={{ fill: fill, fontSize: line.size, textAnchor: 'middle', visibility: e.text === 'x' ? 'hidden' : 'visible', fontWeight: e.weight ? e.weight : 'normal' }}>{e.text} </text>
        });
        let arrow = null;
        if (line.hasOwnProperty('arrow')) {
            arrow = <Arrow x1={lastX} y1={this.answerY + 5} x2={lastX} y2={y - 35} color={fill} />
        }
        return <g key={this.lineKey++}> {operation} {texts} {arrow} </g>
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
        }
        if (nextProps.new) {
            this.formDivisionOperation();
            this.showAnswer = false;
        }
    }

    newQuotent(answer, quotent, color) {
        answer.textlines.shift();
        answer.textlines.unshift({ type: 'raw', element: this.problemLine(quotent, this.divisor.length + 1, this.Y_START, this.colors[color]) });
    }

    replacePreviousRemainder(answer, operand, start, color) {
        answer.textlines.pop();
        const number = operand.split('').map((e) => (+e))
        const line = this.numberToTextline(number, start);
        line.color = color;
        line.arrow = true;
        answer.textlines.push(line);
    }

    addOperand(answer, operand, start, operation, color) {
        let number = operand.split('').map((e) => (+e))
        let line = this.numberToTextline(number, start);
        if (operation) {
            line.operation = '-';
        }
        line.color = color;
        answer.textlines.push(line);
    }

    removeColorAndArrow(textlines) {
        for (const l of textlines) {
            if (l.hasOwnProperty('color')) {
                delete l.color;
            }
            if (l.hasOwnProperty('arrow')) {
                delete l.arrow;
            }
        }
    }

    displayAnswer() {
        const y = this.Y;

        for (let i = 0; i < this.result.length; i++) {
            let answer;
            const quotent = this.result[i].quotent.split('').map((e) => (+e))
            const start = this.divisor.length + 2;
            if (i == 0) {
                answer = cloneDeep(this.problem);
                this.newQuotent(answer, quotent, i);
            }
            else {
                const previousAnswer = cloneDeep(this.answers[this.answers.length - 1]);
                this.removeColorAndArrow(previousAnswer.textlines);
                this.newQuotent(previousAnswer, quotent, i);
                this.replacePreviousRemainder(previousAnswer, this.result[i].operand1, start + i, this.colors[i]);
                answer = previousAnswer;
            }
            this.addOperand(answer, this.result[i].operand2, start + i, '-', this.colors[i]);
            answer.textlines.push({ type: 'line', x1: start + i - this.result[i].operand1.length + 1, length: this.result[i].operand1.length })

            this.addOperand(answer, this.result[i].remainder, start + i, null, this.colors[i]);
            this.answers.push(answer);
        }
    }

    raw(l) {
        return l.element;
    }

    numberToTextline(number, start) {
        let textline = {};
        textline.type = 'textline';
        textline.start = start;
        textline.size = this.BIG_FONT_HEIGHT;
        textline.texts = number.map((d) => {
            return {
                text: d.toString()
            }
        })
        return textline;
    }

    arrow() {
        return <Arrow />
    }

    renderSum(s, i, border, anchor) {
        return <div key={i} className={classNames('sum1', border)} >
            <Index index={anchor} />
            <svg ref={'sum' + i} style={{ paddingLeft: '20px' }}>
                {
                    s.textlines.map((l) => {
                        switch (l.type) {
                            case 'textline':
                                return this.textline(l);
                            case 'line':
                                return this.line(l);
                            case 'raw':
                                return this.raw(l);
                            default:
                                break;
                        }
                    })
                }
            </svg>
        </div>
    }

    render() {
        return (
            <div className="sumContainer" style={{ display: 'flex', margin: '20px', flexWrap: 'wrap' }}>
                {this.renderSum(this.problem, 0, 'blueBorder', 'Q')}
                {this.showAnswer  && this.answers.map((answer, i) => {
                    this.Y = this.answerY;
                    return this.renderSum(answer, i + 1, 'greenBorder', i + 1)
                })}
            </div>)
    }
}

export default Div;