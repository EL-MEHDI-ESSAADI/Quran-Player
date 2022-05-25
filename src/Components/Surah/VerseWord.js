import React from "react";

function VerseWord({ egTranslation, qcfText, qcfFontPage, isWordPlaying }) {
   return (
      <div
         className={`verse__ar-txt__word-btn ${isWordPlaying ? "verse__ar-txt__word-btn--active" : ""}`}
         style={{ fontFamily: `p${qcfFontPage}, sans-serif` }}
      >
         <span>{qcfText}</span>
         <span className="fs-300 ff-openSans verse__ar-txt__word-trn">{egTranslation}</span>
      </div>
   );
}

export default React.memo(VerseWord);
