import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, SiteNav, SettingsSidebar, AudioPlayer } from "Components";

function SharedLayout() {
   const location = useLocation();
   
   useEffect(() => {
      window.scroll(0, 0);
   }, [location]);

   return (
      <>
         <Header />
         <SiteNav />
         <SettingsSidebar />
         <AudioPlayer />
         <Outlet />
      </>
   );
}

export default React.memo(SharedLayout);
