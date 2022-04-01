import { header, preloader } from "./header-preloader-settings.js";
import * as surahsOverviewSec from "./surahsOverviewSec.js";
import * as storage from "./storage.js";
import * as bookmarksAndHistory from "./bookmarksAndHistory.js";
import { settingsSectionEl } from "./header-preloader-settings.js";

//  variables
export const sidebarEl = document.querySelector(".page-sidebar");
const closeSidebarBtn = document.querySelector(".page-sidebar__close-sidebar-btn");
const sidebarImgKid = document.querySelector(".page-sidebar__kid-img");
const homeBtn = document.querySelector(".page-sidebar__home-Btn");
const BookmarksAndHistoryBtn = document.querySelector(".page-sidebar__bookmarks-history-Btn");
const overlayEl = document.querySelector(".page-sidebar-overlay");
const sidebarLogoEl = document.querySelector('.page-sidebar__logo')
// functions

export function setupSidebarEventListeners() {
   header.openSidebarBtn.addEventListener("click", moveSidebar(false));

   closeSidebarBtn.addEventListener("click", moveSidebar(true));

   overlayEl.addEventListener("click", moveSidebar(true));

   homeBtn.addEventListener("click", (e) => {
      if (sidebarEl.querySelector('[aria-selected="true"]'))
         sidebarEl.querySelector('[aria-selected="true"]').ariaSelected = "false";
      homeBtn.setAttribute("aria-selected", "true");
      moveSidebar(true)();
      surahsOverviewSec.build(storage.surahsInfo);
      preloader.removePreloader();
      document.title ="Quran For You"
   });
   
   sidebarLogoEl.addEventListener("click", _ => homeBtn.click())

   header.headerLogoEl.addEventListener("click", _ => homeBtn.click())

   BookmarksAndHistoryBtn.addEventListener("click", (_) => {
      moveSidebar(true)();
      bookmarksAndHistory.build();
      window.scrollTo(0, 0);
      if (sidebarEl.querySelector('[aria-selected="true"]'))
      sidebarEl.querySelector('[aria-selected="true"]').ariaSelected = "false";
      BookmarksAndHistoryBtn.ariaSelected = "true";
      preloader.removePreloader();
      document.title ="Bookmarks History - Quran For You"
   });
}

function moveSidebar(IsSidebarOpen) {
   // the logic is if the sidebar is open we will close it and if isn't we will open it
   return (_) => {
      if (IsSidebarOpen) {
         sidebarEl.classList.remove("page-sidebar--open");
         sidebarImgKid.classList.remove("page-sidebar__kid-img--show");
      } else {
         sidebarEl.classList.add("page-sidebar--open");
         sidebarImgKid.classList.add("page-sidebar__kid-img--show");
      }
      document.body.style.overflow = IsSidebarOpen ? "initial" : "hidden";
      overlayEl.style.display = IsSidebarOpen ? "none" : "block";
      sidebarEl.ariaHidden = IsSidebarOpen ? "true" : "false";
      // improve keyboard traversing
      document.body.querySelectorAll("a, button, [tabindex], input").forEach((element) => {
         if (sidebarEl.contains(element)) {
            element.setAttribute("tabindex", IsSidebarOpen ? "-1" : "0");
         } else if (!settingsSectionEl.contains(element)) {
            element.setAttribute("tabindex", IsSidebarOpen ? "0" : "-1");
         }
      });
   };
}
