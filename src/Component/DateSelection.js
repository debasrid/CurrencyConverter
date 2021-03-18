/**
 * Reusable component for selecting date.
 *
 * @version 1.0.1
 * @author [Debasri Dasgupta](https://github.com/debasrid)
 */
import React from 'react';

export default function DateSelection(props) {
    const{
        onChangeDateInput,
        dateSelection
         } = props

    return (
        <div className="datesection">
            <label>Select Date:</label>
            <input type="date" id="date" value={dateSelection}  onChange={onChangeDateInput} ></input>
        </div>
    )
}
