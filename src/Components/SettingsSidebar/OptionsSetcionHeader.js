import React from "react";
import { ButtonIcon } from "Components";
import { ImArrowLeft2 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";

function OptionsSetcionHeader({ name, closeSection, closeSettingsSidebar }) {
   return (
      <header className="page-settings__options-container__header">
         <div style={{ display: "flex", alignItems: "center" }}>
            <ButtonIcon
               classValue="page-settings__options-container__back-btn icon"
               ariaLabl="back to general settings"
               iconSize={"1.1rem"}
               Icon={ImArrowLeft2}
               handelClick={closeSection}
            />
            <span>{name}</span>
         </div>
         <ButtonIcon
            classValue="page-settings__close-settings-btn icon"
            ariaLabl="close settings sidebar"
            Icon={IoMdClose}
            iconSize={"1.4rem"}
            handelClick={closeSettingsSidebar}
         />
      </header>
   );
}

export default React.memo(OptionsSetcionHeader);
