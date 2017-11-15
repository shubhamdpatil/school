/*global MathJax, d3pie*/
/*global */
import React, { Component, ReactDOM } from 'react';
import classNames from 'classnames';
import { getRandomIntInclusive, NUMBER_RANGE } from './../utils/Random'
import { findDOMNode } from 'react-dom';
import Hint from './../components/Popper'
import Popper from 'popper.js'
import Pie from './../components/Pie'
import { getEqualFractions, getUnEqualFractions } from './../utils/FractionGenerator'


function Index(props) {
    return <div className="circle"> {props.index} </div>
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
        this.poppers = [];
        this.addPopperRef = this.addPopperRef.bind(this);
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
        /*   if (nextProps.check) {
              this.showAnswer = true;
          }
          if (nextProps.new) {
              this.generateFraction();
              this.showAnswer = true;
              this.newSum = true;
          } */
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

    createPoppers() {
        this.poppers = this.steps.map((p, i) => {
            return new Popper(this.steps[i], this.popperRefs[i], { placement: 'right' })
        })
    }

    updatePoppers() {
        this.poppers.forEach((p) => {
            p.update();
        })
    }

    componentDidUpdate(prevProps, prevState) {
        /*   MathJax.Hub.Queue(() => {
              return MathJax.Hub.Process(null, () => {
                  console.log('process called')
              });
          })
          MathJax.Hub.Register.StartupHook("End", () => {
              this.updatePoppers();
          })
          this.newSum = false; */
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
        })
        this.newSum = false;
    }

    addPopperRef(ref) {
        if (ref) {
            this.popperRefs.push(ref)
        }
    }

    hint1() {
        if (this.fractions[0][1] !== this.fractions[1][1]) {
            return `दोन्ही अपूर्णांकांचे छेद सारखे नाही. दोन्ही छेदांनी भाग जाणारी सर्वात लहान संख्या ${this.fractions[2][1]} आहे. दोन्ही अपूर्णांकांचे छेद ${this.fractions[2][1]} करा. `
        } else {
            if (this.fractions[0][0] === this.fractions[1][0]) {
                return `दोन्ही अपूर्णांकांचा अंश आणि छेद सारखे आहे.म्हणून दोन्ही अपूर्णांक सारखे आहे.`
            } else if (this.fractions[0][0] < this.fractions[1][0]) {
                return <div> <Jax> {this.lhs} </Jax>
                    <span> चा अंश छोटा म्हणून तो  </span> < Jax > {this.rhs} </Jax > <span >पेक्षा छोटा आहे. </span>
                </div>
            } else {
                return <div> <Jax> {this.lhs}  </Jax> <span> चा अंश मोठा म्हणून तो </span> <Jax>{this.rhs}</Jax> <span> पेक्षा मोठा आहे. </span>  </div>
            }
        }
    }

    hint2() {
        const comparator = this.answer === this.lt ? `छोटा` : `मोठा`;
        if (this.answer === this.eq) {
            return `दोन्ही अपूर्णांकांचा अंश आणि छेद सारखे आहे.म्हणून दोन्ही अपूर्णांक सारखे आहे.`
        } else if (this.answer === this.lt) {
            return <div> <Jax> {this.answerLhs} </Jax>
                <span> चा अंश छोटा म्हणून तो  </span> < Jax > {this.answerRhs} </Jax > <span >पेक्षा छोटा आहे. </span>
                <span> म्हणजेच </span> <Jax> {this.lhs} </Jax> <span> हा </span> <Jax> {this.rhs} </Jax> <span> पेक्षा छोटा आहे. </span>
            </div>
        } else {
            return <div>
                <Jax> {this.answerLhs}  </Jax> <span> चा अंश मोठा म्हणून तो </span> <Jax>{this.answerRhs}</Jax> <span> पेक्षा मोठा आहे. </span>
                <span> म्हणजेच </span> <Jax> {this.lhs} </Jax> <span> हा </span> <Jax> {this.rhs} </Jax> <span> पेक्षा मोठा आहे. </span>  
            </div>
        }
    }



    render() {
        this.steps = [];
        const showStep2 = this.fractions[0][1] !== this.fractions[1][1];
        const comparator = this.answer === this.lt ? `छोटा` : `मोठा`;
        return (
            <div key={this.g++} width="800px" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div key={this.g++} ref={el => this.steps.push(el)} style={{ borderWidth: '2px', borderColor: 'red', margin: '5px', borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Pie width="300" height="300" new={this.newSum} data={this.fraction1} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <Jax>
                                {this.lhs}
                            </Jax>
                            <Jax inline>{this.question}</Jax>
                            <Jax inline>
                                {this.rhs}
                            </Jax>
                        </div>
                        {!showStep2 && <div >
                            <Jax>
                                \therefore  {this.lhs}
                            </Jax>
                            <Jax inline>{this.answer}</Jax>
                            <Jax inline>
                                {this.rhs}
                            </Jax>
                        </div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Pie width="300" height="300" new={this.newSum} data={this.fraction2} />
                    </div>
                </div>
                {showStep2 && <div key={this.g++} ref={el => this.steps.push(el)} style={{ borderWidth: '2px', borderColor: 'green', borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div >
                        <Pie width="300" height="300" new={this.newSum} data={this.fraction3} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <Jax>
                                {this.answerLhs}
                            </Jax>
                            <Jax inline>{this.answer}</Jax>
                            <Jax inline>
                                {this.answerRhs}
                            </Jax>
                        </div>
                        <div >
                            <Jax>
                                \therefore  {this.lhs}
                            </Jax>
                            <Jax inline>{this.answer}</Jax>
                            <Jax inline>
                                {this.rhs}
                            </Jax>
                        </div>
                    </div>
                    <div>
                        <Pie width="300" height="300" new={this.newSum} data={this.fraction4} />
                    </div>
                </div>}
                <Hint key={this.g++} display={this.showPopper} refId={this.addPopperRef} >
                    {this.hint1()}
                    {/*  {`दोन्ही अपूर्णांकांचे छेद सारखे नाही.दोन्ही छेदांनी भाग जाणारी सर्वात लहान संख्या ${ this.fractions[2][1] } आहे.दोन्ही अपूर्णांकांचे छेद ${ this.fractions[2][1] } करा. `}  */}
                </Hint>
                {showStep2 && < Hint key={this.g++} display={this.showPopper} refId={this.addPopperRef} >
                    {this.hint2()}
                </Hint>}

            </div >
        )
    }
}

export default PieFraction;