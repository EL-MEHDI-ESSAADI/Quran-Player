import React from "react";
import useGlobalContext from "Hooks/useGlobalContext";
import { BookmarkItem } from "Components";
import { surahsOverviewData } from "data";

function BookmarksItems({ tabIndexValue }) {
   const { bookmarks } = useGlobalContext();
   const bookmarksElements = [...bookmarks.entries()]
      .reverse()
      .map(([verseKey, surahId]) => (
         <BookmarkItem
            key={verseKey}
            verseKey={verseKey}
            surahName={surahsOverviewData[surahId - 1].englishName}
            tabIndexValue={tabIndexValue}
         />
      ));

   return (
      <div className="bookmarks__items">
         {bookmarksElements.length ? bookmarksElements : "You Do Not Have Any Bookmarks Yet"}
      </div>
   );
}

export default React.memo(BookmarksItems);
