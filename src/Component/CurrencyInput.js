/**
 * Reusable component for currency.
 *
 * @version 1.0.1
 * @author [Debasri Dasgupta](https://github.com/debasrid)
 */

import React from 'react';

export default function CurrencyInput(props) {
 const{
      currencyList,
      selectedCurrency,
      onChangeCurrencyInput,
      amount,
      onChangeInputAmount,
      currencyLabel,
      currencyKey
    } = props
    
    return (
        <div className="currency-section">
            <label>{currencyLabel}</label>
            <input type = "number" min = "0" className = "input" value = {amount} id={currencyKey} onChange = {onChangeInputAmount}/>
            
            <select value={selectedCurrency} onChange={onChangeCurrencyInput} key={currencyKey} id={currencyKey}>
                {currencyList.map(option=>(<option key={option} value={option}>{option}</option>)
                )}
            </select>
        </div>
    )
}
