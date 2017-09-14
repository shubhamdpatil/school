import React, { Component } from 'react';
import styles from './../styles/Globals.css'
import Addition from './../store/Addition'
import correctAnswer from './check3.png'
import wrongAnswer from './wrong-answer.png'
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
const util = require('util')
//const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);



function Index(props) {
    return <div className="circle"> {props.index} </div>
}

class Sub extends Component {

    constructor(props) {
        super(props);
        this.TEXT_HEIGHT = 40
        this.HALF_BIG_FONT_HEIGHT = 15;
        this.BIG_FONT_HEIGHT = '30px'
        this.SMALL_FONT_HEIGHT = '20px'
        this.CARRYOVER_HEIGHT = 30;
        this.LINE_HEIGHT = 0;
        this.INPUT_HEIGHT = 80;
        // this.RIGHT_X = 250;
        this.LETTER_WIDTH = 50;
        this.inputs = [];
        this.Y_START = 40;
        this.X_START = 0;
        this.Y = this.Y_START;
        this.X = this.X_START;
        this.showAnswer = false;
        this.g = 0;
        this.sum = [
            {
                type: 'problem',
                steps: [
                    {
                        type: 'textline',
                        texts: [
                            {
                                text: '5'
                            },
                            {
                                text: '2',
                                crossed: 'y'
                            }
                        ]
                    },
                    {
                        type: 'textline',
                        operation: '-',
                        texts: [
                            {
                                text: '4'
                            },
                            {
                                text: '6'
                            }
                        ]
                    },
                    {
                        type: 'line'
                    },
                    {
                        type: 'textline',
                        answer: 'y',
                        texts: [
                            {
                                text: '0',
                                hidden: 'y'
                            },
                            {
                                text: '6',
                                hidden: 'y'
                            }
                        ]
                    },
                ]
            },
            {
                type: 'answer',
                answers: [
                    [
                        {
                            type: 'textline',
                            size: 'small',
                            texts: [
                                {
                                    text: '4',
                                },
                                {
                                    text: '12'
                                }
                            ]
                        },
                        {
                            type: 'textline',
                            texts: [
                                {
                                    text: '5',
                                    crossed: 'y'
                                },
                                {
                                    text: '2',
                                    visible: 'n',
                                    crossed: 'y'
                                }
                            ]
                        },
                        {
                            type: 'textline',
                            operation: '-',
                            texts: [
                                {
                                    text: '4',
                                    visible: 'y'
                                },
                                {
                                    text: '6',
                                    visible: 'n'
                                }
                            ]
                        },
                        {
                            type: 'line'
                        },
                        {
                            type: 'textline',
                            texts: [
                                {
                                    text: '0'
                                },
                                {
                                    text: '6'
                                }
                            ]
                        },
                    ], [
                        {
                            type: 'textline',
                            size: 'small',
                            texts: [
                                {
                                    text: '5',
                                    visible: 'y'
                                },
                                {
                                    text: '12',
                                    visible: 'n'
                                }
                            ]
                        },
                        {
                            type: 'textline',
                            texts: [
                                {
                                    text: '5',
                                    visible: 'y'
                                },
                                {
                                    text: '2',
                                    visible: 'n',
                                    crossed: 'y'
                                }
                            ]
                        },
                        {
                            type: 'textline',
                            operation: '-',
                            texts: [
                                {
                                    text: '4',
                                    visible: 'y'
                                },
                                {
                                    text: '6',
                                    visible: 'n'
                                }
                            ]
                        },
                        {
                            type: 'line'
                        },
                        {
                            type: 'textline',
                            texts: [
                                {
                                    text: '5',
                                    visible: 'y'
                                },
                                {
                                    text: '2',
                                    visible: 'n',
                                    strikeThrough: 'y'
                                }
                            ]
                        },
                    ]]
            }
        ]
        this.sums = this.getSum();
    }

