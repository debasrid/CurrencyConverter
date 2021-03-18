import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyAddButton from './Component/CurrencyAddButton';
import CurrencyInput from './Component/CurrencyInput';
import DateSelection from './Component/DateSelection';

const DATA_URL = 'https://api.exchangeratesapi.io'

function App() {

  const [currencyList, setCurrencyList] = useState([])
  const [currencyComponentList, setCurrencyComponentList] = useState([])
  const [currencyComponentCounter, setCurrencyComponentCounter] = useState(1)
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState([])
  const [exchangeRate, setExchangeRate] = useState([1])
  const [exchangeRateArray, setExchangeRateArray] = useState()
  const [amount, setAmount] = useState(1)
  const [changedIndex, setChangedIndex] = useState()
  const [amountInputbox, setAmountInputBox] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

  let fromAmountValue, fromInputLabel
  let toAmountValue = []
  let toInputLabel = []


  if (amountInputbox) {
    fromAmountValue = amount
    currencyComponentList.map((ccList, index) => {
      toAmountValue[index] = (amount * exchangeRate[index]).toFixed(2) || 0
      toInputLabel[index] = 'Output Amount'
    })
    fromInputLabel = 'Input Amount'
  }
  else {
    fromAmountValue = (amount / exchangeRate[changedIndex]).toFixed(2)
    fromInputLabel = 'Output Amount'
    toCurrency.map((tCurr, index) => {
      toAmountValue[index] = (fromAmountValue * exchangeRateArray[tCurr]).toFixed(2)
      toInputLabel[index] = 'Output Amount'
    })
    toAmountValue[changedIndex] = amount
    toInputLabel[changedIndex] = 'Input Amount'
  }

  useEffect(() => {
    fetch(`${DATA_URL}/latest`)
      .then(res => res.json())
      .then(data => {
        setCurrencyList([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setExchangeRate([...Object.values(data.rates)])
        setCurrencyComponentList([])
        let newExchangeRateArray = data.rates
        newExchangeRateArray["EUR"] = "1"
        setExchangeRateArray(newExchangeRateArray)
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && fromCurrency.length != 0 && toCurrency != null && toCurrency.length != 0 ) {
      let fetchCurrency = []
      toCurrency.map((tCurr,index) => {
        if(tCurr!==fromCurrency)
          fetchCurrency.push(tCurr)        
      })
      fetch(`${DATA_URL}/${selectedDate}?base=${fromCurrency}&symbols=${fetchCurrency}`)
        .then(res => res.json())
        .then(data => {
          let newExchangeRate = [...exchangeRate]
          toCurrency.map((tCurr,index) => {
            newExchangeRate[index] = data.rates[tCurr]
            if(tCurr===fromCurrency)
              newExchangeRate[index] = 1
          })
          setExchangeRate(newExchangeRate)
        }
        )
    }
  }, [fromCurrency])

  useEffect(() => {
    if (fromCurrency != null && toCurrency[changedIndex] != null) {
      let newExchangeRate = [...exchangeRate]
      if (fromCurrency === toCurrency[changedIndex]) {
        newExchangeRate[changedIndex] = 1
      }
      else {
        fetch(`${DATA_URL}/${selectedDate}?base=${fromCurrency}&symbols=${toCurrency[changedIndex]}`)
          .then(res => res.json())
          .then(data => {
            newExchangeRate[changedIndex] = data.rates[toCurrency[changedIndex]]
          }
          )
      }
      setExchangeRate(newExchangeRate)
    }
  }, [toCurrency])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null && fromCurrency != toCurrency) {
      fetch(`${DATA_URL}/${selectedDate}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          setExchangeRateArray(data.rates);
          let newExchangeRate = [...exchangeRate]
          toCurrency.map((tCurr, index) => {
            newExchangeRate[index] = exchangeRateArray[tCurr]
          })
          setExchangeRate(newExchangeRate)
        }
        )
    }
  }, [selectedDate])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInputBox(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setChangedIndex(e.target.id)
    setAmountInputBox(false)
  }

  function handleToCurrencyChange(e) {
    let newToCurrencyArray = [...toCurrency]
    let newExchangeRate = [...exchangeRate]
    if (e.target.value===fromCurrency)
      newExchangeRate[e.target.id] = 1
    else
      newExchangeRate[e.target.id] = exchangeRateArray[e.target.value]
    setExchangeRate(newExchangeRate)
    newToCurrencyArray[e.target.id] = e.target.value
    setToCurrency(newToCurrencyArray)
    setChangedIndex(e.target.id)
    setAmount(amount)
  }

  function handleAddCurrencyClicked() {
    setCurrencyComponentCounter(prevState => prevState + 1)
    setCurrencyComponentList([...currencyComponentList, currencyList[currencyComponentCounter]])
    setToCurrency([...toCurrency, currencyList[currencyComponentCounter]])
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
          currencyKey="100"
        />
        {toCurrency.map((ccList, i) =>
          <CurrencyInput currencyList={currencyList}
            selectedCurrency={ccList}
            onChangeCurrencyInput={handleToCurrencyChange}
            amount={toAmountValue[i]}
            onChangeInputAmount={handleToAmountChange}
            currencyLabel={toInputLabel[i]}
            currencyKey={i}
          />
        )
        }


        <CurrencyAddButton
          onClickedCurrencyBtn={handleAddCurrencyClicked}
        />


      </div>
    </>
  );
}

export default App;
