/*global MathJax, d3pie*/
/*global */
import React, { Component, ReactDOM } from 'react';
import classNames from 'classnames';
import { getRandomIntInclusive, NUMBER_RANGE } from './../utils/Random'
import { findDOMNode } from 'react-dom';
import MyPopper from './../components/Popper'
import Popper from 'popper.js'
import Pie from './../components/Pie'
import { getEqualFractions, getUnEqualFractions } from './../utils/FractionGenerator'


function Index(props) {
    return <div className="circle"> {props.index} </div>
}

function JaxForeignObject(props) {
    return (<foreignObject x="100" y="100" width="100" height="100">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Times; font-size:50px">
            <script type="math/tex">
                \frac{1}{2}
            </script>
        </div>
    </foreignObject>
    )
}

function Jax(props) {
    if (props.inline) {
        return (
            <span ref={props.ref} style={{ fontSize: '40px' }}>
                <script type="math/tex">
                    {props.children}
                </script >
            </span>)
    } else {
        return (
            <span ref={props.ref} style={{ fontSize: '40px' }}>
                <script type="math/tex" mode="display">
                    {props.children}
                </script >
            </span>)
    }
}

class PieFraction extends React.Component {
    constructor(props) {
        super(props);
        this.showAnswer = true;
        this.fraction1 = [];
        this.fraction2 = [];;
        this.ne = '\\style{color:red}{\\ne}';
        this.lt = '\\style{color:red;font-size:30px}{<}';
        this.gt = '\\style{color:red; font-size:30px}{>}';
        this.eq = '\\style{color:green}{=}';
        this.g = 0;
        this.question = '{\\style{color:red;margin:10px}{?}}';
        this.generateFraction();
        this.showPopper = 'block'
        this.popperRefs = [];
        this.sumRefs = [];
        this.poppers = [];
        this.addPopperRef = this.addPopperRef.bind(this);
        this.addSumRef = this.addSumRef.bind(this);
        this.refsAttached = this.refsAttached.bind(this);
        this.pies = [];
    }

    getRandomExcluding(max, exclude) {
        let number;
        do {
            number = getRandomIntInclusive(1, max);
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
            this.newSum = true;
        }
    }

    answerStep() {
        const lhs = `\\frac{${this.fractions[0][0]}}{${this.fractions[0][1]}}`;
        const rhs = `\\frac{${this.fractions[1][0]}}{${this.fractions[1][1]}}`;
        const answerLhs = `\\frac{${this.fractions[2][0]}}{${this.fractions[2][1]}}`;
        const answerRhs = `\\frac{${this.fractions[3][0]}}{${this.fractions[3][1]}}`;
        this.lhs = `{\\style{color:#4682B4}{${lhs}}}`;
        this.rhs = `{\\style{color:Tomato}{${rhs}}}`;
        this.answerLhs = `{\\style{color:#4682B4}{${answerLhs}}}`;
        this.answerRhs = `{\\style{color:Tomato}{${answerRhs}}}`;
        this.step2 = `{${this.lhs}} ${this.answer} {${this.rhs}}`
    }

    exchangeFractions() {
        const temp = [...this.fraction2];
        this.fraction2 = [...this.fraction1];
        this.fraction1 = [...temp];
    }

    generateFraction() {
        const equal = 0// getRandomIntInclusive(0, 1);
        let numeratorFactor, denominatorFactor;
        let numeratorEquality, denominatorEquality;
        let sign;
        if (equal) {
            this.fractions = getEqualFractions(16);
        }
        else {
            this.fractions = getUnEqualFractions(16);
        }
        console.log(' this.fractions  ' + JSON.stringify(this.fractions))
        numeratorFactor = this.fractions[1][0] / this.fractions[0][0];
        if (this.fractions[0][0] / this.fractions[0][1] > this.fractions[1][0] / this.fractions[1][1])
            this.answer = this.gt;
        else if (this.fractions[0][0] / this.fractions[0][1] < this.fractions[1][0] / this.fractions[1][1])
            this.answer = this.lt;
        else
            this.answer = this.eq;
        this.step2Hint = `Fractions are equal`;
        numeratorEquality = this.eq;
        denominatorEquality = this.eq;
        sign = '\\times';
        this.step1Hint = `In numerator ${this.fractions[1][0]} is ${this.fractions[0][0]} times ${numeratorFactor} and in denominator ${this.fractions[1][1]} is ${this.fractions[0][1]}  times ${numeratorFactor}`

        this.step1 = `{${this.fractions[0][0]} ${sign} ${numeratorFactor} \\over ${this.fractions[0][1]} ${sign} ${numeratorFactor}} {${numeratorEquality} \\over ${denominatorEquality}}{${this.fractions[1][0]}  \\over ${this.fractions[1][1]}}`
        this.answerStep(this.fractions);
        this.formatPieData();
    }


