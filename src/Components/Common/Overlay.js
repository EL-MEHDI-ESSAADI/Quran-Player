import React from "react";
import ReactDOM from "react-dom";

function Overlay({handelClick}) {
   
   return ReactDOM.createPortal(
      <div className="page-sidebar-overlay" onClick={handelClick}></div>,
      document.querySelector(".overlay-container")
   );
}

export default Overlay;
