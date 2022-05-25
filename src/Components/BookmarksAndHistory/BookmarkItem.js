import React from "react";
import { Link } from "react-router-dom";

function BookmarkItem({ verseKey, surahName, tabIndexValue }) {
   return (
      <Link className="bookmarks__item" to={`/${verseKey.replace(":", "/")}`} tabIndex={tabIndexValue}>
         <div className="bookmarks__surah-name">{surahName}</div>
         <div className="bookmarks__verse-key ff-roboto">{verseKey}</div>
      </Link>
   );
}

export default React.memo(BookmarkItem);
