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

    isArraySame(array1, array2) {
        return array1.every(function (element, index) {
            return element.text === array2[index].text;
        });
    }

    getBorrowLines(minuend, subtrahend) {
        let sums = [];
        let lastMinuend = [...minuend]
        for (let d of subtrahend) {
            let newMinuends = this.getSum2(lastMinuend, d);
            sums.push([...newMinuends]);
            lastMinuend = newMinuends[newMinuends.length - 1];
            lastMinuend = lastMinuend.slice(0, lastMinuend.length - 1);
        }
        return sums;
    }

    convertBorrowLinesToText(sums, minuend, subtrahend) {
        let lasttextline = cloneDeep(minuend) 
        let sumsWithTextlines = sums.map(s => {
            let sum = {}
            sum.type = 'answer'
            sum.textlines = s.map((t, j) => {
                let textline = {};
                textline.type = 'textline'
                textline.size = this.SMALL_FONT_HEIGHT
                sum.digitsLength = t.length;
                textline.texts = t.map((d, i) => {
                    return {
                        text: d.toString()
                    }
                })
                lasttextline = cloneDeep(t) 
                return textline;
            })
            sum.answer = lasttextline[lasttextline.length - 1] - subtrahend[lasttextline.length - 1]
            return sum;
        })
        return sumsWithTextlines;
    }

    getSum(minuend = '60100', subtrahend = '02136') { //minuend = '6010', subtrahend = '2136'

        const minuendArray = minuend.toString().split('').map((e) => (+e))
        const subtrahendArrayReversed = subtrahend.toString().split('').map((e) => (+e)).reverse()
        const subtrahendArray = subtrahend.toString().split('').map((e) => (+e))

        let sumsWithoutFormatting = this.getBorrowLines(minuendArray, subtrahendArrayReversed)
        let sums = this.convertBorrowLinesToText(sumsWithoutFormatting, minuendArray, subtrahendArray)
        this.addMinuend(sums, minuendArray)
        this.reverseTextLines(sums)
        let newSums = this.mergeSums(sums)
        this.hideSameDigits(newSums)
        this.shiftDigitsToLowerEmptySpace(newSums)
        this.removeHiddenLines(newSums)
        this.crossDifferentDigits(newSums)
        this.addSubtrahend(newSums, subtrahendArray)
        this.addLine(newSums);
        this.addAnswerLine(newSums)
        this.decorateAnswerColumn(newSums)
        return newSums;
    }

    addMinuend(sums, minuend) {
        let textline = {};
        textline.type = 'textline'
        textline.texts = minuend.map((d, i) => {
            return {
                text: d.toString(),
                hidden: 'n'
            }
        })
        sums[0].textlines.unshift(textline)
    }

    reverseTextLines(sums) {
        for (let s of sums) {
            s.textlines.reverse();
        }
    }

    removeHiddenLines(sums) {
        for (let s of sums) {
            let firstline = s.textlines[0];
            let linesToRemove = [];
            for (let i = 0; i < s.textlines.length - 1; i++) {
                let firstline = s.textlines[i];
                let lineVisible = false;
                for (let j = 0; j < firstline.texts.length; j++) {
                    if (firstline.texts[j].hidden === 'n') {
                        lineVisible = true;
                        break;
                    }
                }
                if (!lineVisible) {
                    s.textlines.splice(i, 1)
                    i--
                }
            }
        }
    }

    hideSameDigits(sums) {
        for (let s of sums) {
            for (let i = 0; i < s.textlines.length - 1; i++) {
                let firstline = s.textlines[i];
                let nextline = s.textlines[i + 1];
                firstline.texts.forEach(function (element, index) {
                    if (element.text === nextline.texts[index].text) {
                        element.hidden = 'y';
                    } else {
                        element.hidden = 'n';
                    }
                })
                for (let j = 0; j < firstline.texts.length; j++) {
                    if (firstline.texts[j].hidden === 'n') {
                        break;
                    }
                }
            }
        }
    }

    crossDifferentDigits(sums) {
        for (let s of sums) {
            for (let i = 0; i < s.textlines.length - 1; i++) {
                let firstline = s.textlines[i];
                let nextline = s.textlines[i + 1];
                firstline.texts.forEach(function (element, index) {
                    if (element.text !== nextline.texts[index].text) {
                        nextline.texts[index].crossed = 'y';
                    } else {
                        nextline.texts[index].crossed = 'n';
                    }

                })
            }
        }
    }

    addSubtrahend(sums, subtrahend) {
        for (let s of sums) {
            let textline = {};
            textline.type = 'textline'
            textline.operation = '-'
            textline.texts = subtrahend.map((d, i) => {
                return {
                    text: d.toString()
                }
            })
            s.textlines.push(textline)
        }
    }

    addLine(sums) {
        for (let s of sums) {
            s.textlines.push({ type: 'line' });
        }
    }

    addAnswerLine(sums) {
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
            let blankSpaces = sums.length - textline.texts.length;
            for (let i = 0; i < blankSpaces; i++) {
                textline.texts.unshift({
                    text: '0',
                    hidden: 'y'
                })
            }
            s.textlines.push(textline);
        }
    }

    mergeSums(sums) {
        let newSums = [];
        {
            let previousSum = null;
            for (const s of sums) {
                let newS = null;
                if (previousSum) {
                    newS = cloneDeep(previousSum)
                    for (let i = 0; i < newS.textlines.length; i++) {
                        const l = newS.textlines[i]
                        //remove answer line of previous sum, as new sum will have its own answer line
                        if (l.hasOwnProperty('answerLine')) {
                            newS.textlines.splice(i, 1)
                            break;
                        }
                    }
                    // remove duplicate lines, we don't repeat same digits in next line
                    outerloop: for (let i = 0; i < s.textlines.length; i++) {
                        for (let l2 of newS.textlines) {
                            if (l2.texts && this.isArraySame(s.textlines[i].texts, l2.texts)) {
                                s.textlines.splice(i, 1)
                                break outerloop;
                            }
                        }
                    }
                    this.addDummyDigits(s.textlines, sums.length, newS)
                    newS.textlines = s.textlines.concat(newS.textlines)
                } else {
                    newS = cloneDeep(s);
                }
                previousSum = newS;
                newS.answer = s.answer
                newSums.push(newS)
            }
        }
        return newSums;
    }

    printColumn(lines, column) {
        for (let i = 0; i < 3; i++) {
            console.log(JSON.stringify(lines[i].texts[column]))
        }
    }

    shiftDigitsToLowerEmptySpace(sums) {
        for (let s of sums) {
            for (let i = 0; i < sums.length; i++) {
                let largetHiddenIndex = this.getLargestHiddenIndex(s.textlines, i)
                let largetVisibleButSmallerThanHiddenIndex =
                    this.getLargetVisibleButSmallerThanHiddenIndex(s.textlines, i, largetHiddenIndex)
                if (largetHiddenIndex !== -1 && largetVisibleButSmallerThanHiddenIndex !== -1) {
                    const columnsToShift = largetHiddenIndex - largetVisibleButSmallerThanHiddenIndex;
                    for (let j = 0; j < columnsToShift; j++) {
                        for (let k = largetHiddenIndex; k > 0; k--) {
                            s.textlines[k].texts[i] = { ...s.textlines[k - 1].texts[i] }
                        }

                    }
                    for (let m = 0; m < columnsToShift; m++) {
                        s.textlines[m].texts[i].hidden = 'y'
                    }
                }
            }
        }
    }

    decorateAnswerColumn(sums) {
        for (let i = 0; i < sums.length; i++) {
            const answerColor = 'blue';
            let lowestVisibleIndex = this.getLowestVisibleIndex(sums[i].textlines, sums.length - 1 - i);
            let largestVisibleIndex = this.getLargestVisibleIndex(sums[i].textlines, sums.length - 1 - i);

            sums[i].textlines[lowestVisibleIndex].texts[sums.length - 1 - i].fill = answerColor;
            sums[i].textlines[largestVisibleIndex].texts[sums.length - 1 - i].fill = answerColor;
            let answerLine = this.getAnswerLine(sums[i].textlines);
            answerLine.texts[sums.length - 1 - i].fill = 'red';

            sums[i].textlines[lowestVisibleIndex].texts[sums.length - 1 - i].weight = 'bold';
            sums[i].textlines[largestVisibleIndex].texts[sums.length - 1 - i].weight = 'bold';
            answerLine.texts[sums.length - 1 - i].weight = 'bold';
        }
    }

    getAnswerLine(textlines) {
        for (let i = 0; i < textlines.length; i++) {
            if (textlines[i].hasOwnProperty('answerLine') && textlines[i].answerLine === 'y') {
                return textlines[i];
            }
        }
        return null;
    }

    getLowestVisibleIndex(textlines, column) {
        let lowestVisibleIndex = -1;
        for (let i = 0; i < textlines.length; i++) {
            if (textlines[i].texts && textlines[i].texts[column]) {
                if (textlines[i].hasOwnProperty('answerLine') && textlines[i].answerLine === 'y') {
                    break;
                }
                let t = textlines[i].texts[column]
                if (t.hidden === 'n') {
                    lowestVisibleIndex = i;
                    break;
                }
            }
        }
        return lowestVisibleIndex;
    }

    getLargetVisibleButSmallerThanHiddenIndex(textlines, column, hiddenIndex) {
        let largestVisibleIndex = -1;
        for (let i = 0; i < textlines.length; i++) {
            if (textlines[i].texts && textlines[i].texts[column]) {
                let t = textlines[i].texts[column]
                if (t.hidden === 'n' && i < hiddenIndex) {
                    largestVisibleIndex = i;
                }
            }
        }
        return largestVisibleIndex;
    }

    getLargestHiddenIndex(textlines, column) {
        let largetHiddenIndex = -1;
        for (let i = 0; i < textlines.length; i++) {
            if (textlines[i].texts && textlines[i].texts[column]) {
                if (textlines[i].hasOwnProperty('answerLine') && textlines[i].answerLine === 'y') {
                    break;
                }
                let t = textlines[i].texts[column]
                if (t.hidden === 'y') {
                    largetHiddenIndex = i;
                }
            }
        }
        return largetHiddenIndex;
    }

    getLargestVisibleIndex(textlines, column) {
        let largetVisibleIndex = -1;
        for (let i = 0; i < textlines.length; i++) {
            if (textlines[i].texts && textlines[i].texts[column]) {
                if (textlines[i].hasOwnProperty('answerLine') && textlines[i].answerLine === 'y') {
                    break;
                }
                let t = textlines[i].texts[column]
                if (!t.hasOwnProperty('hidden') || t.hidden === 'n') {
                    largetVisibleIndex = i;
                }
            }
        }
        return largetVisibleIndex;
    }

    addDummyDigits(textlines, length, previousSum) {
        let previousSumLastLine = previousSum.textlines[0]
        if (textlines.length > 0) {
            let thisSumTextLength = textlines[0].texts.length;
            let blankSpaces = length - thisSumTextLength;
            for (let l of textlines) {
                for (let i = 0; i < blankSpaces; i++) {
                    l.texts.push({ ...previousSumLastLine.texts[thisSumTextLength + i] })
                }
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

    componentDidMount() {
        let ns = 'http://www.w3.org/2000/svg'
        for (let i = 1; i <= this.svgs; i++) {
            let el = findDOMNode(this.refs['sum' + i]);
            let bbox = el.getBBox();
            // console.log('width and height set....')
            el.setAttributeNS(null, 'width', bbox.width + 100)
            el.setAttributeNS(null, 'height', bbox.height + 100)
        }
    }


    componentDidUpdate(prevProps, prevState) {
        let ns = 'http://www.w3.org/2000/svg'
        for (let i = 1; i <= this.svgs; i++) {
            let el = findDOMNode(this.refs['sum' + i]);
            let bbox = el.getBBox();
            el.setAttributeNS(null, 'width', bbox.width + 100)
            el.setAttributeNS(null, 'height', bbox.height + 100)
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
    
    textline(text) {
        let xStart = this.X_START;
        let y = this.Y;
        let operation = text.operation ? this.minus(xStart, this.Y) : null;
        this.Y += text.size ? 35 : this.TEXT_HEIGHT;

        xStart += this.LETTER_WIDTH;

        let texts = text.texts.map((e, i) => {
            // let hidden = this.showAnswer && text.answer === 'y' ? false : e.hidden;
            let hidden = e.hidden === 'y' ? true : false
            return <text key={i} x={xStart + i * this.LETTER_WIDTH} y={y} style={{ fill: 'black', fontSize: text.size ? this.SMALL_FONT_HEIGHT : this.BIG_FONT_HEIGHT, visibility: hidden ? 'hidden' : 'visible', textDecoration: e.crossed === 'y' ? 'line-through' : 'none', textDecorationColor: e.crossed ? 'red' : 'black', textAnchor: 'middle', fill: e.fill ? e.fill : 'black', fontWeight: e.weight ? e.weight : 'normal' }}>{e.text} </text>
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