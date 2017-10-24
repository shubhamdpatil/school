/*global MathJax*/
import React, { Component, ReactDOM } from 'react';
import classNames from 'classnames';
import { getRandomIntInclusive, NUMBER_RANGE } from './../utils/Random'
import { findDOMNode } from 'react-dom';
import { Manager, Target, Popper, Arrow } from 'react-popper'



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

    componentDidUpdate(prevProps, prevState) {
        MathJax.Hub.Queue(function () {
            return MathJax.Hub.Process(null, () => {
            });
        })
    }

    componentDidMount() {
        Popper.update();
    }

    renderProblem(border, anchor) {
        return (
            <Manager>
                <Target>
                    <div key={this.g++} className={classNames('sum1', border)} ref={(el) => this.problemId = el} >
                        <Index index={anchor} />
                        <Jax >
                            {this.lhs}
                        </Jax >
                        <Jax inline>{this.question}</Jax>
                        <Jax inline>
                            {this.rhs}
                        </Jax>
                    </div >
                </Target>
                <Popper className="popper" placement="auto">
                    Content Right
            <Arrow className="popper__arrow" />
                </Popper>
            </Manager>
        )
    }

    renderAnswer(border, anchor) {
        const lhs = `\\frac{${this.fraction1[0]}}{${this.fraction1[1]}}`;
        const rhs = `\\frac{${this.fraction2[0]}}{${this.fraction2[1]}}`;
        const numeratorEquality = this.fraction1[0] * this.multiple === this.fraction2[0] ? this.eq : this.ne;
        const denominatorEquality = this.fraction1[1] * this.multiple === this.fraction2[1] ? this.eq : this.ne;
        const step1 = `{${this.fraction1[0]} \\times ${this.multiple} ${numeratorEquality} ${this.fraction2[0]} \\over${this.fraction1[1]} \\times ${this.multiple} ${denominatorEquality} ${this.fraction2[1]}}`
        const fraction1_0_Multiple = this.fraction1[0] * this.multiple;
        const fraction1_1_Multiple = this.fraction1[1] * this.multiple;
        const step = `{${this.fraction1[0]} \\times ${this.multiple} \\over ${this.fraction1[1]} \\times ${this.multiple}} {${this.eq} \\over ${this.eq}}{${fraction1_0_Multiple}  \\over ${fraction1_1_Multiple}}`

        const step2 = `{${fraction1_0_Multiple}  \\over ${fraction1_1_Multiple}}`
        const step3 = `{${fraction1_0_Multiple}  \\over ${fraction1_1_Multiple}} {${numeratorEquality}\\over ${denominatorEquality}} {${this.rhs}}`
        const step4 = `{${this.lhs}} ${this.answer} {${this.rhs}}`

        return (
            <div ref={this.props.ID}>
                <div key={this.g++} className={classNames('sum1', border)} >
                    <Jax inline>
                        {step}
                    </Jax>
                </div>
                <div key={this.g++} className={classNames('sum1', border)} >
                    <Jax inline>
                        {step3}
                    </Jax>
                </div>
                <div key={this.g++} className={classNames('sum1', border)} >
                    <Jax inline>
                        {step4}
                    </Jax>
                </div>
            </div >)
    }

    render() {
        return (
            <div style={{
                display: 'inline-flex', margin: '20px', flexWrap: 'row wrap',
                flexDirection: 'column', justifyContent: 'center'
            }}>
                {this.renderProblem('blueBorder', 'Q')}
                {/*                 {this.showAnswer && this.renderAnswer('greenBorder', 'A')}
 */}            </div>
        )
    }
}

export default Fraction;