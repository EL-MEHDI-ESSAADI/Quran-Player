import React, { useEffect } from "react";
import { KidWaving, SurahsOverview } from "Components";
import { surahsOverviewData } from "data"

function Home() {

   useEffect(() => {
      document.title = "Quran For You"
   }, [])

   return (
      <main id="main">
         <div className="surahs-overview-section">
            <KidWaving />
            <SurahsOverview data={surahsOverviewData} />
         </div>
      </main>
   );
}

export default React.memo(Home);
