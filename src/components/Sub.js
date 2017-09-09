import React, { Component } from 'react';
import styles from './../styles/Globals.css'
import Addition from './../store/Addition'
import correctAnswer from './check3.png'
import wrongAnswer from './wrong-answer.png'
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
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
        this.userAnswer = null;
        this.g = 0;
        this.sum = [
            {
                type: 'problem',
                steps: [
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
                ]
            },
             {
                type: 'answer',
                answers: [[
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
    }


    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        let ns = 'http://www.w3.org/2000/svg'
        for(let i =1 ; i<= this.svgs; i++) {
        let el = findDOMNode(this.refs['sum' + i]);
        let bbox = el.getBBox();
        el.setAttributeNS(null, 'width', bbox.width + 10)
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
        this.userAnswer = ''
        this.inputs.map(e => {
            if (e) {
                let c = e.value.toString();
                return this.userAnswer += (c === '' ? 'x' : c);
            }
        })

        console.log(' this.userAnswer  this.props.sum.answer.answer ' + this.userAnswer + '  ' + this.props.sum.answer.answer)
        if (this.userAnswer === this.props.sum.answer.answer) {
            this.answerCorrect = true;
        } else {
            this.answerCorrect = false;
        }
        this.showAnswer = true;
    }

    answerr(text) {
        let value = text.value.toString();
        return this.input(value.length, value.split(''), 'green', null, true)
    }

    carryover(text) {
        let value = text.value.toString();
        let xStart = this.X_START;
        let y = this.Y - this.CARRYOVER_HEIGHT + 5;
        // this.Y += this.CARRYOVER_HEIGHT;

        let texts = value.split('').map((e, i) => {
            return <text key={i + 1} x={xStart + i * this.LETTER_WIDTH} y={y} style={{ fill: 'orange', fontWeight: 'bold', fontSize: this.SMALL_FONT_HEIGHT, visibility: e === 'x' ? 'hidden' : 'visible' }}>{e} </text>
        });
        return <g key={this.g++}>  {texts} </g>
    }

    line(length) {
        let y = this.Y - this.TEXT_HEIGHT / 2;
        this.Y += this.LINE_HEIGHT + 10;

        return (<line key={this.g++} x1={this.X} y1={y} x2={this.X + length * this.LETTER_WIDTH} y2={y} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />)
    }

    plus(x, y) {
        return (<g>
            <line x1={x} y1={y - 10} x2={x + 20} y2={y - 10} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />
            <line x1={x + 10} y1={y - 20} x2={x + 10} y2={y} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />
        </g>)
    }

    minus(x, y) {
        return (<g>
            <line x1={x} y1={y - 10} x2={x + 20} y2={y - 10} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />
        </g>)
    }

    input(length, values, color = 'blue', circleColor = null, readOnly = true) {
        let inputs = [];


        let y = this.Y - 10;
        this.Y += this.INPUT_HEIGHT;
        let xStart = this.X_START + this.LETTER_WIDTH - 20;//this.HALF_BIG_FONT_HEIGHT//this.RIGHT_X - length * this.LETTER_WIDTH - 15;
        if (!readOnly) {
            this.inputs = [];
        }

        let border = '1px solid ' + color
        let ref = input => {
            this.inputs.push(input);
        }

        for (let i = 0; i < length; i++) {
            let value = values ? values[i] : '';
            value = value === 'x' ? '' : value;
            inputs.push(
                <foreignObject key={i} x={xStart + i * this.LETTER_WIDTH} y={y} width={this.LETTER_WIDTH} height={this.TEXT_HEIGHT}>
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        <div style={{ display: 'flex', border: border }} >
                            {!readOnly && <input defaultValue={value} type="text" size="1" maxLength="1" ref={ref} style={{ color: color, width: "100%", height: '100%', padding: '0', fontSize: this.BIG_FONT_HEIGHT, borderWidth: '0px', border: 'none' }} />}
                            {readOnly && <input value={value} type="text" size="1" maxLength="1" readOnly style={{ color: color, width: "100%", height: '100%', padding: '0', fontSize: this.BIG_FONT_HEIGHT, borderWidth: '0px', border: 'none' }} />}
                        </div>
                    </div>
                </foreignObject>)
        }
        let circle = circleColor ? <circle cx={xStart + length * this.LETTER_WIDTH + 20} cy={y + 15} r="18" stroke="gren" strokeWidth="3" fill={circleColor} /> : null;
        return <g key={this.g++}> {inputs} {circle} </g>
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
            if (e.text === 'x')
                return;
            return <text key={i} x={xStart + i * this.LETTER_WIDTH} y={y} style={{ fill: 'black', fontSize: text.size ? this.SMALL_FONT_HEIGHT : this.BIG_FONT_HEIGHT, visibility: e.visible ? 'visible' : 'hidden', textDecoration: e.crossed ? 'line-through' : 'none', textDecorationColor: e.crossed ? 'red' : 'black', textAnchor: 'middle' }}>{e.text} </text>
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
           {      this.sum.map((e, i) => {
                 return  e.type ==='problem' ?
                    <div key={i} >
                        <div className={classNames(
                        'sum1', 'blueBorder')}>
                        <Index index='Q' />
                        <svg ref={'sum' + ++this.svgs} style={{ paddingLeft: '20px' }}>
                            {this.Y = this.Y_START} {this.X = this.X_START} {this.inputs = []}
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
                                   {      e.answers.map((a, j) => {
                      return <div key={j} className={classNames('sum1', 'greenBorder')}>
                            <Index index='A' />
                            <svg ref={'sum' +  ++this.svgs}  style={{ paddingLeft: '20px' }}>
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
        )
    }
}

export default Sub;