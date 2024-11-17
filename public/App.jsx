import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './Button.jsx';

function App() {
    const root = '$$ \\sqrt{x} $$';
    const div1x = '$$ 1 \\over x $$';
    const square = '$$ x^2 $$'

    const [val, setValue] = useState(0);
    const [temp, setTemp] = useState("");
    const [operator, setOp] = useState("");
    const [lock, setLock] = useState(false);
    const [equal,setEqual]=useState("")

    const operators = ["+", "-", "*", "/"];
    const buttons = [{ "id": 1, "value": "%" }, { "id": 2, "value": "CE" }, { "id": 3, "value": "C" }, { "id": 4, "value": "<img src='src\\delete.png' alt='DEL'>" },
    { "id": 5, "value": div1x, "style": { fontSize: '9px' } },
    { "id": 6, "value": square, "style": { fontSize: "11px" } },
    { "id": 7, "value": root, "style": { fontSize: '11px' } },
    { "id": 8, "value": "&divide;", "operator": "/" },
    { "id": 9, "value": "7" }, { "id": 10, "value": "8" }, { "id": 11, "value": "9" }, { "id": 12, "value": "&times;" },
    { "id": 13, "value": "4" }, { "id": 14, "value": "5" }, { "id": 15, "value": "6" }, { "id": 16, "value": "&minus;" },
    { "id": 17, "value": "1" }, { "id": 18, "value": "2" }, { "id": 19, "value": "3" }, { "id": 20, "value": "+" },
    { "id": 21, "value": "&plusmn;" }, { "id": 22, "value": "0" }, { "id": 23, "value": "." }, { "id": 24, "value": "=" }];

    function carcuration(v) {
        if (!isNaN(v)) {
            console.log("temp:", temp, "op:", operator, "val:", val, "v:", v);
            if (equal == "=") { setTemp(""); setEqual(""); setOp(""); setValue(v.slice(-1)); }
            //console.log("it is a number");
            else if (v.includes(".")) {
                //if (e.target.value.lastIndexOf("0") > e.target.value.indexOf(".")) 
                setValue(v);
            }
            else { setValue(Number(v).toString()); }
            if (lock) { console.log("lock", v.slice(-1)); setValue(v.slice(-1)); setLock(false); }
        }
        else {
            console.log("temp:", temp, "op:", operator, "val:", val, "v:", v);
            if (equal == "=" && operators.includes(v.slice(-1))) { setTemp(val); setLock(true); setOp(v.slice(-1)); } 
            else if (operators.includes(v.slice(-1))) {
                setTemp(eval(temp + operator + val)); setLock(true); setOp(v.slice(-1));
            }
            else if (v.slice(-1) == "=") {
                setTemp(temp + operator + val); setEqual("="); setValue(eval(temp + operator + val)); setOp("");
            }
        }
    }

    function buttonImpact(v) {
        if (v == "&divide;") v = operators[3];
        else if (v == "&times;") v = operators[2];
        else if (v == "&minus;") v = operators[1];
        if (!isNaN(v) || v == "." || v == "=" || operators.includes(v)) { carcuration(val + v); }
        else if (v == "<img src='src\\delete.png' alt='DEL'>") carcuration(val.slice(0, -1));
        else if (v == "CE") setValue(0);
        else if (v == "C") { setValue(0); setTemp(""); setOp(""); setEqual(""); }
        else if (v == "%") { setValue(temp * val / 100); setTemp(temp + operator + temp * val / 100) }
        else if (v == "&plusmn;") setValue(-val)
        else if (v == div1x) { setValue(1 / val); setTemp("1/" + val); setEqual("="); }
        else if (v == square) { setValue(val * val); setTemp(temp + operator + val + "^2"); setEqual("="); }
        else if (v == root) { setValue(Math.sqrt(val)); setTemp("&radic;(" + val + ")"); setEqual("="); }

    }



    //function doSomething() {
    //    console.log('sus');
    //}

  return (
          <div className="container">

          <div className="calcs"><div><p>{temp} {operator} {equal}</p></div><input onBlur={e => e.target.focus()} onKeyDown={e => (e.key == "Enter") ? document.getElementById('24').click() : 1}
              value={val} onInput={(e) => { carcuration(e.target.value) }} />
          </div>
          

          <div className="buttons-grid">
              {buttons.map((button) => {
                  return (
                      <Button key={button.id} id={button.id} style={button.style} dangerouslySetInnerHTML={{ __html: button.value }}
                          onClick={() => { buttonImpact(button.value) }}></Button>
                  )
              })}

              {/*<input type="text" id="txtSearch" onKeyDown={e => (e.key == "4") ? document.getElementById('btnSearch').click() : 1} />
              <input type="button" id="btnSearch" value="Search" onClick={() => doSomething()} />*/}
              </div>
          </div>






          
   
  )
}

export default App
