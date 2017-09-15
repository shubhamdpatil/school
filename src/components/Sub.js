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
        let lasttextline = [...minuend]
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
                lasttextline = [...t]
                return textline;
            })
            sum.answer = lasttextline[lasttextline.length - 1] - subtrahend[lasttextline.length - 1]
            return sum;
        })
        return sumsWithTextlines;
    }

    getSum(minuend = '6000', subtrahend = '0136') {

        const minuendArray = minuend.toString().split('').map((e) => (+e))
        const subtrahendArrayReversed = subtrahend.toString().split('').map((e) => (+e)).reverse()
        const subtrahendArray = subtrahend.toString().split('').map((e) => (+e))

        let sumsWithoutFormatting = this.getBorrowLines(minuendArray, subtrahendArrayReversed)
        // console.log('sumsWithoutFormatting: ' + JSON.stringify(sumsWithoutFormatting[0]))
        let sums = this.convertBorrowLinesToText(sumsWithoutFormatting, minuendArray, subtrahendArray)
        // console.log('sums: ' + JSON.stringify(sums[0]))
        this.addMinuend(sums, minuendArray)
        this.reverseTextLines(sums)
        this.crossAndHideDigits(sums)
        // console.log('sums: 2 ' + JSON.stringify(sums[0]))
        this.addSubtrahend(sums, subtrahendArray)
        this.addLine(sums);
        this.addAnswerLine(sums)
        let newSums = this.mergeSums(sums)
        //  console.log('newSums: 1 ' + JSON.stringify(newSums[0]))
        // this.shiftDigitsToLowerEmptySpace(newSums)
        this.decorateAnswerColumn(newSums)
        return newSums;
    }

    addMinuend(sums, minuend) {
        let textline = {};
        textline.type = 'textline'
        textline.texts = minuend.map((d, i) => {
            return {
                text: d.toString()
            }
        })
        sums[0].textlines.unshift(textline)
    }

    reverseTextLines(sums) {
        for (let s of sums) {
            s.textlines.reverse();
        }
    }

    crossAndHideDigits(sums) {
        // for (let s of sums) {
        let s = sums[0]
        for (let i = 0; i < s.textlines.length - 1; i++) {
            let firstline = s.textlines[i];
            let nextline = s.textlines[i + 1];
            firstline.texts.forEach(function (element, index) {
                //  console.log('element.text : ' + element.text)
                //console.log('nextline.texts[index]: ' + nextline.texts[index].text)
                if (element.text === nextline.texts[index].text) {
                    element.hidden = 'y';
                } else {
                    element.hidden = 'n';
                    nextline.texts[index].crossed = 'y'
                }
                /*
                if (element.text !== nextline.texts[index].text) {
                    nextline.texts[index].crossed = 'y'
                } else {
                    nextline.texts[index].crossed = 'y'
                    //                    }
                    //if (element.text === nextline.texts[index].text) { 
                    // element.hidden = 'y';
                    //      if (element.crossed === 'y') {
                    //      nextline.texts[index].crossed = 'y';
                    //    }
                }
                */
            })
        }
        // }


        for (let i = 0; i < s.textlines.length - 1; i++) {
            let firstline = s.textlines[i];
            firstline.texts.forEach(function (element, index) {
                if (element['hidden'] === 'n') {
                    
                } else {
                }
            })
        }
    }

    addSubtrahend(sums, subtrahend) {
        let textline = {};
        textline.type = 'textline'
        textline.operation = '-'
        textline.texts = subtrahend.map((d, i) => {
            return {
                text: d.toString()
            }
        })
        sums[0].textlines.push(textline)
    }
    addLine(sums) {
        sums[0].textlines.push({ type: 'line' });
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
                        }
                    }
                    // remove duplicate lines, we don't repeat same digits in next line
                    for (let i = 0; i < s.textlines.length; i++) {
                        for (let l2 of newS.textlines) {
                            if (l2.texts && this.isArraySame(s.textlines[i].texts, l2.texts)) {
                                s.textlines.splice(i, 1)
                            }
                        }
                    }

                    // remove answer line of this sum, add digits from previous sum to answer of this sum, and then add this answer line to sum
                    let answerLine = null;
                    for (let i = 0; i < s.textlines.length; i++) {
                        const l = s.textlines[i]
                        if (l.hasOwnProperty('answerLine')) {
                            answerLine = s.textlines.splice(i, 1)
                        }
                    }
                    this.addDummyDigits(s.textlines, sums.length)
                    newS.textlines = s.textlines.concat(newS.textlines)
                    newS.textlines = newS.textlines.concat(answerLine);
                } else {
                    newS = cloneDeep(s);
                }
                previousSum = newS;
                newSums.push(newS)
            }
        }
        return newSums;
    }

    shiftDigitsToLowerEmptySpace(sums) {
        // for (let s of sums) {
        let s = sums[0]
        for (let i = 0; i < sums.length; i++) {
            let largetHiddenIndex = this.getLargestHiddenIndex(s.textlines, i)
            let lowestVisibleIndex = this.getLowestVisibleIndex(s.textlines, i)
            console.log('largetHiddenIndex : ' + largetHiddenIndex + ' lowestVisibleIndex: ' + lowestVisibleIndex + ' i:' + i)
            if (largetHiddenIndex !== -1 && lowestVisibleIndex !== -1 && largetHiddenIndex > lowestVisibleIndex) {
                let temp1 = s.textlines[largetHiddenIndex].texts[i]
                let temp2 = s.textlines[lowestVisibleIndex].texts[i]
                s.textlines[largetHiddenIndex].texts[i] = temp2;
                s.textlines[lowestVisibleIndex].texts[i] = temp1;
            }
        }
        //}
    }

    decorateAnswerColumn(sums) {
        for (let i = 0; i < sums.length; i++) {
            const answerColor = 'blue';
            let lowestVisibleIndex = this.getLowestVisibleIndex(sums[i].textlines, i);
            let largestVisibleIndex = this.getLargestVisibleIndex(sums[i].textlines, i)

            sums[i].textlines[lowestVisibleIndex].texts[sums.length - 1 - i].fill = answerColor;
            sums[i].textlines[largestVisibleIndex].texts[sums.length - 1 - i].fill = answerColor;
            let answerLine = this.getAnswerLine(sums[i].textlines);
            answerLine.texts[sums.length - 1 - i].fill = answerColor;

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

    componentDidMount() {
        let ns = 'http://www.w3.org/2000/svg'
        for (let i = 1; i <= this.svgs; i++) {
            let el = findDOMNode(this.refs['sum' + i]);
            let bbox = el.getBBox();
            console.log('width and height set....')
            el.setAttributeNS(null, 'width', bbox.width + 100)
            el.setAttributeNS(null, 'height', bbox.height + 100)
        }
    }


    componentDidUpdate(prevProps, prevState) {
        let ns = 'http://www.w3.org/2000/svg'
        for (let i = 1; i <= this.svgs; i++) {
            let el = findDOMNode(this.refs['sum' + i]);
            let bbox = el.getBBox();
            console.log('width and height set....')
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