    numberLine(e, addonProperty = null) {
        let line = {};
        line.type = 'textline';
        line.texts = e.toString().split('').map(d => {
            let digit = {};
            digit.text = (d).toString();
            if (addonProperty)
                digit = Object.assign(digit, addonProperty)
            return digit;
        })
        return line;
    }

    getSubStep(d1, d2, borrow) {
        let results = [];
        let borrowedFor0 = false;

        if (d1 === 0) {
            d1 = d1 + 10;
            borrowedFor0 = true;
        }

        if (borrow) {
            d1--;
        }

        if (d2 > d1) {
            results.push(d1 + 10);
            results.push(d2)
            results.push(d1 + 10 - d2)
            results.push(1)
        } else {
            results.push(d1);
            results.push(d2)
            results.push(d1 - d2)
            borrowedFor0 ? results.push(1) : results.push(0)
        }
        return results;
    }

    sub(operands, length, borrow) {
        let result = {};
        result.digits = [];
        let firstBorrow = false;
        let secondBorrow = false;
        let borroww = borrow;
        for (let i = length - 1; i >= 0; i--) {
            let d1 = operands[0][i];
            let d2 = operands[1][i];
            let r = this.getSubStep(d1, d2, borroww);
            borroww = r[3];
            if (r[3] === 1) {
                if (!firstBorrow) {
                    firstBorrow = true;
                } else {
                    secondBorrow = true;
                }
            }
            if (secondBorrow) {
                break;
            } else {
                result.digits.push(r);
            }
        }
        return result;
    }

    isArraySame(array1, array2) {
        /*  return (array1.length == array2.length) && array1.every(function (element, index) {
             return element === array2[index];
         });
  */
        return array1.every(function (element, index) {
            return element.text === array2[index].text;
        });
    }