    /*   generateFraction1() {
                this.fraction1 = [];
            this.fraction2 = [];
          this.fractions[0][1] = getRandomIntInclusive(2, 3);
          this.fractions[0][0] = getRandomIntInclusive(1, this.fractions[0][1]);
          const equal = 1;//getRandomIntInclusive(0, 1);
          numeratorFactor = getRandomIntInclusive(1, 3);
          const numeratorEqual = 0;//getRandomIntInclusive(0, 1);
          let numeratorEquality = null;
          let denominatorEquality = null;
          const multiplySum = 1;// getRandomIntInclusive(0, 1);
          let sign = null;

          if (equal) {
                this.fraction2.push(1);
            this.fraction2.push(16);
              this.answer = this.eq;
              this.step2Hint = `Fractions are equal`;
              numeratorEquality = this.eq;
              denominatorEquality = this.eq;
              if (multiplySum) {
                sign = '\\times';
            this.step1Hint = `In numerator ${this.fractions[1][0]} is ${this.fractions[0][0]} times ${numeratorFactor} and in denominator ${this.fractions[1][1]} is ${this.fractions[0][1]}  times ${numeratorFactor}`
              }
              else {
                sign = '\\div';
            this.exchangeFractions();
                  this.step1Hint = `In numerator ${this.fractions[0][0]} divided by ${numeratorFactor} is ${this.fractions[1][0]} and in denominator ${this.fractions[0][1]} divided by ${numeratorFactor} is ${this.fractions[1][1]} `
              }

          } else {
                this.step2Hint = `Fractions are not equal`;
            if (numeratorEqual) {
                this.fraction2.push(this.fractions[0][0] * numeratorFactor);
            this.fraction2.push(this.fractions[0][1] * this.getRandomExcluding(numeratorFactor));
              } else {
                this.fractions[1][1] = this.fractions[0][1] * numeratorFactor;
            this.fractions[1][0] = this.fractions[0][1] * this.getRandomExcluding(this.fractions[1][1], numeratorFactor);
              }

              if (multiplySum) {
                sign = '\\times';
            if (numeratorEqual) {
                this.step1Hint = `In numerator ${this.fractions[1][0]} is ${this.fractions[0][0]} times ${numeratorFactor}, but in denominator ${this.fractions[1][1]} is not ${this.fractions[0][1]}  times ${numeratorFactor}`

            } else {
                this.step1Hint = `In numerator ${this.fractions[1][0]} is not ${this.fractions[0][0]} times ${numeratorFactor}, but in denominator ${this.fractions[1][1]} is ${this.fractions[0][1]}  times ${numeratorFactor}`
            }
            }
              numeratorEquality = numeratorEqual ? this.eq : this.ne;
              denominatorEquality = !numeratorEqual ? this.eq : this.ne;
              this.answer = this.ne;

          }
          this.step1 = `{${this.fractions[0][0]} ${sign} ${numeratorFactor} \\over ${this.fractions[0][1]} ${sign} ${numeratorFactor}} {${numeratorEquality} \\over ${denominatorEquality}}{${this.fractions[1][0]}  \\over ${this.fractions[1][1]}}`
          this.answerStep();
      }
   */
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
        //   this.createPoppers();
        //  this.pie();
        MathJax.Hub.Queue(() => {
            return MathJax.Hub.Process(null, () => {
                //     this.updatePoppers();
            });
        })
        this.newSum = false;
    }

    formatPieData() {
        const fraction1 = this.fraction1 = [];
        const fraction2 = this.fraction2 = [];
        const fraction3 = this.fraction3 = [];
        const fraction4 = this.fraction4 = [];


        let numberator = 1;
        for (let i = 0; i < this.fractions[0][0]; i++) {
            fraction1.push({ label: `$\\frac{${numberator++}}{${this.fractions[0][1]}}$`, value: 1, color: "#87CEFA" });
        }
        for (let i = 0; i < this.fractions[0][1] - this.fractions[0][0]; i++) {
            fraction1.push({ label: ``, value: 1, color: "#ffffff" });
        }

        numberator = 1;
        for (let i = 0; i < this.fractions[1][0]; i++) {
            fraction2.push({ label: `$\\frac{${numberator++}}{${this.fractions[1][1]}}$`, value: 1, color: "#87CEFA" });
        }
        for (let i = 0; i < this.fractions[1][1] - this.fractions[1][0]; i++) {
            fraction2.push({ label: ``, value: 1, color: "#ffffff" });
        }

        numberator = 1;
        for (let i = 0; i < this.fractions[2][0]; i++) {
            fraction3.push({ label: `$\\frac{${numberator++}}{${this.fractions[2][1]}}$`, value: 1, color: "#87CEFA" });
        }
        for (let i = 0; i < this.fractions[2][1] - this.fractions[2][0]; i++) {
            fraction3.push({ label: ``, value: 1, color: "#ffffff" });
        }

        numberator = 1;
        for (let i = 0; i < this.fractions[3][0]; i++) {
            fraction4.push({ label: `$\\frac{${numberator++}}{${this.fractions[3][1]}}$`, value: 1, color: "#87CEFA" });
        }
        for (let i = 0; i < this.fractions[3][1] - this.fractions[3][0]; i++) {
            fraction4.push({ label: ``, value: 1, color: "#ffffff" });
        }
    }

    componentDidMount() {
        this.createPoppers();
        MathJax.Hub.Register.StartupHook("End", () => {
            this.updatePoppers();
            //  this.pie()
        })
        this.newSum = false;
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
            <div  >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className={classNames('sum1', border)} style={{ width: '200px', height: '100px' }} ref={this.addSumRef} >
                        <Jax>
                            {this.lhs}
                        </Jax>
                    </div>
                </div>
            </div >
        )
    }

    renderProblem1(border, anchor) {
        let el1 = null;
        return (
            <div key={this.g++} >

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className={classNames('sum1', border)} style={{ width: '200px', height: '100px' }} ref={this.addSumRef} >
                        <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                            {'Are these this.fractions '}
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
                        <Index index={anchor} />

                        <div>
                            <Jax>
                                {this.lhs}
                            </Jax>
                            <Jax inline>{this.answer}</Jax>
                            <Jax inline>
                                {this.rhs}
                            </Jax>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    renderAnswer(border, anchor) {
        return (
            <div ref={this.props.ID}>
                <div style={{ width: '50%', justifyContent: 'center', alignContent: 'center' }} key={this.g++} className={classNames('sum1', border)} >
                    15 is divisible by 5 and 15
                </div>
                <div key={this.g++} className={classNames('sum1', border)} ref={this.addSumRef} >
                    <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                        {this.step1Hint}
                    </MyPopper>
                    <Jax inline>
                        {this.step1}
                    </Jax>
                </div>
                <div key={this.g++} className={classNames('sum1', border)} ref={this.addSumRef} >
                    <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                        {this.step2Hint}
                    </MyPopper>
                    <Jax inline>
                        {this.step2}
                    </Jax>
                </div>
            </div >)
    }

    resetPoppers() {
        this.popperRefs = [];
        this.sumRefs = []
        this.poppers.forEach(p => p.destroy())
        this.pies.forEach(p => p.destroy())
        this.poppers = [];
        this.pies = [];
    }


    refsAttached(el) {
        console.log(`refs: ${el}`)
        this.container = el;
    }

    pieReference(pie) {
        console.log(`pie ${pie}`)
        this.pie = pie;
    }

    render() {
        const fraction = `\\frac{${this.fractions[0][0]}}{${this.fractions[0][1]}}`
        return (
            <div width="800px" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ borderWidth: '2px', borderColor: 'red', margin: '5px', borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Pie width="300" height="300" new={this.newSum} data={this.fraction1} />
                    </div>
                    <div>
                        <Jax>
                            {this.lhs}
                        </Jax>
                        <Jax inline>{this.question}</Jax>
                        <Jax inline>
                            {this.rhs}
                        </Jax>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Pie width="300" height="300" new={this.newSum} data={this.fraction2} />
                    </div>
                </div>
                <div style={{ borderWidth: '2px', borderColor: 'green', borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Pie width="300" height="300" new={this.newSum} data={this.fraction3} />
                    </div>
                    <div>
                        <Jax>
                            {this.answerLhs}
                        </Jax>
                        <Jax inline>{this.answer}</Jax>
                        <Jax inline>
                            {this.answerRhs}
                        </Jax>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Pie width="300" height="300" new={this.newSum} data={this.fraction4} />
                    </div>
                </div>
            </div >
        )
    }

    render5() {
        console.log(`this.fractions[0][0] ${this.fractions[0][0]}`)
        return (
            <div key={this.g++}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1000" height="500">
                    <circle cx="100" cy="100" r="99" fill="yellow" stroke="red" />
                    <circle cx="100" cy="100" r="3" fill="blue" />
                    <foreignObject x="100" y="100" width="100" height="100">
                        <div xmlns="http://www.w3.org/1999/xhtml" >
                            <script type="math/tex">
                                \frac{this.fractions[0][0]}{this.fractions[0][1]}
                            </script>
                        </div>
                    </foreignObject>
                </svg>
            </div>
        )
    }

    render1() {
        this.resetPoppers();
        return (
            <div id="sum11" ref={el => this.el = el} style={{
                display: 'inline-flex', margin: '20px', flexWrap: 'row wrap',
                flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
            }}>
                <div style={{ display: 'inline-flex' }}>
                    <div ref={el => this.pie1 = el} style={{ background: '#4682B4', width: '50%', height: '400px' }}>
                    </div>
                    <div ref={el => this.pie2 = el} style={{ background: 'Tomato', width: '50%', height: '400px' }}>
                    </div>
                </div>
                {this.renderProblem('blueBorder', 'Q')}
                {this.showAnswer && this.renderAnswer('greenBorder', 'A')}
            </div >
        )
    }
}

export default PieFraction;