import React from "react";
import { Verse } from "Components";
import useGlobalContext from "Hooks/useGlobalContext";

function Verses({ versesData, tranlationsData, tabIndexValue }) {
   const { bookmarks, activeVerseOnAudio, isAudioPlaying } = useGlobalContext();

   const versesElements = [...versesData].map(([verseKey, verseData]) => (
      <Verse
         key={verseKey}
         translation={tranlationsData.get(verseKey)}
         tabIndexValue={tabIndexValue}
         verseKey={verseKey}
         isVerseBookmarked={bookmarks.has(verseKey)}
         isVersePlaying={isAudioPlaying && activeVerseOnAudio === verseKey}
         {...verseData}
      />
   ));
   return <div className="surah-section__verses">{versesElements}</div>;
}

export default React.memo(Verses);
