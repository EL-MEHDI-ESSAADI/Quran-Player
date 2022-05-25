import React, { useCallback, useState } from "react";
import useGlobalContext from "Hooks/useGlobalContext";
import { ReactComponent as Bars } from "Assets/Bars.svg";
import { ImArrowLeft2 } from "react-icons/im";
import { GoSearch } from "react-icons/go";
import { FiSettings } from "react-icons/fi";
import { BsGithub } from "react-icons/bs";
import { ButtonIcon, Logo } from "Components";
import { useNavigate } from "react-router-dom";

function Header() {
   const { directContentTabIndex: tabIndexValue, dispatch } = useGlobalContext();
   const [isMobileSreachMoodOn, setIsMobileSreachMoodOn] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const reactIconsSize = "1.4rem";
   const navigate = useNavigate();


   // functions

   const handelSubmit = useCallback(
      (e) => {
         const submitValue = searchTerm
            .trim()
            .toLowerCase()
            .replace(/\b\s+?\b/, "-")
            .replace("*", "");

         e.preventDefault();
         if (!submitValue) return;

         navigate(`/search?s=${submitValue}`);
         setSearchTerm("");
      },
      [searchTerm]
   );

   const handelChange = useCallback((e) => {
      const newSearchTerm = e.target.value;

      if (newSearchTerm && newSearchTerm.at(-1).codePointAt(0) > 127) {
         window.alert("Please write with english characters, ex: Al Fatiha ");
         setSearchTerm("");
      } else {
         setSearchTerm(newSearchTerm);
      }
   }, []);

   const openSiteNav = useCallback(() => dispatch({ type: "moveSiteNav", open: true }), []);

   const openSettingsSidebar = useCallback(() => dispatch({ type: "moveSettingsSidebar", open: true }), []);

   const openMobileSearchForm = useCallback(() => setIsMobileSreachMoodOn(true), [])
   
   const closeMobileSearchForm = useCallback(() => setIsMobileSreachMoodOn(false), [])

   return (
      <>
         <a href="#main" className="skip-to-content" tabIndex={tabIndexValue}>
            Skip to content
         </a>

         <header className={`page-header ${isMobileSreachMoodOn ? "page-header--mobile-search-mode" : ""}`}>
            <div className="flex page-header__l-section">
               <ButtonIcon
                  classValue="page-header__open-sidebar-btn icon"
                  ariaLabl="open sidebar"
                  tabIndexValue={tabIndexValue}
                  Icon={Bars}
                  handelClick={openSiteNav}
               />
               <Logo tabIndexValue={tabIndexValue} />
            </div>
            <div className="page-header__search-section">
               <ButtonIcon
                  classValue="page-header__close-search-btn icon"
                  ariaLabl="close search"
                  tabIndexValue={tabIndexValue}
                  iconSize={reactIconsSize}
                  Icon={ImArrowLeft2}
                  handelClick={closeMobileSearchForm}
               />
               <form onSubmit={handelSubmit} className="page-header__form">
                  <input
                     type="text"
                     placeholder="Search for surah"
                     className="page-header__input ff-roboto"
                     tabIndex={tabIndexValue}
                     value={searchTerm}
                     onChange={handelChange}
                  />
                  <ButtonIcon
                     classValue="page-header__submit-btn bg-secondary"
                     ariaLabl="search"
                     tabIndexValue={tabIndexValue}
                     iconSize={reactIconsSize}
                     Icon={GoSearch}
                  />
               </form>
            </div>
            <div className="flex page-header__r-section">
               <ButtonIcon
                  classValue="page-header__display-search-btn icon"
                  ariaLabl="display search"
                  tabIndexValue={tabIndexValue}
                  iconSize={reactIconsSize}
                  Icon={GoSearch}
                  handelClick={openMobileSearchForm}
               />
               <a
                  className="icon"
                  aria-label="github source"
                  tabIndex={tabIndexValue}
                  title="source code"
                  target="_blank"
                  href="https://github.com/EL-MEHDI-ESSAADI/Quran-Player"
               >
                  <BsGithub size={reactIconsSize} aria-hidden="true" focusable="false" />
               </a>
               <ButtonIcon
                  classValue="page-header__settings-btn icon"
                  ariaLabl="settings"
                  tabIndexValue={tabIndexValue}
                  iconSize={reactIconsSize}
                  Icon={FiSettings}
                  handelClick={openSettingsSidebar}
               />
            </div>
         </header>
      </>
   );
}

export default React.memo(Header);
