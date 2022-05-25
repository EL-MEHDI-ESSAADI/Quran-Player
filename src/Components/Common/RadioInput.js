import React from "react";

function RadioInput({ name, labelText, checked, handelChange, reciterSpecificity }) {

   return (
      <li>
         <label className="page-settings__options-container__label">
            <input
               className="page-settings__options-container__input"
               type="radio"
               name={name}
               checked={checked}
               onChange={handelChange}
            />
            {labelText}
            {reciterSpecificity && <span className="page-settings__reciter-style">{reciterSpecificity}</span>}
         </label>
      </li>
   );
}

export default React.memo(RadioInput);
