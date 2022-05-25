import React from "react";
import { useNavigate } from "react-router-dom";

function BackToHome({ messege }) {
   const navigate = useNavigate();

   return (
      <main id="main">
         <div className="backToHomeSection">
            <h1 className="backToHomeSection__msg">{messege}</h1>
            <button
               className="backToHomeSection__back-btn"
               aria-label="bock to home"
               onClick={() => navigate("/")}
            >
               Go Back
            </button>
         </div>
      </main>
   );
}

export default React.memo(BackToHome);
