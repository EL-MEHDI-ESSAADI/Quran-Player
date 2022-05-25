import React from "react";

function CheckboxInput({ labelText, checked, handelChange, tabIndexValue=0 }) {
   return (
      <label className="page-settings__part__toggle-label">
         {labelText}
         <input
            className="page-settings__part__toggle-input"
            type="checkbox"
            tabIndex={tabIndexValue}
            checked={checked}
            onChange={handelChange}
         />
      </label>
   );
}

export default CheckboxInput;
