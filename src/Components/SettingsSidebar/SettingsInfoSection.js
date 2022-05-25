import React from "react";
import {HiOutlineChevronRight} from "react-icons/hi"

function SettingsInfoSection({ tabIndexValue, name, specification, selectedName, handelClick }) {

   function handeKeyDown(e) {
      if(e.key === 'Enter' || e.key === ' ') handelClick() 
   }

   return (
      <div className="page-settings__part">
         <h3 className="page-settings__part-name">{name}</h3>
         <div className="page-settings__part-btn flex" role="button" tabIndex={tabIndexValue} onClick={handelClick} onKeyDown={handeKeyDown}>
            <div>
               <span className="page-settings__part-btn__header">Selected {specification}</span>
               <p className="page-settings__part-btn__selected-name">{selectedName}</p>
            </div>
            <HiOutlineChevronRight size="1.4rem"  aria-hidden="true" focusable="false" />
         </div>
      </div>
   );
}

export default React.memo(SettingsInfoSection);
