/* eslint-disable react/prop-types */
import React from 'react';
import Button from './Button.jsx';
import { useState} from 'react';


function Memory(props) {

    const { item, memory, setMemory, val, setValue, setLock, showMemory, showVal, selected, setSelected } = props;
    const memButtons = [{ "value": "MC", "title": "Clear all memory", "disability": 0 }, { "value": "MR", "disability": 0 },
                        { "value": "M+" }, { "value": "M-" }, { "value": "MS" }, { "value": "M˅" }];
    const individuals = [memButtons[0], memButtons[2], memButtons[3]];


    console.log("s", selected);

    function buttonAction(v, entry, all) {
        console.log("properties", v, selected,entry, memory);
        if (entry == -1) entry = 0;
        
        if (v == "MS") {
            setMemory([eval(val), ...memory]);
            setValue(eval(val));
            if (selected != -1) setSelected(selected + 1);
        }
        else if (v == "MR") {
            showMemory(memory[entry]);
            setLock(true);
        }
        else if (["M+", "M-"].includes(v)) {
            let i = Number(val);
            if (v == "M-") i = -i;
            if (memory.length != 0) {
                const updatedMemory = memory.map((e, id) => {
                    if (id === entry) {
                        return Number(memory[entry]) + i;
                    }
                    // in all other cases, keep it as it was
                    return e;
                });
                setMemory(updatedMemory);
            }
            else {
                setMemory([eval(i)]);
                setValue(eval(i));
            }
        }
        else if (v == "MC") {
            const updatedMemory = memory.filter((e, id) => id !== entry);
            setMemory(updatedMemory);
            if (selected == entry) setSelected(-1);
            else if (selected) setSelected(selected - 1);
            if (all) { setMemory([]); setSelected(-1); }
        }
        setLock(true);
    }

    function handleMemorySelect(entry) {
        showMemory(memory[entry]);
        setLock(true);
        if (selected == entry) {
            setSelected(-1);
            setValue(val);
        }
        else {
            setSelected(entry);
        }       
    }


    if (item)
        return (
            <>                
                {memButtons.map((button,id) => {
                    return (
                        <Button key={id}
                            id={"mem-"+id}
                            className="memory"
                            onClick={() => {
                                buttonAction(button.value, selected, true);
                                if (button.value == "M˅") {
                                    document.getElementById('mem-popup').style.display = 'block';
                                    document.querySelector('.container').style.backgroundColor = 'darkgrey';
                                    document.querySelector('.memory-buttons-grid').style.pointerEvents = 'none';

                                }
                            }}
                            dangerouslySetInnerHTML={{ __html: button.value }} title={button.title} disabled={isNaN(val) || !isFinite(val) || (button.disability == 0 && memory.length == 0)}>
                        </Button>
                    )
                })}
            </>
        );
    else return (
        <>
            {memory.length == 0 ? <p style={{ marginLeft: '13px' }}>There&apos;s nothing saved in memory.</p> :
                memory.map((item, id) => {
                    return (
                        <button key={id} id={"entry" + id} className={selected==id ? "entries focuser":"entries"}
                            onClick={() => { handleMemorySelect(id); console.log("entry", id, "s", selected, document.querySelectorAll(".bid-" + id)); }}
                            onMouseOver={() => {
                                let a = document.querySelectorAll(".bid-" + id);
                                for (let i = 0; i < a.length; i++) { a[i].style.visibility = 'visible'; }
                            }}
                            onMouseOut={() => {
                                let a = document.querySelectorAll(".bid-" + id);
                                for (let i = 0; i < a.length; i++) { a[i].style.visibility = 'hidden'; }
                            }}>
                        <p style={{ whiteSpace: 'initial', fontSize: '20px', margin: '5px 13px 0 auto' }}>{showVal(item)}</p>
                        <div style={{ marginRight: '9px' }}>
                            {individuals.map((button,number) => {
                            return (
                                <Button className={"individuals bid-"+id} key={number}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        buttonAction(button.value, id);
                                    }}
                                    dangerouslySetInnerHTML={{ __html: button.value }}></Button >
                            );
                        })}
                        </div>

                    </button>
                );
            })}
      </>
    );

}

export default Memory;