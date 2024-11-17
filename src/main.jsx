import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)

function SupText(text, shouldBeSup) {
    const textArray = text.split(shouldBeSup);
    console.log(textArray)
    return (
        <span>
            {textArray.map((item, index) => (
                <>
                    {item}
                    {index !== textArray.length - 1 && (
                        <sup>{shouldBeSup.replace("**", "")}</sup>
                    )}
                </>
            ))}
        </span>
    );
}
function intersection(a, b) {
    const setA = new Set(a);
    return b.filter(value => setA.has(value))[0];

    //(?<=123-)((apple|banana)(?=-456)|(?=456))
    //	 /(?<=\()(\d+)(?=\)\*\*2)/g

    /*const sqrFind = text.match(/\(\d+\)\*\*2/g);
    const sqrReplace = text.match(/(?<=\()(\d+)(?=\)\*\*2)/g);
 
    const b = Object.fromEntries(sqrFind.map((key, i) => [key, "sqr[" + sqrReplace[i] + "]"]));
 
    const rootFind = text2.match(/\(\d+\)\*\*\(1\/2\)/g);
    const rootReplace = text2.match(/(?<=\()(\d+)(?=\)\*\*\(1\/2\))/g);
    const c = Object.fromEntries(rootFind.map((key, i) => [key, parse("&radic;") + "[" + rootReplace[i] + "]"]));
    const a = { ...b, ...c };
    */
}