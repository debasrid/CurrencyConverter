import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyAddButton from './CurrencyAddButton';
import CurrencyInput from './CurrencyInput';
import DateSelection from './DateSelection';

const DATA_URL = 'https://api.exchangeratesapi.io'

function App() {

  const [currencyList, setCurrencyList] = useState([])
  const [currencyComponentList, setCurrencyComponentList] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInputbox, setAmountInputBox] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

  let fromAmountValue, toAmountValue, fromInputLabel, toInputLabel

  if (amountInputbox) {
    fromAmountValue = amount
    toAmountValue = (amount * exchangeRate).toFixed(2)
    fromInputLabel = 'Input Amount'
    toInputLabel = 'Output Amount'
  }
  else {
    toAmountValue = amount
    fromAmountValue = (amount / exchangeRate).toFixed(2)
    fromInputLabel = 'Output Amount'
    toInputLabel = 'Input Amount'
  }

  



  useEffect(() => {
    fetch(`${DATA_URL}/latest`)
      .then(res => res.json())
      .then(data => {
        const firstBaseCurrency = Object.keys(data.rates)[0]

        setCurrencyList([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(firstBaseCurrency)
        setExchangeRate(data.rates[firstBaseCurrency])
        setCurrencyComponentList([1])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null && fromCurrency != toCurrency) {
      fetch(`${DATA_URL}/${selectedDate}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency, selectedDate])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInputBox(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInputBox(false)
  }

  function handleAddCurrencyClicked(){
    setCurrencyComponentList([...currencyComponentList, currencyComponentList.length])
  }



  return (
    <>
    < div className="content">
      <h1>Currency Converter</h1>

        <DateSelection selectedDate={selectedDate}
             onChangeDateInput={e => setSelectedDate(e.target.value)
              }
        />
        
        <CurrencyInput currencyList={currencyList}
             selectedCurrency={fromCurrency}
             onChangeCurrencyInput={e => setFromCurrency(e.target.value)}
             amount={fromAmountValue}
             onChangeInputAmount={handleFromAmountChange}
             currencyLabel={fromInputLabel}
             currencyKey="0"
        />
     
       { currencyComponentList.map((ccList,i) => 
        <CurrencyInput currencyList={currencyList}
          selectedCurrency={toCurrency}
          onChangeCurrencyInput={e => setToCurrency(e.target.value)}
          amount={toAmountValue}
          onChangeInputAmount={handleToAmountChange}
          currencyLabel={toInputLabel}
          currencyKey={ccList}
        />
       )        
     }
 

        <CurrencyAddButton 
        onClickedCurrencyBtn = {handleAddCurrencyClicked}        
        />
        
      
    </div>
    </>
  );
}

export default App;
