import React from "react";

function Preloader({style}) {
   return (
      <div className="preloader" style={style}>
         <div className="wheel first-w">
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
         </div>
         <div className="wheel second-w">
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
         </div>
         <div className="wheel third-w">
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
         </div>
         <div className="overlay"></div>
      </div>
   );
}

export default Preloader;
