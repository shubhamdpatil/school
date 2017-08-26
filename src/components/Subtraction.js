import React, { Component } from 'react';
import styles from './Subtraction.css';
import correctAnswer from './check3.png'
import wrongAnswer from './wrong-answer.png'
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';


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

class Subtraction extends Component {

    constructor(props) {
        super(props);
        this.maxLength();
        this.formatOperands();
        this.formatAnswer();
        this.log();
    }

    log() {
        this.formattedOperands.map((e, i) => {
            console.log('formatted: ' + e);
        })
        console.log('formatted answer: ' + this.formattedAnswer)
    }

    componentDidMount() {
        this.setCss();
    }

    setCss() {
        const el = findDOMNode(this.refs.sum);
        let pos = $(el).position();
        let sumWidth = (20 * (this.props.digits + 1)) + 'px';
        let sumHeight = (20 * (this.props.size + 1)) + 10 + 'px';
        el.style.setProperty('--sum-width', sumWidth)
        el.style.setProperty('--sum-height', sumHeight)
        console.log('pos ' + pos.top + ' width: ' + $(el).outerWidth(true));
    }

    formatOperands() {
        this.formattedOperands = [];
        for (let i = 0; i < this.props.operands.length; i++) {
            let s = this.props.operands[i].toString();
            if (s.length < this.props.digits) {
                for (let j = 0; j < this.props.digits - s.length; j++) {
                    s = ' '.repeat(1) + s;
                }
            }
            i == 0 ? s = ' '.repeat(1) + s : s = '-' + s.toString();
            s = s.split('');
            this.formattedOperands.push(s);
        }
        let s = this.props.answer.toString();
        if (s.length < this.props.digits) {
            s = ' '.repeat(1) + s;
        }
    }

    maxLength() {
        let max = Math.max(this.props.operands);
        let result = max.toString().split('').length;
        console.log('maxlen ' + result);
        this.maxlen = result;
    };

    formatAnswer() {
        let s = this.props.answer.toString();
        if (s.length < this.maxlen) {
            s = ' '.repeat(this.maxlen - s.length + 1) + s;
        }
        this.formattedAnswer = s.toString().split('');;
    }

    render() {
        var row = classNames('row');
        var bottom = classNames('row', 'bottom');

        return (
            <div className="container">
                <div className={classNames({ sum: true, blackBorder: true })} ref="sum">
                    {
                        this.formattedOperands.map((e, i) => {
                            return <Row row={e} key={i} index={i} length={this.maxlen} />
                        })
                    }
                    <Row row={this.formattedAnswer} length={this.maxlen} />
                </div>
            </div>
        )
    }
}

export default Subtraction;