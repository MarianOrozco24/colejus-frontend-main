import React from "react";
import NavBar from "./NavBar";
import NavBarMobile from "./NavBarMobile";

/**
 * Reusable wrapper that renders the desktop and mobile navigation variants
 * depending on the viewport width.
 */
const ResponsiveNav = () => {
  return (
    <>
      <div className="hidden md:block">
        <NavBar />
      </div>
      <div className="md:hidden">
        <NavBarMobile />
      </div>
    </>
  );
};

export default ResponsiveNav;

