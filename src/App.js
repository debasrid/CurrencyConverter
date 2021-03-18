/**
 * @description Real time currency conversion app.
 * @author Debasri Dasgupta <debasri_dasgupta@yahoo.com>
 * @version 1.0
*/

import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyAddButton from './Component/CurrencyAddButton';
import CurrencyInput from './Component/CurrencyInput';
import DateSelection from './Component/DateSelection';

/** API to fetch currency exchange rates. */
const DATA_URL = 'https://api.exchangeratesapi.io'

function App() {

  const [currencyList, setCurrencyList] = useState([])                                          // Store the list of currencies in state
  const [currencyComponentList, setCurrencyComponentList] = useState([])                        // Store the list of currency components in the page
  const [currencyComponentCounter, setCurrencyComponentCounter] = useState(0)                   // Store count of currency components
  const [fromCurrency, setFromCurrency] = useState()                                          // Store the currency from which conversion should be done
  const [toCurrency, setToCurrency] = useState([])                                              // Store the currencies to which conversion has to be done
  const [exchangeRate, setExchangeRate] = useState([1])                                         // Store exchange rate of the currencies which are added to page
  const [exchangeRateArray, setExchangeRateArray] = useState()                                  // Store exchange rate of all currencies
  const [amount, setAmount] = useState(1)                                                       // Store the currency amount that should be converted
  const [changedIndex, setChangedIndex] = useState(0)                                            // Store index value of the changed currency component
  const [amountInputbox, setAmountInputBox] = useState(true)                                    // Store the changed amount component
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))       // Store the selected date, initialized to current date in mm/dd/yyyy format

  let fromAmountValue, fromInputLabel
  let toAmountValue = []
  let toInputLabel = []

/** If the amount in the from currency component is changed, change the labels 
 * and amounts in the to currency fields. 
 * */
  if (amountInputbox) {
    fromAmountValue = amount
    currencyComponentList.map((ccList, index) => {
      toAmountValue[index] = (amount * exchangeRate[index]).toFixed(2) || 0
      toInputLabel[index] = 'Output Amount'
    })
    fromInputLabel = 'Input Amount'
  }
/** If the amount in one of the to currency components is changed, change the labels 
 * and amounts in the from currency fields. 
 * */
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

/** On initiation of the app, fetch all the currency conversion rates 
 * set the base currency to EUR, save all currencies and conversion
 * rates to state. 
 * */
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


  /** If the currency selection in the from currency component is changed, 
   * fetch the latest conversion rates with the new base currency for the currency
   * codes in the to currency list and save them to state. 
   * */
  useEffect(() => {
    if (fromCurrency !== null && toCurrency !== null && toCurrency.length !== 0 ) {
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
  }, fromCurrency)

/** If the currency selection in one of the to currency components is changed, 
 * fetch the latest conversion rates with the new base currency for the currency
 * codes in the to currency list and save them to state. 
 * */  
  useEffect(() => {
    if (fromCurrency !== null && toCurrency[changedIndex] !== null && toCurrency.length !== 0) {
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


/** If the selected date is changed, fetch the latest conversion rates 
* for the new date and save them to state. 
* */
  useEffect(() => {
    if (fromCurrency !== null && toCurrency !== null && toCurrency.length !== 0 && fromCurrency !== toCurrency) {
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


// Event handler triggered if amount in from currency component is changed
  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInputBox(true)
  }

// Event handler triggered if amount in one of the to currency component is changed
  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setChangedIndex(e.target.id)
    setAmountInputBox(false)
  }

// Event handler triggered if currency selection in to currency component is changed
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

// Event handler triggered if the button for adding new currency is clicked
  function handleAddCurrencyClicked() {
    setChangedIndex(currencyComponentCounter)
    setCurrencyComponentList([...currencyComponentList, currencyList[currencyComponentCounter]])
    setToCurrency([...toCurrency, currencyList[currencyComponentCounter+1]])
    setCurrencyComponentCounter(prevState => prevState + 1)
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
