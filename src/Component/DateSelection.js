import React from 'react';

export default function DateSelection(props) {
    const{
        onChangeDateInput,
         } = props

    return (
        <div className="datesection">
            <label>Select Date:</label>
            <input type="date" id="date"  onChange={onChangeDateInput} ></input>
        </div>
    )
}
