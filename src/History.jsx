/* eslint-disable react/prop-types */
import React from 'react';
import { useState, useEffect } from 'react';

function History(props) {



  return (
      <>{props.history.filter(item => !isNaN(item.val) && isFinite(item.val)).length == 0 ? <p style={{ marginLeft: '13px' }}>There&apos;s no history yet.</p> :
          (
              props.history.filter(item => !isNaN(item.val) && isFinite(item.val)).map((item, id) => {
                  return (
                      <div key={id} className="entries" onClick={() => props.onHistoryClick(item)}>
                          <p style={{ whiteSpace: 'initial', color: 'dimgray', fontWeight: '200', fontSize:'14px', margin: '0 20px 0 auto' }} >
                              {props.showTemp(item.temp.toString(),true).replaceAll(" ","  ") +" ="}
                          </p>
                          <p style={{ whiteSpace: 'initial', fontSize: '20px', margin: '0 20px 20px auto' }}>
                              {props.showVal(item.val)}
                          </p>
                      </div>
                  )
              })
          )
      }
      </>
  );
}

export default History;