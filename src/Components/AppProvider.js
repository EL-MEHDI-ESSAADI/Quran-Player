import React, { useEffect, useMemo, useReducer } from "react";
import appContext from "Context/globalContext";

const initailState = {
   isSiteNavOpen: false,
   isSettingsSidebarOpen: false,
   settings: JSON.parse(localStorage.getItem("settings")) || {
      selectedTranslation: { id: 131, name: "Dr. Mustafa Khattab", lang: "english" },
      selectedReciter: {
         id: 4,
         name: "Abu Bakr al-Shatri",
      },
      autoScroll: true,
   },
   history: JSON.parse(localStorage.getItem("history")) || [],
   bookmarks: new Map(JSON.parse(localStorage.getItem("bookmarks"))),
   audio: {
      activeSurahOnAudio: null,
      activeVerseOnAudio: null,
      activeWordOnAudio: null,
      isAudioPlaying: false,
      isAudioLoading: false,
      isAudioPlayerAppears: false,
      forcePlayingVerse: null,
   },
};

// hhh how to add a map to localStorage by shon.parse !!!

function reducer(state, action) {
   switch (action.type) {
      case "moveSiteNav":
         return { ...state, isSiteNavOpen: action.open };
      case "moveSettingsSidebar":
         return { ...state, isSettingsSidebarOpen: action.open };
      case "changeSelectedTranslation":
         return { ...state, settings: { ...state.settings, selectedTranslation: action.value } };
      case "changeSelectedReciter":
         return { ...state, settings: { ...state.settings, selectedReciter: action.value } };
      case "changeAutoScroll":
         return { ...state, settings: { ...state.settings, autoScroll: action.value } };
      case "addSurahToHistory": {
         const newHistory = state.history.filter((id) => id !== action.id);
         newHistory.unshift(action.id);
         if (newHistory.length > 10) newHistory.length = 10;
         return { ...state, history: newHistory };
      }
      case "addToBookmarks":
         return { ...state, bookmarks: new Map([...state.bookmarks]).set(action.verseKey, action.surahId) };
      case "removeFromBookmarks": {
         const newBookmarks = new Map([...state.bookmarks]);
         newBookmarks.delete(action.verseKey);
         return { ...state, bookmarks: newBookmarks };
      }
      case "makeSurahActiveOnAudio":
         return {
            ...state,
            audio: {
               activeSurahOnAudio: action.id,
               activeVerseOnAudio: action.verseKey,
               activeWordOnAudio: action.wordPosition,
               isAudioPlaying: false,
               isAudioLoading: false,
               isAudioPlayerAppears: true,
            },
         };
      case "changeAudioLoading":
         return {
            ...state,
            audio: {
               ...state.audio,
               isAudioLoading: action.value,
            },
         };
      case "changeAudioPlayingState":
         return {
            ...state,
            audio: {
               ...state.audio,
               isAudioPlaying: action.value,
            },
         };
      case "changeActiveVerseAndWord":
         return {
            ...state,
            audio: {
               ...state.audio,
               activeVerseOnAudio: action.newActiveVerseOnAudio,
               activeWordOnAudio: action.newActiveWordOnAudio,
            },
         };
      case "changeAudioAppearance":
         return { ...state, audio: { ...state.audio, isAudioPlayerAppears: action.value } };
      case "changeForcePlayingVerse":
         return { ...state, audio: { ...state.audio, forcePlayingVerse: action.value } };
      default:
         throw new Error("none of action type is valid");
   }
}

function AppProvider({ children }) {
   const [state, dispatch] = useReducer(reducer, null, () => initailState);

   useEffect(() => {
      localStorage.setItem("settings", JSON.stringify(state.settings));
      localStorage.setItem("history", JSON.stringify(state.history));
      localStorage.setItem("bookmarks", JSON.stringify([...state.bookmarks]));
   }, [state.settings, state.history, state.bookmarks]);

   const tabIndexes = useMemo(
      () => ({
         directContentTabIndex: state.isSiteNavOpen || state.isSettingsSidebarOpen ? -1 : 0,
         siteNavTabIndex: state.isSiteNavOpen ? 0 : -1,
         settingsSidebarTabIndex: state.isSettingsSidebarOpen ? 0 : -1,
      }),
      [state.isSettingsSidebarOpen, state.isSiteNavOpen]
   );

   return (
      <appContext.Provider
         value={{
            isSiteNavOpen: state.isSiteNavOpen,
            isSettingsSidebarOpen: state.isSettingsSidebarOpen,
            dispatch,
            ...tabIndexes,
            ...state.settings,
            ...state.audio,
            history: state.history,
            bookmarks: state.bookmarks,
         }}
      >
         {children}
      </appContext.Provider>
   );
}

export default AppProvider;
