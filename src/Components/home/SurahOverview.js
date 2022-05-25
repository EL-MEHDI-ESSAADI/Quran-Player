import React from "react";
import { Link } from "react-router-dom";

function SurahOverview({ number, name, englishName, englishNameTranslation, numberOfAyahs, tabIndexValue }) {

   return (
      <Link className="surah flex" tabIndex={tabIndexValue} to={`/${number}`} >
         <div className="flex">
            <div className="surah__id-container bg-secondary">
               <span className="surah__id-body ff-roboto fw-600">{number}</span>
            </div>
            <div className="surah__eg-name fw-600 flow">
               <p>{englishName}</p>
               <p className="fs-200">{englishNameTranslation}</p>
            </div>
         </div>
         <div className="surah__ar-name fw-700 flow">
            <p className="ff-amiri">{name}</p>
            <p className="fs-200">
               <span className="ff-roboto">{numberOfAyahs}</span> Ayahs
            </p>
         </div>
      </Link>
   );
}

export default SurahOverview ;