    getSum() {
        let num1 = '602', num2 = '036';
        //let d1 = [7, 0, 1, 0, 6], d2 = [0, 0, 2, 5, 6];
        let d1 = num1.toString().split('').map((e) => (+e))  //[7, 0, 1, 9];
        let d2 = num2.toString().split('').map((e) => (+e))  //[7, 0, 1, 9];
        const numTwo = num2.toString().split('').map((e) => (+e))  //[7, 0, 1, 9];
        let lastd1 = [...d1];
        let answer = [];
        let d2org = [...d2];
        d2.reverse();
        let answerRows = [];
        for (let d of d2) {
            let newD1 = this.getSum2(lastd1, d);
            answerRows.push([...newD1]);
            lastd1 = newD1[newD1.length - 1];
            answer.push(lastd1[lastd1.length - 1] - d);
            lastd1 = lastd1.slice(0, lastd1.length - 1);
        }

        let sums = [];
        let lasttextline = [...d1]
        sums = answerRows.map(s => {
            let sum = {}
            sum.type = 'answer'
            sum.textlines = s.map((t, j) => {
                let textline = {};
                textline.type = 'textline'
                textline.size = this.SMALL_FONT_HEIGHT
                sum.digitsLength = t.length;
                textline.texts = t.map((d, i) => {
                    ///   if()
                    /*  let crossed = 'n'
                     if (j < s.length - 1 && (!borrowIndex.equal && (i === borrowIndex.notEqualIndex) || i === borrowIndex.notEqualIndex + 1)) {
                         crossed = 'y'
                     } */
                    return {
                        text: d.toString(),
/*                         crossed
 */                    }
                })
                lasttextline = [...t]
                return textline;
            })
            sum.answer = lasttextline[lasttextline.length - 1] - d2org[lasttextline.length - 1]
            return sum;
        })

        {
            let textline = {};
            textline.type = 'textline'
            let firstAnswerRow = answerRows[0][0];
            textline.texts = d1.map((d, i) => {
                /*  let crossed = 'n'
                 if (!borrowIndex.equal && (i === borrowIndex.notEqualIndex) || i === borrowIndex.notEqualIndex + 1) {
                     crossed = 'y'
                 } */
                return {
                    text: d.toString(),
/*                     crossed
 */                }
            })
            sums[0].textlines.unshift(textline)
        }

        for (let s of sums) {
            s.textlines.reverse();
        }

        for (let s of sums) {
            for (let i = 0; i < s.textlines.length - 1; i++) {
                let firstline = s.textlines[i];
                let nextline = s.textlines[i + 1];
                firstline.texts.forEach(function (element, index) {
                    if (element.text !== nextline.texts[index].text) {
                        nextline.texts[index].crossed = 'y'
                    } else {

                    }
                    if (element.text === nextline.texts[index].text) {
                        element.hidden = 'y';
                        if (element.crossed === 'y') {
                            nextline.texts[index].crossed = 'y';
                        }
                    }
                })
            }
        }


        {
            let textline = {};
            textline.type = 'textline'
            textline.operation = '-'
            textline.texts = numTwo.map((d, i) => {
                return {
                    text: d.toString()
                }
            })
            sums[0].textlines.push(textline)
        }

        {
            sums[0].textlines.push({ type: 'line' });
        }

        {
            let lastAnswer = [];
            for (let s of sums) {
                let textline = {};
                textline.type = 'textline'
                textline.justified = 'right';
                textline.answerLine = 'y';
                lastAnswer.unshift(s.answer);
                textline.texts = lastAnswer.map((d, i) => {
                    return {
                        text: d.toString()
                    }
                })
                let blankSpaces = numTwo.length - textline.texts.length;
                for (let i = 0; i < blankSpaces; i++) {
                    textline.texts.unshift({
                        text: '0',
                        hidden: 'y'
                    })
                }
                // textline.texts.unshift('x'.repeat(numTwo.length - textline.texts.length))
                s.textlines.push(textline);
            }
        }


        let newSums = [];
        {
            let previousSum = null;
            for (const s of sums) {
                let newS = null;
                if (previousSum) {
                    newS = cloneDeep(previousSum)
                    //newS = { ...previousSum }
                    for (let i = 0; i < newS.textlines.length; i++) {
                        const l = newS.textlines[i]
                        if (l.hasOwnProperty('answerLine')) {
                            newS.textlines.splice(i, 1)
                        }
                    }
                    for (let i = 0; i < s.textlines.length; i++) {
                        for (let l2 of newS.textlines) {
                            if (l2.texts && this.isArraySame(s.textlines[i].texts, l2.texts)) {
                                s.textlines.splice(i, 1)
                            }
                        }
                    }

                    let answerLine = null;
                    for (let i = 0; i < s.textlines.length; i++) {
                        const l = s.textlines[i]
                        if (l.hasOwnProperty('answerLine')) {
                            answerLine = s.textlines.splice(i, 1)
                        }
                    }
                    this.addDummyDigits(s.textlines, numTwo.length)
                    newS.textlines = s.textlines.concat(newS.textlines)
                    newS.textlines = newS.textlines.concat(answerLine);
                } else {
                    //newS = { ...s };
                    newS = cloneDeep(s);
                }
                previousSum = newS;
                newSums.push(newS)
            }
        }

        for (let s of newSums) {
            for (let i = 0; i < numTwo.length; i++) {
                let largetHiddenIndex = this.getLargestHiddenIndex(s.textlines, i)
                let lowestVisibleIndex = this.getLowestVisibleIndex(s.textlines, i)
                if (largetHiddenIndex !== -1 && lowestVisibleIndex !== -1 && largetHiddenIndex > lowestVisibleIndex) {
                    let temp1 = s.textlines[largetHiddenIndex].texts[i]
                    let temp2 = s.textlines[lowestVisibleIndex].texts[i]
                    s.textlines[largetHiddenIndex].texts[i] = temp2;
                    s.textlines[lowestVisibleIndex].texts[i] = temp1;
                }
            }
        }
        return newSums;
    }



