/**
 * Reusable button component for adding Currency.
 *
 * @version 1.0.1
 * @author [Debasri Dasgupta](https://github.com/debasrid)
 */
import React from 'react'

export default function CurrencyAddButton(props) {
    const {
        onClickedCurrencyBtn,
        addCurrencyClicked
    }= props
    return (
        <div className="addbtn">
            <button value={addCurrencyClicked} onClick={onClickedCurrencyBtn}>ADD CURRENCY</button>
        </div>
    )
}
