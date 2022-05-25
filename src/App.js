import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SharedLayout, Home, BookmarksHistory, Search, Surah, SurahWithSingleVerse } from "Pages";
import "Scss/main.scss";

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<SharedLayout />}>
               <Route index element={<Home />} />
               <Route path="/Bookmarks_History" element={<BookmarksHistory />} />
               <Route path="/search" element={<Search />} />
               <Route path="/:surahId" element={<Surah />} />
               <Route path="/:surahId/:verseNumber" element={<SurahWithSingleVerse />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}

export default App;
