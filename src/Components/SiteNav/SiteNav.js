import React, { useCallback, useEffect } from "react";
import useGlobalContext from "Hooks/useGlobalContext";
import { ButtonIcon, Logo, Overlay, NavigationLinks } from "Components";
import { ReactComponent as Bars } from "Assets/Bars.svg";
import sideBarKid from "Assets/sideBarKid.png";

function SiteNav() {
   const { isSiteNavOpen, dispatch, siteNavTabIndex: tabIndexValue } = useGlobalContext();

   const closeSiteNav = useCallback(() => dispatch({ type: "moveSiteNav", open: false }), []);

   useEffect(() => {
      document.body.style.overflow = isSiteNavOpen ? "hidden" : "initial";
   }, [isSiteNavOpen]);

   return (
      <aside
         className={`page-sidebar ff-roboto bg-primary ${isSiteNavOpen ? "page-sidebar--open" : ""}`}
         aria-hidden={isSiteNavOpen ? "false" : "true"}
      >
         <header className="page-sidebar__header flex">
            <ButtonIcon
               classValue="page-sidebar__close-sidebar-btn icon"
               ariaLabl="close sidebar"
               tabIndexValue={tabIndexValue}
               Icon={Bars}
               handelClick={closeSiteNav}
            />
            <Logo tabIndexValue={tabIndexValue} handelClick={closeSiteNav} />
         </header>
         <nav className="page-sidebar__nav">
            <ul className="page-sidebar__primary-list">
               <li className="page-sidebar__item">
                  <NavigationLinks tabIndexValue={tabIndexValue} handelClick={closeSiteNav} />
               </li>
            </ul>
         </nav>
         <div className="page-sidebar__kid-img-container">
            <img
               className={`page-sidebar__kid-img ${isSiteNavOpen ? "page-sidebar__kid-img--show" : ""}`}
               src={sideBarKid}
               alt="kid"
            />
         </div>
         {isSiteNavOpen && <Overlay handelClick={closeSiteNav} />}
      </aside>
   );
}

export default React.memo(SiteNav);
