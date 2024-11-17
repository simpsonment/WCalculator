/* eslint-disable react/no-unescaped-entities */
import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './Button.jsx';
import parse from 'html-react-parser';
import React from 'react';
import Memory from './Memory.jsx';
import History from './History.jsx';

function App() {
    //useScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js');
    const root = '$$ \\sqrt[2]{x} $$'; //( x )**(1/2) temp.replace /(\d{1,})\*\*(1/2)/, 
    const div1x = '$$ 1 \\over{x} $$';
    const square = '$$ {x}^2 $$';

    const [val, setValue] = useState(0);
    const [temp, setTemp] = useState("");
    const [operator, setOp] = useState("");
    const [lock, setLock] = useState(false);
    const [equal, setEqual] = useState(false);

    const [complex, setComplex] = useState(false);
    const [full, setFull] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [op, setop] = useState("");
    const [prevTemp, setPrevTemp] = useState("");

    const operators = ["+", "-", "*", "/"];
    const buttons = [{ "id": 1, "value": "%", "disability": 1 }, { "id": 2, "value": "CE" }, { "id": 3, "value": "C" }, { "id": 4, "value": "&#9003;" },
        { "id": 5, "value": div1x, "style": { fontSize: '9px' }, "disability": 1 },
        { "id": 6, "value": square, "style": { fontSize: "11px" }, "disability": 1 },
        { "id": 7, "value": root, "style": { fontSize: '11px' }, "disability": 1 },
        { "id": 8, "value": "&divide;", "operator": "/", "disability": 1 },
        { "id": 9, "value": "7" }, { "id": 10, "value": "8" }, { "id": 11, "value": "9" }, { "id": 12, "value": "&times;", "disability": 1 },
        { "id": 13, "value": "4" }, { "id": 14, "value": "5" }, { "id": 15, "value": "6" }, { "id": 16, "value": "&minus;", "disability": 1 },
        { "id": 17, "value": "1" }, { "id": 18, "value": "2" }, { "id": 19, "value": "3" }, { "id": 20, "value": "+", "disability": 1 },
        { "id": 21, "value": "&plusmn;", "disability": 1 }, { "id": 22, "value": "0" }, { "id": 23, "value": ".", "disability": 1 },
        { "id": 24, "value": "=", "style": { backgroundColor: '#005792', color: 'white' } }];

    const replacements = {
        '/': '&divide;',
        '*': '&times;',
        '-': '&minus;'
    };

    const [history, setHistory] = useState([]);
    const [memory, setMemory] = useState([]);
    const [selected, setSelected] = useState(-1);
    function showMemory(v) {
        if (equal||complex) CE();
        setValue(v);
        setLock(true);
    }
    

    function carcuration(v) {
        setRepeat(false);
        if (operator != "") setPrevTemp(temp+" "+operator);
        if (!isNaN(v)) {
            console.log("temp:", temp, "operator:", operator, "val:", val, "v:", v, v.length);
            if (equal) { setTemp(""); setEqual(false); setOp(""); setop(""); setValue(v.slice(-1)); setFull(false); setPrevTemp(""); }
            if (complex) CE();
            else if (v.length > 16) { /* empty */ }
            else if (v.includes(".")) setValue(v.toString());
            else { setValue(Number(v).toString()); }
            if (lock) {
                setLock(false);
                if (v.slice(-1) == ".") setValue("0.");
                else setValue(v.slice(-1));
            }            
        }
        else {
            console.log("prevTemp:", prevTemp, "temp:", temp, "op:", operator, "val:", val, "v:", v, "equal:", equal, "complex:", complex);
            if (equal && operators.includes(v.slice(-1))) { console.log("here1"); setTemp(val); setLock(true); setOp(v.slice(-1)); setEqual(false);  } 
            else if (operators.includes(v.slice(-1))) {
                setLock(true);
                setOp(v.slice(-1));
                setEqual(false);
                if (complex) {
                    setComplex(false); if (full) {
                        setValue(eval(temp)); setTemp(eval(temp)); setFull(false);
                        setHistory([{ 'temp': temp, 'val': eval(temp) }, ...history]);
                    }
                }
                else
                {
                        if (!lock && operator != "") {
                            setHistory([{ 'temp': temp + operator + val, 'val': eval(temp + operator + val) }, ...history]);
                            setTemp(eval(temp + operator + val)); setValue(eval(temp + operator + val));
                        } 
                        else { setTemp(val); }
                }
            }
            else if (v.slice(-1) == "=") {
                setEqual(true); setLock(true);
                if (complex) {
                    console.log(temp, temp.replaceAll("-", "-(").replaceAll("**2", ")**2"));
                    let i = temp.replace("--", "- -");
                    setHistory([{ 'temp': i, 'val': eval(i) }, ...history]);
                    setValue(eval(i)); setComplex(false);
                }
                else
                {
                    setOp(""); setop("");
                    if (equal) {
                        if (operators.includes(prevTemp.slice(-1))) { 
                            let i = val + " " + prevTemp.slice(-1) + eval(temp.replace(prevTemp, "").replace("--", "- -"));
                            let j = eval((val + prevTemp.slice(-1) + temp.replace(prevTemp, "")).replace("--", "- -"));
                            setTemp(i); setValue(j);
                            setHistory([{ 'temp': i, 'val': j }, ...history]);
                            setPrevTemp(val + " "+prevTemp.slice(-1));
                        }
                    }
                    else {
                        let i = temp + " " + operator + eval(val); let j = eval((temp + operator + val).replace("--", "- -"));
                        setTemp(i); setValue(j);
                        setHistory([{ 'temp': i, 'val': j }, ...history]);
                    }
                }

            }
        }
    }

    function buttonImpact(v) {
        if (v == "&divide;") v = operators[3];
        else if (v == "&times;") v = operators[2];
        else if (v == "&minus;") v = operators[1];

        if (isNaN(val) || !isFinite(val)) { C(); carcuration(v); console.log("badum"); }
        else if (!isNaN(v) || v == "." || v == "=" || operators.includes(v)) carcuration(val + v);
        else if (v == "&#9003;") { if (equal) { setTemp(""); setEqual(false); } carcuration(val.slice(0, -1));}
        else if (v == "CE") CE();
        else if (v == "C") C();
        else if (v == "%") {           
            setComplex(true);
            setOp("");
            setLock(true);
            setRepeat(true);
            if (repeat) {
                { console.log("here1"); setValue(prevTemp.slice(0, -1) * val / 100); setTemp(prevTemp + prevTemp.slice(0, -1) * val / 100); }
                if (operators.includes(prevTemp.slice(-1))) { setValue(eval(prevTemp.slice(0, -1)) * val / 100); setTemp(prevTemp + eval(prevTemp.slice(0, -1)) * val / 100); }
            }
            else if (operator != "") { console.log("here2"); setValue(eval(temp) * val / 100); setFull(true); setTemp(temp + operator + eval(temp) * val / 100); }
            else { 
                console.log("here3"); setValue(temp * val / 100); setTemp(temp + operator + temp * val / 100);
                if (isNaN(temp * val / 100)) { setValue(0); setTemp(0); }
            }
        }
        else if (v == "&plusmn;") {
            if (val != 0) {
                setValue(-val); //if (temp!="") setTemp("-(" + temp + ")");
            }
            if (complex) {
                if (temp.indexOf(" " + op) != -1) setTemp(temp.slice(0, temp.indexOf(" " + op) + 2) + "-(" + temp.slice(temp.indexOf(" " + op) + 2, temp.length) + ")");
                else setTemp("-(" + temp + ")");
            }
            if (equal) { setTemp(-val); setEqual(false); }
            
        }
        else if (v == div1x)  complexCalc(val,"1/");
        else if (v == square) complexCalc(val, "**2");
        else if (v == root) complexCalc(val, "**(1/2)");
    }

    function CE() {
        setValue(0);
        if (equal) C();
        else if (complex) { setComplex(false); setTemp(prevTemp.slice(0, -1)); setOp(prevTemp.slice(-1)); setRepeat(false); }
    }
    function C() {
        console.log("Cing"); setValue(0); setTemp(""); setOp(""); setop(""); setEqual(false); setFull(false); setComplex(false); setRepeat(false); setPrevTemp(""); setLock(false);
    }

    function complexCalc(value, calc) {
        let order;
        if (calc == "1/") order = (z) => calc + "(" + z + ")";                                  //case 1/x
        else order = (z) => "(" + z + ")" + calc;                                               //cases root,square
        if (operator != "") setop(operator);                                                    //set internal operator storage

        const t = temp.toString();                                                              //split temp in 2
        const p1 = t.slice(0, t.indexOf(" "+op) + 2); 
        const p2 = t.slice(t.indexOf(" "+op) + 2, t.length);
        console.log("val:",val,"operator:",operator,"op:", op,"repeat:", repeat,"temp:", temp, "p1:",p1, "p2:",p2);


        setValue(eval(order(value))); setLock(true);                                                           //calculate current
        if (repeat) { if (op != "") setTemp(p1 + order(p2));  else setTemp(order(temp)); }      //set temp for button repeated,     cases: with/without operation
        else if (complex || operator != "") { setTemp(temp + " "+ operator + order(value) ); setOp(""); setFull(true); setRepeat(true); } //set temp,     case: without repetition
        else { setTemp(order(eval(value))); setRepeat(true); }                                        //set temp,     case: first instance
        setComplex(true);
        setEqual(false);
    }

    function showTemp(tem,method) {
        let sqr = ")^2";
        let root = ")^&1/2&";
        tem = tem.replaceAll(")**2", sqr).replaceAll(")**(1/2)", root);
        let temp1;
        if (tem.indexOf(" "+op) == -1) temp1 = tem; else temp1 = tem.slice(0, tem.indexOf(" "+op)+1);
        //console.log("operator", operator, "op", op, "tem", tem);
        let temp2 = tem.replace(temp1, "");
        //if (temp2 != "") temp2 = op +" "+ temp2.slice(1, temp2.length);
        //console.log("temp1", temp1, tem.indexOf(op), "temp2", temp2);
        function iter(t) {
            let z = "";
            let z1 = t;
            do {
                t = z1;
                let sqrIndex;
                let rootIndex;
                let parIndex;
                if (t.indexOf(sqr) == -1) sqrIndex = 1/0; else sqrIndex = t.indexOf(sqr);
                if (t.indexOf(root) == -1) rootIndex = 1/0; else rootIndex = t.indexOf(root);
                if (t.indexOf(")") == -1 && parIndex != sqrIndex && parIndex != rootIndex) parIndex = 1/0; else parIndex = t.indexOf(")");
                switch (Math.min(sqrIndex, rootIndex, parIndex)) {
                    case sqrIndex:
                        z = t.slice(t.lastIndexOf("("), t.indexOf(sqr) + 3);
                        z1 = method ? z.replace("(", "sqr[").replace(sqr, "]") : z.replace("(", "{[").replace(sqr, "]}^2");
                        z1 = t.replace(z, z1);
                        break;
                    case rootIndex:
                        z = t.slice(t.lastIndexOf("("), t.indexOf(root) + 7);
                        z1 = method ? z.replace("(", parse("&radic;") + "[").replace(root, "]") : z.replace("(", "\\sqrt{").replace(root, "}");
                        z1 = t.replace(z, z1);
                        break;
                    case parIndex:
                        z = t.slice(t.lastIndexOf("("), t.indexOf(")")+1);
                        z1 = method ? z.replace("(", "[").replace(")", "]") : z.replace("(", "{[").replace(")", "]}");
                        z1 = t.replace(z, z1);
                }
            } while (z1 != t);
            return z1;
        }
        //console.log("temp1");
        temp1 = iter(temp1);
        //console.log("temp2");
        temp2 = iter(temp2);
        tem = (temp1 + temp2).toString().replaceAll("[", "( ").replaceAll("]", " )");
        console.log(tem);
        //t.replace("(" + t.match(/\d*/) + ")**2", "sqr(" + t.match(/\d*/)+")")
        //t.indexOf(t.match(/\d/))), "sqr") 
        return tem
    }

    function showVal(value) {
        
        if (isNaN(value)) {
            value = "Invalid Input";
            buttons.forEach((button) => { if (button.disability) button.disability = 0; });
        }
        else if (!isFinite(value)) {
            //value = "Cannot divide by zero";
            buttons.forEach((button) => { if (button.disability) button.disability = 0; });
        }
        else if (value.toString().length > 16) { console.log("length:", (value.toString().slice(0, 16) / 10 ** 15).toString()); value = (value.toString()) ; }  //value = "Overflow";
        else { 
            if (value.toString().indexOf(".") != -1) value = Number(value.toString().slice(0, value.toString().indexOf("."))).toLocaleString() + value.toString().slice(value.toString().indexOf("."), value.length);
            else value = Number(value).toLocaleString();
        }
        return value;
    }

    //auto scroll p to the end when needed + apply mathJax
    useEffect(() => {
        if (typeof window?.MathJax !== "undefined") {
            window.MathJax.typesetClear()
            window.MathJax.typeset()
        }
        document.querySelector('p').scrollLeft = document.querySelector('p').scrollWidth;
    }, [temp,operator,equal])

    //overflow
    const isOverflown = ({ clientWidth, scrollWidth }) => scrollWidth > clientWidth+1
    const resizeText = ({ element }) => {
        let i = 47 // let's start with 12px
        element.style.fontSize = `${i}px`;
        let overflow = isOverflown(element);
        while (overflow) {            
            element.style.fontSize = `${i}px`
            overflow = isOverflown(element)
            i--;
        }
        element.style.fontSize = `${i}px`
    }
    useEffect(() => {
        resizeText({
            element: document.querySelector('.text')
        });
    });

    const [register, setRegister] = useState("memory");
    function select(id) {
        document.getElementById("memory").classList.remove("after-menu");
        document.getElementById("history").classList.remove("after-menu");
        document.getElementById(id).classList.add("after-menu");
        setRegister(id);
    }

    function handleHistoryClick(entry) {
        setTemp(entry.temp);
        setValue(entry.val);
        setEqual(true);
        setLock(true);
    }

    document.addEventListener('mouseup', function (e) {
        var container = document.getElementById('mem-popup');
        var entries = document.querySelectorAll('.entries');
        let a = false; let b = true;
        for (let i = 0; i < entries.length; i++) { if (entries[i].contains(e.target)) a = true; }
        var indiv = document.querySelectorAll('.individuals');
        for (let i = 0; i < indiv.length; i++) { if (indiv[i].contains(e.target)) b = false; }

        if (!container.contains(e.target) || (a&&b) ) {
            container.style.display = 'none';
            document.querySelector('.container').style.backgroundColor = '#f5f5f5';
            document.querySelector('.memory-buttons-grid').style.pointerEvents = '';

        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 617) {
            document.getElementById('mem-popup').style.display = 'none';
            document.querySelector('.container').style.backgroundColor = '#f5f5f5';
            document.querySelector('.memory-buttons-grid').style.pointerEvents = '';
        }
        let a = document.querySelector('.container').style.width;
        //a.style. = parseInt(a.style.minWidth) + 1 + 'px';
        console.log(a);
    });


 return (
     <>
         <div className="container">
             <div className="operations" >
                 <div className="calcs">
                     <p id="temp-display">{'$$' + showTemp(temp.toString()) + operator.replace(/[/*-]/g, m => parse(replacements[m])) + (equal ? "=" : "") + '$$'}</p>
                      <input className="text" type="text" autoFocus={true} onBlur={e => e.target.focus()} onKeyDown={e => (e.key == "Enter") ? document.getElementById('24').click() : 1}
                      value={showVal(val)}
                      onChange={(e) => { if (isNaN(val) || !isFinite(val)) { CE(); carcuration(e.target.value.slice(-1)); } else carcuration(e.target.value.replaceAll(",", "")); }} />
                  </div>

                  <div className="memory-buttons-grid" id="memory-buttons-grid">
                     <Memory item memory={memory} setMemory={setMemory} val={val} setValue={setValue} setLock={setLock} showMemory={showMemory} selected={selected} setSelected={setSelected}></Memory>
                  </div>
                 <div id="overlap"  >
                      <div className="buttons-grid">
                          {buttons.map((button) => {
                              return (
                                  <Button key={button.id}
                                      id={button.id}
                                      className="test"
                                      style={(!isNaN(parseInt(button.value)) || [21, 23].includes(button.id)) ?
                                          (button.disability == 0 ? { backgroundColor: '#f0f0f0' } : { backgroundColor: '#fcfefe' }) : button.style}
                                      dangerouslySetInnerHTML={{ __html: button.value }} disabled={button.disability == 0}
                                      onClick={() => { buttonImpact(button.value) }}>
                                  </Button>
                              )
                          })}
                     </div>
                     <div id="mem-popup" style={{ display: 'none', position: 'absolute', zIndex: 10, height: '295px', width: '102%', backgroundColor: '#f5f5f5', overflow: 'auto', borderRadius:'6px' }}>
                         <Memory memory={memory} setMemory={setMemory}
                             val={val} setValue={setValue} setLock={setLock} showMemory={showMemory} showVal={showVal} selected={selected} setSelected={setSelected}></Memory>
                         
                     </div>
                 </div>
             </div>

             <div className="register">
                <div id="menu-options">
                     <Button className="menu" onClick={() => select("history")}>
                         History
                         <div id="history"></div>
                     </Button><Button className="menu" onClick={() => select("memory")}>
                         Memory
                         <div id="memory" className="after-menu"></div>
                     </Button>
                 </div>
                 <div id="all-entries">
                     {register == "memory" ? <Memory memory={memory} setMemory={setMemory}
                         val={val} setValue={setValue} setLock={setLock} showMemory={showMemory} showVal={showVal} selected={selected} setSelected={setSelected}></Memory> :
                         <History history={history} showTemp={showTemp} showVal={showVal}
                             onHistoryClick={handleHistoryClick}></History>}

                 </div>
                 <Button id="clear" className="memory" onClick={() => { if (register == "memory") setMemory([]); else { setHistory([]); } }}
                     style={{ position: 'absolute', right: 0, bottom: 0, width: '30px', height: '30px', fontSize: '22px', margin: 'auto 6px 6px auto' }}
                         dangerouslySetInnerHTML={{ __html: "&#128465;" }}></Button>
             </div>
             
         </div>
     </>          
  )
}

export default App