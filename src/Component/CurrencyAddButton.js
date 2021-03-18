import React from 'react'

export default function CurrencyAddButton(props) {
    const {
        onClickedCurrencyBtn,
        addCurrencyClicked
    }= props
    return (
        <div className="addbtn">
            <button value={addCurrencyClicked} onClick={onClickedCurrencyBtn}>Add Currency</button>
        </div>
    )
}
