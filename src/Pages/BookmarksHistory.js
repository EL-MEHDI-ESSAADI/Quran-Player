import React, { useEffect } from "react";
import useGlobalContext from "Hooks/useGlobalContext";
import { HistoryItems, BookmarksItems } from "Components";

function BookmarksHistory() {
   const { directContentTabIndex: tabIndexValue } = useGlobalContext();

   useEffect(() => {
      document.title = "Bookmarks History - Quran For You";
   }, []);

   return (
      <main id="main">
         <div className="bookmarks-history-section">
            <section className="history">
               <header className="history__header">
                  <h3 className="history__section-name">History</h3>
               </header>
               {<HistoryItems tabIndexValue={tabIndexValue} />}
            </section>
            <section className="bookmarks">
               <header className="bookmarks__header">
                  <h3 className="bookmarks__section-name">Bookmarks</h3>
               </header>
               {<BookmarksItems tabIndexValue={tabIndexValue} />}
            </section>
         </div>
      </main>
   );
}

export default React.memo(BookmarksHistory);
