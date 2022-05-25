import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { surahsOverviewData } from "data";
import { getPossibleSurahOverview } from "Helpers/utils";
import { KidWaving, SurahsOverview } from "Components";

function Search() {
   const searchValue = useSearchParams()[0].get("s");
   const [data, setData] = useState([]);

   useEffect(() => {
      setData(getPossibleSurahOverview(searchValue, surahsOverviewData));
   }, [searchValue]);

   useEffect(() => {
      document.title = "Search - Quran For You"
   }, [])

   return (
      <main id="main">
         <div className="surahs-overview-section">
            <KidWaving />
            <SurahsOverview data={data} />
         </div>
      </main>
   );
}

export default React.memo(Search)

