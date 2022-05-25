import { Link } from "react-router-dom";
import React from "react";
import { ReactComponent as LogoIcon } from "../../Assets/Logo.svg";

function Logo({ tabIndexValue, handelClick }) {

   return (
      <Link to="/" style={{ width: "7.5rem" }} aria-label="logo" tabIndex={tabIndexValue} onClick={handelClick}>
         <LogoIcon />
      </Link>
   );
}

export default React.memo(Logo) ;
