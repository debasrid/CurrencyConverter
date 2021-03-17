import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyAddButton from './CurrencyAddButton';
import CurrencyInput from './CurrencyInput';
import DateSelection from './DateSelection';

const DATA_URL = 'https://api.exchangeratesapi.io'

function App() {

  const [currencyList, setCurrencyList] = useState([])
  const [currencyComponentList, setCurrencyComponentList] = useState([])
  const [currencyComponentCounter, setCurrencyComponentCounter] = useState(1)
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState([])
  const [exchangeRate, setExchangeRate] = useState([1])
  const [amount, setAmount] = useState(1)
  const [changedIndex, setChangedIndex] = useState()
  const [amountInputbox, setAmountInputBox] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

  let fromAmountValue, fromInputLabel
  let toAmountValue = []
  let toInputLabel = []


  if (amountInputbox) {
    fromAmountValue = amount
    exchangeRate.map((eRate,index) => {
      toAmountValue[index] = (amount * eRate).toFixed(2)
      toInputLabel[index] = 'Output Amount'
    })
    fromInputLabel = 'Input Amount'
  }
  else {
    toAmountValue[changedIndex] = amount
    fromAmountValue = (amount / exchangeRate[changedIndex]).toFixed(2)
    fromInputLabel = 'Output Amount'
    currencyComponentList.map((componentNumber,index)=>toInputLabel[index] = 'Output Amount')
    toInputLabel[changedIndex] = 'Input Amount'
  }
  
  useEffect(() => {
    fetch(`${DATA_URL}/latest`)
      .then(res => res.json())
      .then(data => {
        const firstBaseCurrency = Object.keys(data.rates)[0]
        setCurrencyList([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setExchangeRate([...Object.values(data.rates)])
        setCurrencyComponentList([])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null && fromCurrency != toCurrency) {
      fetch(`${DATA_URL}/${selectedDate}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          let newExchangeRate = [...exchangeRate]
          newExchangeRate[changedIndex] = data.rates[toCurrency[changedIndex]]
          setExchangeRate(newExchangeRate)
          }
        )
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
             currencyKey="0"
        />
       { currencyComponentList.map((ccList,i) => 
        <CurrencyInput currencyList={currencyList}
          selectedCurrency={toCurrency[i]}
          onChangeCurrencyInput={e => {
              let newToCurrencyArray = [...toCurrency]
              newToCurrencyArray[e.target.id] = e.target.value
              setToCurrency(newToCurrencyArray)
              setChangedIndex(i)
            }
          }
          amount={toAmountValue[i]}
          onChangeInputAmount={handleToAmountChange}
          currencyLabel={toInputLabel[i]}
          currencyKey={i}
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
