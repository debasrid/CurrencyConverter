import React from 'react'

export default function CurrencyInput(props) {
 const{
      currencyList,
      selectedCurrency,
      onChangeCurrencyInput,
      amount,
      onChangeInputAmount,
      currencyLabel
    } = props
    
    return (
        <div>
            <label>{currencyLabel}</label>
            <input type = "number" min = "0" className = "input" value = {amount} onChange = {onChangeInputAmount}/>
            
            <select value={selectedCurrency} onChange={onChangeCurrencyInput}>
                {currencyList.map(option=>(<option key={option} value={option}>{option}</option>)
                )}
            </select>
        </div>
    )
}
