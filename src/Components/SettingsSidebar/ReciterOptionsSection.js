import React, { useMemo } from "react";
import {OptionsSetcionHeader, RadioInput} from "Components";
import { reciters } from "data";
import useGlobalContext from "Hooks/useGlobalContext";

function ReciterOptionsSection({ isSectionOpen, closeSection, closeSettingsSidebar }) {
   const { selectedReciter, dispatch } = useGlobalContext();

   const recitersElements = useMemo(
      () =>
         reciters.map((reciter) => (
            <RadioInput
               key={reciter.id}
               name={"Reciter"}
               labelText={reciter.name}
               checked={selectedReciter.id === reciter.id}
               reciterSpecificity={reciter.specificity}
               handelChange={() => dispatch({ type: "changeSelectedReciter", value: reciter })}
            />
         )),
      [selectedReciter]
   );

   return (
      <div className="page-settings__options-container" style={{ display: isSectionOpen ? "flex" : "none" }}>
         <OptionsSetcionHeader
            name="Reciter"
            closeSection={closeSection}
            closeSettingsSidebar={closeSettingsSidebar}
         />
         <ul className="page-settings__options-container__list flow page-settings__reciters-options-container__list">
            {recitersElements}
         </ul>
      </div>
   );
}

export default ReciterOptionsSection;
