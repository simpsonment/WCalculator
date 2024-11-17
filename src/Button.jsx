import React from "react";
import './Button.css';
import useScript from './useScript.js';



export default function Button(props) {


    useScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js');
    const { children, ...rest } = props;
    return (<>
        <button {...rest} value={children}>{children}</button>
    </>);
}