import React from "react";
import { navigationLinks } from "data";
import { MyNavLink } from "Components";
import { useLocation } from "react-router-dom";

function NavigationLinks({ tabIndexValue, handelClick }) {
   const { pathname: currentPathName } = useLocation();

   return navigationLinks.map((link) => (
      <MyNavLink
         key={link.id}
         to={link.pathName}
         tabIndexValue={tabIndexValue}
         isSelected={currentPathName === link.pathName ? true : false}
         Icon={link.Icon}
         name={link.name}
         handelClick={handelClick}
      />
   ));
}

export default NavigationLinks;
