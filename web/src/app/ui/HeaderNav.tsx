import React from "react";

interface HeaderNavProps {}

export const HeaderNav: React.FC<HeaderNavProps> = ({}) => {
  const headerItemStyle =
    "p-3 lg:p-3 m-1 hoverable area rounded-lg align-middle text-center";
  return (
    <div className="w-full h-16 bg-gradient-to-b from-indigo-600 to-secondary-main-100 shadow-md fixed top-0 z-50">
      <div className="flex-row flex justify-start h-full">
        <div className={headerItemStyle}>boards</div>
        <div className={headerItemStyle}>users</div>
        <div className={headerItemStyle}>events</div>
      </div>
    </div>
  );
};
