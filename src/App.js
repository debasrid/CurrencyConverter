import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyInput from './CurrencyInput';

const DATA_URL = 'https://api.exchangeratesapi.io/latest'

function App() {

  const [currencyList, setCurrencyList]= useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate,setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInputbox, setAmountInputBox] = useState(true)
  
let  fromAmountValue, toAmountValue, fromInputLabel, toInputLabel

if(amountInputbox){
  fromAmountValue = amount 
  toAmountValue = (amount*exchangeRate).toFixed(2)
  fromInputLabel = 'Input Amount'
  toInputLabel = 'Output Amount'
}
else{
  toAmountValue = amount
  fromAmountValue = (amount/exchangeRate).toFixed(2)
  fromInputLabel = 'Output Amount'
  toInputLabel = 'Input Amount'
}
  


  useEffect(() => {
   fetch(DATA_URL)
   .then(res => res.json())
   .then(data=>{ 
     const firstBaseCurrency = Object.keys(data.rates)[0]
     setCurrencyList([data.base, ...Object.keys(data.rates)])
     setFromCurrency(data.base)
     setToCurrency(firstBaseCurrency)
     setExchangeRate(data.rates[firstBaseCurrency])
    })
  }, [])

  useEffect(() =>{
if(fromCurrency!=null && toCurrency!=null){
  fetch(`${DATA_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
  .then(res => res.json())
  .then(data => setExchangeRate(data.rates[toCurrency]))
}
  },[fromCurrency, toCurrency])

  function fromAmountChangeHandler(e){
    setAmount(e.target.value)
    setAmountInputBox(true)
  }

  function toAmountChangeHandler(e){
    setAmount(e.target.value)
    setAmountInputBox(false)
  }

  return (
  <>
   <h1>Currency Converter</h1>
   <CurrencyInput currencyList={currencyList}
   selectedCurrency={fromCurrency}
   onChangeCurrencyInput = {e => setFromCurrency(e.target.value)}
   amount = {fromAmountValue}
   onChangeInputAmount = { fromAmountChangeHandler}
   currencyLabel = {fromInputLabel}
   />
   <div>to</div>
   <CurrencyInput currencyList={currencyList}
   selectedCurrency={toCurrency}
   onChangeCurrencyInput = { e=> setToCurrency(e.target.value)}
   amount = {toAmountValue}
   onChangeInputAmount = { toAmountChangeHandler}
   currencyLabel = {toInputLabel}
   />
   </>
  );
}

export default App;
