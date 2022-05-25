import React from "react";
import { Link } from "react-router-dom";
import { surahsOverviewData } from "data";

function HistoryItem({ surahId, tabIndexValue }) {
   const surahData = surahsOverviewData[surahId - 1];

   return (
      <Link className="history__item" to={`/${surahId}`} tabIndex={tabIndexValue}>
         <div className="flex history__top-container">
            <p className="history__item__trn-name">{surahData.englishNameTranslation}</p>
            <span className="history__item__id ff-roboto">{surahData.number}</span>
         </div>
         <div className="history__item__eg-name">
            Surah
            <br />
            <span>{surahData.englishName}</span>
         </div>
         <div className="history__item__ar-name ff-amiri">{surahData.name}</div>
      </Link>
   );
}

export default React.memo(HistoryItem);
