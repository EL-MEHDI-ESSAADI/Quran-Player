import React, { useCallback, useEffect, useRef, useState } from "react";
import useGlobalContext from "Hooks/useGlobalContext";
import {
   ButtonIcon,
   Overlay,
   CheckboxInput,
   SettingsInfoSection,
   TranslationOptionsSection,
   ReciterOptionsSection,
} from "Components";
import { IoMdClose } from "react-icons/io";

function SettingsSidebar() {
   const {
      isSettingsSidebarOpen,
      settingsSidebarTabIndex,
      dispatch,
      selectedTranslation,
      selectedReciter,
      autoScroll,
   } = useGlobalContext();

   const [isTranslationOptionsSectionOpen, setIsTranslationOptionsSectionOpen] = useState(false);
   const [isReciterOptionsSectionOpen, setIsReciterOptionsSectionOpen] = useState(false);
   const settingsSidebarRef = useRef();
   const tabIndexValue =
      (isTranslationOptionsSectionOpen || isReciterOptionsSectionOpen) && isSettingsSidebarOpen
         ? -1
         : settingsSidebarTabIndex;

   useEffect(() => {
      document.body.style.overflow = isSettingsSidebarOpen ? "hidden" : "initial";
   }, [isSettingsSidebarOpen]);

   useEffect(() => {
      if (isTranslationOptionsSectionOpen || isReciterOptionsSectionOpen) settingsSidebarRef.current.scroll(0, 0);
   }, [isTranslationOptionsSectionOpen, isReciterOptionsSectionOpen]);

   // functions
   const closeSettingsSidebar = useCallback(() => dispatch({ type: "moveSettingsSidebar", open: false }), []);
   const openTranslationOptionsSection = useCallback(() => setIsTranslationOptionsSectionOpen(true), []);
   const closeTranslationOptionsSection = useCallback(() => setIsTranslationOptionsSectionOpen(false), []);
   const openReciterOptionsSection = useCallback(() => setIsReciterOptionsSectionOpen(true), []);
   const closeReciterOptionsSection = useCallback(() => setIsReciterOptionsSectionOpen(false), []);
   const closeAllSettingsSidebarSections = useCallback(
      () => closeReciterOptionsSection() || closeSettingsSidebar() || closeTranslationOptionsSection(),
      []
   );

   return (
      <aside
         className={`page-settings ${isSettingsSidebarOpen ? "page-settings--show" : ""} ${
            isTranslationOptionsSectionOpen || isReciterOptionsSectionOpen ? "overflow-hidden" : ""
         }`}
         ref={settingsSidebarRef}
      >
         <header className="page-settings__header">
            <span>settings</span>
            <ButtonIcon
               classValue="page-settings__close-settings-btn icon"
               tabIndexValue={tabIndexValue}
               ariaLabl="close settings sidebar"
               Icon={IoMdClose}
               iconSize={"1.4rem"}
               handelClick={closeSettingsSidebar}
            />
         </header>
         <SettingsInfoSection
            tabIndexValue={tabIndexValue}
            name={"Translation"}
            specification={"Translation"}
            selectedName={selectedTranslation.name}
            handelClick={openTranslationOptionsSection}
         />
         <SettingsInfoSection
            tabIndexValue={tabIndexValue}
            name="Audio"
            specification="Reciter"
            selectedName={selectedReciter.name}
            handelClick={openReciterOptionsSection}
         />
         <CheckboxInput
            labelText="Auto Scroll"
            checked={autoScroll}
            tabIndexValue={tabIndexValue}
            handelChange={() => dispatch({ type: "changeAutoScroll", value: !autoScroll })}
         />
         <TranslationOptionsSection
            isSectionOpen={isTranslationOptionsSectionOpen}
            closeSection={closeTranslationOptionsSection}
            closeSettingsSidebar={closeAllSettingsSidebarSections}
         />
         <ReciterOptionsSection
            isSectionOpen={isReciterOptionsSectionOpen}
            closeSection={closeReciterOptionsSection}
            closeSettingsSidebar={closeAllSettingsSidebarSections}
         />
         {isSettingsSidebarOpen && <Overlay handelClick={closeAllSettingsSidebarSections} />}
      </aside>
   );
}

export default React.memo(SettingsSidebar);
