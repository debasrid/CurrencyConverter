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
        <div className="currency-section" key={currencyKey}>
            <label>{currencyLabel}</label>
            <input type = "number" min = "0" className = "input" value = {amount} onChange = {onChangeInputAmount}/>
            
            <select value={selectedCurrency} onChange={onChangeCurrencyInput}>
                {currencyList.map(option=>(<option key={option} value={option}>{option}</option>)
                )}
            </select>
        </div>
    )
}
