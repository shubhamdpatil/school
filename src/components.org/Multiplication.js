import React, { Component } from 'react';
import styles from './Multiplication.css';
import Multiplication from './../store/Multiplication'
import correctAnswer from './check3.png'
import wrongAnswer from './wrong-answer.png'
import { findDOMNode } from 'react-dom';
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
        this.getPlaceValues(this.addition.answer);
        this.placeValues = this.formatRows(this.placeValues, '+')
    }

    componentDidMount() {
        this.setCss();
    }

    setHeight() {
        const el = findDOMNode(this.refs.sum);
        let sumHeight;
        if (!this.tried) {
            sumHeight = (50 * (this.props.size + 1)) + 30 + 'px';
            console.log(' sumHeight 1 : ' + sumHeight)
        } else {
            sumHeight = (50 * (this.props.size + 1 + this.operands.length)) + 30 + 'px';
            console.log(' sumHeight  2 : ' + sumHeight);
        }
        el.style.setProperty('--sum-height', sumHeight);
    }

    setWidth() {
        const el = findDOMNode(this.refs.sum);
        let sumWidth = (50 * (this.props.digits + 1)) + 'px';
        el.style.setProperty('--sum-width', sumWidth);
    }

    setCss() {
        this.setWidth();
        this.setHeight();
    }

    getPlaceValues(remainder) {
        let row = this.addition.operands[0].toString().split('');
        row.map((e, index) => {
            this.placeValues.push(Math.floor(this.addition.operands[1] *
                (e * Math.pow(10, row.length - index - 1))));
        })
        this.placeValues.reverse();
    }

    createSum() {
        this.addition = new Multiplication(this.props.digits, this.props.size);
        this.columns();
        this.inputs = [];
        this.inputArray = [];
        this.onCheck = this.onCheck.bind(this);
        this.state = { tried: false };
        this.formatOperands();
        this.formatAnswer();
        this.tried = false;
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
        this.maxColumns = this.props.digits + this.props.size + 1;
    }

    onCheck() {
        let answer = '';
        this.inputs.map(e => {
            return answer += e.value.toString();
        })
        let result = this.addition.checkAnswer(parseInt(answer, 10))
        if (result) {
            this.answerCorrect = true;
        } else {
            this.answerCorrect = false;
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
        this.operands = this.addition.operands.map((e, index) => {
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
        this.formattedAnswer = this.addition.answer.toString();
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
        return (
            <div className="container">
                <div className={classNames({ sum: true, black: true })} ref="sum">
                    <Problem index={this.props.index} operands={this.operands} />
                    <AttemptedAnswer inputs={this.inputs} length={this.maxColumns - 1} />
                    {this.state.tried && <AnswerSteps rows={this.placeValues} classNames={answerNumber} length={this.maxColumns}> </AnswerSteps>}
                    <Answer row={this.formattedAnswer} classNames={answerNumber} length={this.maxColumns} />
                </div>
                <Check classNames={answerImage} answerCorrect={this.answerCorrect} />
            </div>
        )
    }
}

export default MultiplicationC;