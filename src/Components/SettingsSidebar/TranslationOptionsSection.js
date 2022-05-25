import React, { useState, useCallback, useEffect, useRef } from "react";
import { Preloader, FetchError, RadioInput, OptionsSetcionHeader } from "Components";
import useGlobalContext from "Hooks/useGlobalContext";
import { fetchData } from "Helpers/utils";
import { availableTranslationsApi } from "data";

const initTranslationSources = {
   data: null,
   error: "",
   loading: true,
};

function getLanguagesElements(data, selectedTranslationId, handelInputChange) {
   const languagesElements = [];

   data.forEach(([lang, langOptions]) => {
      const langOptionsElements = [];

      langOptions.forEach((langOption) => {
         langOptionsElements.push(
            <RadioInput
               key={langOption.id}
               name={"Translation"}
               labelText={langOption.name}
               checked={selectedTranslationId === langOption.id}
               handelChange={() => handelInputChange({ ...langOption, lang })}
            />
         );
      });

      languagesElements.push(
         <li key={lang}>
            <h3 className="page-settings__language-name">{lang}</h3>
            <ul className="page-settings__options-container__list flow page-settings__language-options-container">
               {langOptionsElements}
            </ul>
         </li>
      );
   });

   return languagesElements;
}

function TranslationOptionsSection({ isSectionOpen, closeSection, closeSettingsSidebar }) {
   const [translationState, setTranslationState] = useState(initTranslationSources);
   const [languagesElements, setLanguagesElements] = useState(null);
   const { data, error, loading } = translationState;
   const { dispatch, selectedTranslation } = useGlobalContext();
   const translationOptionsSectionRef = useRef();

   useEffect(() => {
      getTranslationSources();
   }, []);

   useEffect(() => {
      if (data) setLanguagesElements(getLanguagesElements(data, selectedTranslation.id, handelInputChange));
   }, [selectedTranslation, data]);

   useEffect(() => {
      if (data && !isSectionOpen) orderData();
   }, [isSectionOpen, loading]);

   useEffect(() => {
      if (isSectionOpen) {
         translationOptionsSectionRef.current.scroll(0, 0)
      };
   }, [isSectionOpen]);

   const getTranslationSources = useCallback(() => {
      setTranslationState(initTranslationSources);
      fetchData(
         availableTranslationsApi,
         ({ translations }) => {
            const map = new Map();

            translations.forEach((translation) => {
               const category = translation.language_name;
               const translationItem = {
                  id: translation.id,
                  name: translation.translated_name.name,
               };

               if (map.has(category)) {
                  map.get(category).push(translationItem);
               } else {
                  map.set(category, [translationItem]);
               }
            });

            setTranslationState({ data: Array.from(map), loading: false, error: "" });
         },
         (error) => {
            setTranslationState({ data: null, loading: false, error: error.message });
         }
      );
   }, []);

   function orderData() {
      let newData = [];
      data.forEach(([lang, langOptions]) => {
         if (lang === selectedTranslation.lang) {
            const newLangOptions = langOptions.filter((item) => item.id !== selectedTranslation.id);
            newLangOptions.unshift({ id: selectedTranslation.id, name: selectedTranslation.name });
            newData.unshift([lang, newLangOptions]);
         } else {
            newData.push([lang, langOptions]);
         }
      });

      setTranslationState((old) => ({ ...old, data: newData }));
   }

   const handelInputChange = useCallback(
      (newSelectedTranslation) => dispatch({ type: "changeSelectedTranslation", value: newSelectedTranslation }),
      []
   );

   return (
      <div
         className="page-settings__options-container page-settings__translations-options-container"
         style={{ display: isSectionOpen ? "flex" : "none" }}
         ref={translationOptionsSectionRef}
      >
         <OptionsSetcionHeader
            name="Translations"
            closeSection={closeSection}
            closeSettingsSidebar={closeSettingsSidebar}
         />
         {loading && <Preloader />}
         {error && <FetchError error={error} reloadFunc={getTranslationSources} />}
         {data && <ul className="page-settings__languages-options-container">{languagesElements}</ul>}
      </div>
   );
}

export default React.memo(TranslationOptionsSection);
