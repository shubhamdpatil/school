/*global MathJax*/
import React, { Component, ReactDOM } from 'react';
import classNames from 'classnames';
import { getRandomIntInclusive, NUMBER_RANGE } from './../utils/Random'
import { findDOMNode } from 'react-dom';
import MyPopper from './../components/Popper'
import Popper from 'popper.js'



function Index(props) {
    return <div className="circle"> {props.index} </div>
}


function Jax(props) {
    if (props.inline) {
        return (
            <span ref={props.ref}>
                <script type="math/tex">
                    {props.children}
                </script >
            </span>)
    } else {
        return (
            <span ref={props.ref}>
                <script type="math/tex" mode="display">
                    {props.children}
                </script >
            </span>)
    }
}

class Fraction extends React.Component {
    constructor(props) {
        super(props);
        this.showAnswer = true;
        this.fraction1 = [];
        this.fraction2 = [];;
        this.ne = '\\style{color:red}{\\ne}';
        this.eq = '\\style{color:green}{=}';
        this.g = 0;
        this.question = '{\\style{color:red;margin:10px}{?}}';
        this.generateFraction();
        this.steps = [];
        this.showPopper = 'block'
        this.popperRefs = [];
        this.sumRefs = [];
        this.poppers = [];
        this.addPopperRef = this.addPopperRef.bind(this);
        this.addSumRef = this.addSumRef.bind(this);
    }

    getRandomExcluding(exclude) {
        let number;
        do {
            number = getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max);
        } while (exclude === number)
        return number;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
        }
        if (nextProps.new) {
            this.sumRefs = [];
            this.generateFraction();
            this.showAnswer = true;
        }
    }

    styleFraction() {
        const lhs = `\\frac{${this.fraction1[0]}}{${this.fraction1[1]}}`;
        const rhs = `\\frac{${this.fraction2[0]}}{${this.fraction2[1]}}`;
        this.lhs = `{\\style{color:Violet}{${lhs}}}`;
        this.rhs = `{\\style{color:Tomato}{${rhs}}}`;
    }

    generateFraction() {
        this.fraction1 = [];
        this.fraction2 = [];
        this.fraction1.push(getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max));
        this.fraction1.push(getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max));
        const equal = getRandomIntInclusive(0, 1);
        this.multiple = getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max);
        if (equal) {
            this.fraction2.push(this.fraction1[0] * this.multiple);
            this.fraction2.push(this.fraction1[1] * this.multiple);
            this.answer = this.eq;
        } else {
            this.fraction2.push(this.fraction1[0] * this.multiple);
            this.fraction2.push(this.fraction1[1] * this.getRandomExcluding(this.multiple));
            this.answer = this.ne;
        }
        this.styleFraction();
    }

    createAndUpdatePoppers() {

    }

    createPoppers() {
        this.poppers = this.popperRefs.map((p, i) => {
            return new Popper(this.sumRefs[i], p, { placement: 'right' })
        })
    }

    updatePoppers() {
        this.poppers.forEach((p) => {
            p.update();
        })
    }

    componentDidUpdate(prevProps, prevState) {
        this.createPoppers();
        MathJax.Hub.Queue(() => {
            return MathJax.Hub.Process(null, () => {
                this.updatePoppers();
            });
        })
    }

    componentDidMount() {
        this.createPoppers();
        MathJax.Hub.Register.StartupHook("End", () => {
            this.updatePoppers();
            //this.popper.update();
        })
    }

    addPopperRef(ref) {
        if (ref) {
            this.popperRefs.push(ref)
        }
    }

    addSumRef(ref) {
        if (ref) {
            this.sumRefs.push(ref)
        }
    }

    renderProblem(border, anchor) {
        let el1 = null;
        return (
            <div key={this.g++} className={classNames('sum1', border)} ref={this.addSumRef} >
                <Index index={anchor} />
                <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                    {'Are these fractions '}
                    <br>
                    </br>
                    <Jax>
                        {this.eq}
                    </Jax>
                    {' OR '}
                    <Jax>
                        {this.ne}
                    </Jax>
                </MyPopper>
                <Jax>
                    {this.lhs}
                </Jax>
                <Jax inline>{this.question}</Jax>
                <Jax inline>
                    {this.rhs}
                </Jax>
            </div >
        )
    }

    renderAnswer(border, anchor) {
        const numeratorEquality = this.fraction1[0] * this.multiple === this.fraction2[0] ? this.eq : this.ne;
        const numeratorEqual = numeratorEquality === this.eq ? '' : 'not'
        const denominatorEquality = this.fraction1[1] * this.multiple === this.fraction2[1] ? this.eq : this.ne;
        const denominatorEqual = denominatorEquality === this.eq ? '' : 'not'
        const step1 = `{${this.fraction1[0]} \\times ${this.multiple} \\over ${this.fraction1[1]} \\times ${this.multiple}} {${numeratorEquality} \\over ${denominatorEquality}}{${this.fraction2[0]}  \\over ${this.fraction2[1]}}`
        const step2 = `{${this.lhs}} ${this.answer} {${this.rhs}}`
        const but = denominatorEqual === 'not' ? 'but' : '';
        const step1Hint = `${this.fraction2[0]} is ${numeratorEqual} ${this.fraction1[0]} times ${this.multiple}, ${but} ${this.fraction2[1]} is ${denominatorEqual} ${this.fraction1[1]}  times ${this.multiple}`
        const step2Hint = this.answer === this.eq ? `Fractions are equal` : `Fractions are not equal`

        return (
            <div ref={this.props.ID}>
                <div key={this.g++} className={classNames('sum1', border)} ref={this.addSumRef} >
                    <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                        {step1Hint}
                    </MyPopper>
                    <Jax inline>
                        {step1}
                    </Jax>
                </div>
                <div key={this.g++} className={classNames('sum1', border)} ref={this.addSumRef} >
                    <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                        {step2Hint}
                    </MyPopper>
                    <Jax inline>
                        {step2}
                    </Jax>
                </div>
            </div >)
    }

    resetPoppers() {
        this.popperRefs = [];
        this.sumRefs = []
        this.poppers.forEach(p => p.destroy())
        this.poppers = [];
    }

    render() {
        this.resetPoppers();
        return (
            <div style={{
                display: 'inline-flex', margin: '20px', flexWrap: 'row wrap',
                flexDirection: 'column', justifyContent: 'center'
            }}>
                {this.renderProblem('blueBorder', 'Q')}
                {this.showAnswer && this.renderAnswer('greenBorder', 'A')}
            </div>
        )
    }
}

export default Fraction;