    getLowestVisibleIndex(textlines, column) {
        let lowestVisibleIndex = -1;
        for (let i = 0; i < textlines.length; i++) {
            if (textlines[i].texts && textlines[i].texts[column]) {
                if (textlines[i].hasOwnProperty('answerLine') && textlines[i].answerLine === 'y') {
                    break;
                }
                let t = textlines[i].texts[column]
                if (!t.hasOwnProperty('hidden') || t.hidden === 'n') {
                    lowestVisibleIndex = i;
                    break;
                }
            }
        }
        return lowestVisibleIndex;
    }

    getLargestHiddenIndex(textlines, column) {
        let largetHiddenIndex = -1;
        for (let i = 0; i < textlines.length; i++) {
            if (textlines[i].texts && textlines[i].texts[column]) {
                if (textlines[i].hasOwnProperty('answerLine') && textlines[i].answerLine === 'y') {
                    break;
                }
                let t = textlines[i].texts[column]
                if (t.hasOwnProperty('hidden') && t.hidden === 'y') {
                    largetHiddenIndex = i;
                }
            }
        }
        return largetHiddenIndex;
    }

    addDummyDigits(textlines, length) {
        for (let l of textlines) {
            let blankSpaces = length - l.texts.length;
            for (let i = 0; i < blankSpaces; i++) {
                l.texts.push({
                    text: '0',
                    hidden: 'y'
                })
            }
        }
    }

    getSum2(d1, d) {
        let newD1 = [];
        let diff;
        let nonZeroDigitIndex = 1;
        let newd1 = [...d1];
        let length = d1.length;
        if (d1[length - 1] < d) {
            while (d1[length - 1 - nonZeroDigitIndex++] === 0);
            --nonZeroDigitIndex;
            let start = length - 1 - nonZeroDigitIndex;
            while (start < length - 1) {
                newd1[start]--;
                newd1[start + 1] += 10;
                newD1.push([...newd1]);
                start++;
            }
        } else {
            newD1.push(newd1);
        }
        return newD1;
    }

    getSum1() {
        let length = 0;
        let borrow = false;
        let num1 = 1902;
        let num2 = 398;
        let d1 = num1.toString().split('').map((e) => (+e))  //[7, 0, 1, 9];
        let d2 = num2.toString();
        d2 = '0'.repeat(d1.length - d2.length) + d2;
        d2 = d2.split('').map((e) => (+e))  //[7, 0, 1, 9];
        let calculatedDiff = [];
        while (length < d1.length) {
            let o = [];
            let s = length === 0 ? d1 : d1.slice(0, d1.length - length);
            o.push(s)
            s = length === 0 ? d2 : d2.slice(0, d1.length - length);
            o.push(s)
            let r = this.sub(o, d1.length - length, borrow);
            length += r.digits.length;
            borrow = r.digits[r.digits.length - 1][3]
            for (let d of r.digits) {
                calculatedDiff.push(d[2])
            }
        }
        let number = ''
        calculatedDiff.reverse()
        for (let d of calculatedDiff) {
            number += d;
        }
        return;

        let operands = ['52', '46'], answer = '06';
        let problem = {
            type: 'problem'
        }
        problem.steps = operands.map((e) => {
            return this.numberLine(e);
        });

        problem.steps.push({
            type: 'line'
        });

        problem.steps.push(this.numberLine(answer, { hidden: 'y' }));

    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        let ns = 'http://www.w3.org/2000/svg'
        for (let i = 1; i <= this.svgs; i++) {
            let el = findDOMNode(this.refs['sum' + i]);
            let bbox = el.getBBox();
            el.setAttributeNS(null, 'width', bbox.width + 100)
            el.setAttributeNS(null, 'height', bbox.height + 20)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.check();
        }
        if (nextProps.sum !== this.props.sum) {
            this.showAnswer = false;
            this.answerCorrect = false;
        }
    }

    check() {
        this.showAnswer = true;
    }

    line(length) {
        let y = this.Y - this.TEXT_HEIGHT / 2;
        this.Y += this.LINE_HEIGHT + 10;

        return (<line key={this.g++} x1={this.X} y1={y} x2={this.X + length * this.LETTER_WIDTH} y2={y} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />)
    }

