import React, { Component } from 'react';
import util from 'util'
import { findDOMNode } from 'react-dom';

import styles from './../styles/Globals.css'
import Multiplication from './../store/Multiplication'
import correctAnswer from './check3.png'
import wrongAnswer from './wrong-answer.png'
import classNames from 'classnames';

function Problem(props) {
    let rows =
        props.operands.map((e, i) => {
            return <Row row={e} key={i} index={i} />
        })
    return <div> <Index index={props.index} /> {rows}  </div>
}

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

function Check(props) {
    return <div className={classNames(props.classNames)}><div ><img src={props.answerCorrect ? correctAnswer : wrongAnswer} style={{ maxWidth: '100%' }} alt="" /> </div></div>
}

function AnswerSteps(props) {
    let steps = props.rows.map((e, index) => {
        return < Answer row={e} key={index} classNames={props.answerNumber} length={props.maxColumns} />
    })
    return <div> {steps} </div>
}

function Answer(props) {
    return Row(props);
}

function Row(props) {
    let row = props.row.toString().split('');
    let boxes = row.map((e, i) => {
        return <div className="box" key={i} > {e} </div>
    });
    let classes = classNames('row', props.classNames)
    return <div className={classes} key={props.index}> {boxes} </div>
}

function AttemptedAnswer(props) {
    var bottom = classNames({ row: true, bottom: true });
    let inputs = [];
    for (let i = 0; i < props.length; i++) {
        inputs.push(<div className="box" key={inputs.length} > <input type="text" size="1" maxLength="1"
            ref={input => props.inputs.push(input)} key={i} /> </div>)
    }
    return <div className={bottom}> {inputs} </div>
}

class MultiplicationC extends Component {

    constructor(props) {
        super(props);
        this.createSum();
        this.placeValues = [];
        this.getPlaceValues(this.sum.answer);
        this.placeValues = this.formatRows(this.placeValues, '+')
    }

    componentDidMount() {
        this.setCss();
        if (this.displayOnly) {
            this.onCheck();
        }
    }

    setHeight() {
        const el = findDOMNode(this.refs.sum);
        let sumHeight;
        if (!this.tried) {
            sumHeight = (50 * (this.props.size + 1)) + 30 + 'px';
        } else {
            sumHeight = (50 * (this.props.size + 1 + this.operands.length)) + 30 + 'px';
        }
        el.style.setProperty('--sum-height', sumHeight);
    }

    setWidth() {
        const el = findDOMNode(this.refs.sum);
        let sumWidth = (50 * (this.maxColumns + 1)) + 'px';
        el.style.setProperty('--sum-width', sumWidth);
    }

    setCss() {
        this.setWidth();
        this.setHeight();
    }

    getPlaceValues(remainder) {
        let row = this.sum.operands[0].toString().split('');
        row.map((e, index) => {
            this.placeValues.push(Math.floor(this.sum.operands[1] *
                (e * Math.pow(10, row.length - index - 1))));
        })
        this.placeValues.reverse();
    }

    createSum() {
        if (this.props.newSum) {
            this.sum = new Multiplication(this.props.digits, this.props.size);
            this.tried = false;
        } else {           
            this.sum = this.props.sum;
            this.tried = true;
        }

        this.columns();
        this.inputs = [];
        this.inputArray = [];
        this.onCheck = this.onCheck.bind(this);
        this.state = { tried: false };
        this.formatOperands();
        this.formatAnswer();
        //this.log();
    }

    log() {
        for (let i = 0; i < this.operands.length; i++) {
            console.log(this.operands[i])
        }
        console.log('answer ' + this.answer)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.onCheck();
        }
    }

    columns() {
        this.maxColumns = this.sum.operands[0].toString().length + this.sum.operands[1].toString().length + 1;
    }


    onCheck() {
        if (!this.displayOnly) {
            let answer = '';
            this.inputs.map(e => {
                return answer += e.value.toString();
            })
            let result = this.sum.checkAnswer(parseInt(answer, 10))
            if (result) {
                this.answerCorrect = true;
            } else {
                this.answerCorrect = false;
            }
        } else {
            this.answerCorrect = true;            
        }
        this.tried = true;
        this.setState({ tried: true });
        this.setHeight();
    }

    formatRows(rows, sign) {
        return rows.map((e, index) => {
            e = e.toString();
            if (index != 0) {
                e = sign.repeat(1) + e;
            }

            if (e.length < this.maxColumns) {
                e = ' '.repeat(this.maxColumns - e.length) + e;
            }
            return e;
        })
    }

    formatOperands() {
        this.operands = this.sum.operands.map((e, index) => {
            e = e.toString();
            if (index != 0) {
                e = 'x'.repeat(1) + e;
            }
            if (e.length < this.maxColumns) {
                e = ' '.repeat(this.maxColumns - e.length) + e;
            }
            return e;
        })
    }

    formatAnswer() {
        this.formattedAnswer = this.sum.answer.toString();
        if (this.formattedAnswer.length < this.maxColumns) {
            this.formattedAnswer = ' '.repeat(this.maxColumns - this.formattedAnswer.length) + this.formattedAnswer;
        }
    }

    constructInputArray() {
        for (let i = 0; i < this.maxColumns; i++) {
            this.inputArray.push(<div className="box" key={i} > <input type="text" size="1" maxLength="1"
                ref={input => this.inputs.push(input)} key={i} /> </div>)
        }
    }

    

    render() {
        var row = classNames('row');
        var bottom = classNames('row', 'bottom');
        let show_answer = {
            show: this.tried,
            hide: !this.tried
        };

        let answerImage = classNames({
            'answer-image': true,
            ...show_answer,
        });

        let answerNumber = classNames({
            'back': true,
            row: true,
            ...show_answer,
            'answer-number': true
        });
        this.inputs = [];
        let showAnswer = this.state.tried || this.props.displayOnly;               
        return (
            <div className="container">
                <div className={classNames({ sum: true, blackBorder: true })} ref="sum">
                    <Problem index={this.props.index} operands={this.operands} />
                    {!this.props.displayOnly && <AttemptedAnswer inputs={this.inputs} length={this.maxColumns - 1} />}
                    {showAnswer && <AnswerSteps rows={this.placeValues} classNames={answerNumber} length={this.maxColumns}> </AnswerSteps>}
                    {showAnswer && <Answer row={this.formattedAnswer} classNames={answerNumber} length={this.maxColumns} />}
                </div>
                <Check classNames={answerImage} answerCorrect={this.answerCorrect} />
            </div>
        )
    }
}

MultiplicationC.defaultProps = {
    newSum: true,
    displayOnly: false
}

export default MultiplicationC;