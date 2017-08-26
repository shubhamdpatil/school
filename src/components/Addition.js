import React, { Component } from 'react';
import styles from './../styles/Globals.css'
import Addition from './../store/Addition'
import correctAnswer from './check3.png'
import wrongAnswer from './wrong-answer.png'
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

function AnswerImage(props) {
    return <div className={classNames(props.classNames)}><div ><img src={props.answerCorrect ? correctAnswer : wrongAnswer} style={{ maxWidth: '100%' }} alt="" /> </div></div>
}

function Row(props) {
    let boxes = [];
    let emptyBox = '';
    /* if (props.row.length < props.length) {
        emptyBox = <div className="box"> </div>
    } */
    boxes = props.row.map((e, i) => {
        return <div className="box" key={i} > {e} </div>
    });
    let classes = classNames('row', props.classNames)
    return <div className={classes} key={props.index}> {emptyBox} {boxes} </div>
}

function Input(props) {
    var bottom = classNames({ row: true, bottom: true });
    let inputs = [];
    if (props.emptyBox) {
        inputs.push(<div className="box" key={inputs.length}></div>);
    }
    for (let i = 0; i < props.length; i++) {
        inputs.push(<div className="box" key={inputs.length} > <input type="text" size="1" maxLength="1"
            ref={input => props.inputs.push(input)} key={i} /> </div>)
    }
    return <div className={bottom}> {inputs} </div>
}

class AdditionC extends Component {

    constructor(props) {
        super(props);
        this.constructOperandsArray();
    }

    componentDidMount() {
        this.setCss();
    }

    setCss() {
        const el = findDOMNode(this.refs.sum);
        let sumWidth = (50 * (this.props.digits + 1)) + 'px';
        let sumHeight = (50 * (this.props.size + 1)) + 30 + 'px';
        el.style.setProperty('--sum-width', sumWidth)
        el.style.setProperty('--sum-height', sumHeight)
    }

    constructOperandsArray() {
        this.addition = new Addition(this.props.digits, this.props.size, this.props.operation);

        this.maxlen = this.maxLength();
        this.operands = this.addition.formattedOperands.map((e, index) => {
            return e.toString().split('');
        });
        this.answer = this.addition.answer.toString().split('');
        this.inputs = [];
        this.inputArray = [];
        this.onClick = this.onClick.bind(this);
        this.state = { tried: false };
        this.formatAnswer();
        // this.constructInputArray();
    }

    componentWillReceiveProps(nextProps) {
        console.log('new prop received');
        if (nextProps.check) {
            this.onClick();
        }
    }

    maxLength = () => {
        /*       let max = Math.max(this.addition.operands);
              let result = max.toString().split('').length;
              console.log('maxlen ' + result);
              return result; */
        return this.props.digits;
    };

    onClick() {
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
    }

    getNumberOfAnswerColumns() {
        return this.props.operation === 'addition' ? this.addition.operands[0].toString().length + 1 :
            this.addition.operands[0].toString().length;
    }

    formatAnswer() {
        let maxLen = this.getNumberOfAnswerColumns();
        let s = this.addition.answer.toString();
        if (s.length < maxLen) {
            s = ' '.repeat(maxLen - s.length + 1) + s;
        }
        this.formattedAnswer = s.toString().split('');;
    }

    constructInputArray() {
        for (let i = 0; i < this.maxLength(); i++) {
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
        this.inputs = [];;
        let emptyBox = this.props.operation === 'subtraction' ? true : false;
        return (
            <div className="container">
                <div className={classNames({ sum: true, blackBorder: true })} ref="sum">
                    <Index index={this.props.index} />
                    {
                        this.operands.map((e, i) => {
                            return <Row row={e} key={i} index={i} length={this.maxlen} />
                        })
                    }
                    <Input inputs={this.inputs} length={this.getNumberOfAnswerColumns()} emptyBox={emptyBox} />
                    <Row row={this.formattedAnswer} classNames={answerNumber} length={this.getNumberOfAnswerColumns()} />
                </div>
                <AnswerImage classNames={answerImage} answerCorrect={this.answerCorrect} />
            </div>
        )
    }
}

export default AdditionC;