    minus(x, y) {
        return (<g>
            <line x1={x} y1={y - 10} x2={x + 20} y2={y - 10} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />
        </g>)
    }

    slantedText(text) {
        return (<g key={this.g++}>> <defs>
            <path id="path"
                d="M 10 80 L 80 0" />
        </defs>
            <use xlinkHref="#path" fill="none" />
            <text fontFamily="Verdana" fontSize="20">
                <textPath xlinkHref="#path">{text}</textPath>
            </text > </g>)
    }

    textline(text) {
        let xStart = this.X_START;
        let y = this.Y;
        let operation = text.operation ? this.minus(xStart, this.Y) : null;
        this.Y += text.size ? 35 : this.TEXT_HEIGHT;

        xStart += this.LETTER_WIDTH;

        let texts = text.texts.map((e, i) => {
            let hidden = this.showAnswer && text.answer === 'y' ? false : e.hidden;
            return <text key={i} x={xStart + i * this.LETTER_WIDTH} y={y} style={{ fill: 'black', fontSize: text.size ? this.SMALL_FONT_HEIGHT : this.BIG_FONT_HEIGHT, visibility: hidden ? 'hidden' : 'visible', textDecoration: e.crossed === 'y' ? 'line-through' : 'none', textDecorationColor: e.crossed ? 'red' : 'black', textAnchor: 'middle' }}>{e.text} </text>
        });
        return <g key={this.g++}> {operation} {texts} </g>
    }

    render() {
        let answerCircleColor = null;
        if (this.showAnswer) {
            answerCircleColor = this.answerCorrect ? 'green' : 'red';
        }
        this.svgs = 0;

        return (
            <div className="sumContainer" style={{ display: 'flex', margin: '20px' }}>
                {this.sums.map((s, i) => {
                    return <div key={i} className={classNames('sum1', 'greenBorder')}>
                        <Index index='A' />
                        <svg ref={'sum' + ++this.svgs} style={{ paddingLeft: '20px' }}>
                            {this.Y = this.Y_START} {this.X = this.X_START} {this.inputs = []}
                            {
                                s.textlines.map((l) => {
                                    switch (l.type) {
                                        case 'textline':
                                            return this.textline(l);
                                        case 'line':
                                            return this.line(3);
                                        default:
                                            break;
                                    }
                                })
                            }
                        </svg>
                    </div>
                })}
            </div>)

        /*  return (
             <div className="sumContainer" style={{ display: 'flex', margin: '20px' }}>
                 {this.sum.map((e, i) => {
                     return e.type === 'problem' ?
                         <div key={i} >
                             <div className={classNames(
                                 'sum1', 'blueBorder')}>
                                 <Index index='Q' />
                                 <svg ref={'sum' + ++this.svgs} style={{ paddingLeft: '20px' }}>
                                     {this.Y = this.Y_START} {this.X = this.X_START} }
                             {
                                         e.steps.map((l, i) => {
                                             switch (l.type) {
                                                 case 'textline':
                                                     return this.textline(l);
                                                 case 'line':
                                                     return this.line(3);
                                                 default:
                                                     break;
                                             }
                                         })
                                     }
                                 </svg>
                             </div>
                         </div>
                         :
                         <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                             {e.answers.map((a, j) => {
                                 return <div key={j} className={classNames('sum1', 'greenBorder')}>
                                     <Index index='A' />
                                     <svg ref={'sum' + ++this.svgs} style={{ paddingLeft: '20px' }}>
                                         {this.Y = this.Y_START} {this.X = this.X_START} {this.inputs = []}
                                         {
                                             a.map((l) => {
                                                 switch (l.type) {
                                                     case 'textline':
                                                         return this.textline(l);
                                                     case 'line':
                                                         return this.line(3);
                                                     default:
                                                         break;
                                                 }
                                             })
                                         }
                                     </svg>
                                 </div>
                             })}
                         </div>
                 })}
             </div>
         ) */
    }
}

export default Sub;