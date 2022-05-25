import React from "react";
import { NavLink } from "react-router-dom";

function MyNavLink({ tabIndexValue, isSelected, Icon, name, to = "/", handelClick }) {
   return (
      <NavLink
         to={to}
         className="fs-300 page-sidebar__home-Btn page-sidebar__link"
         tabIndex={tabIndexValue}
         aria-selected={isSelected}
         onClick={handelClick}
      >
         <Icon className="page-sidebar__link__icon" size={"1.2rem"} />
         <span className="page-sidebar__link__body">{name}</span>
      </NavLink>
   );
}

export default MyNavLink;
