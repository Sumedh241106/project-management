import React from "react";

type Props = {
  name: string;
  buttonComponent?: any;
  isSmall?: boolean;
};

const Header = ({ name, buttonComponent, isSmall = false }: Props) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between">
      <h1
        className={`${
          isSmall ? "text-lg" : "text-2xl"
        } font-semibold text-gray-900 dark:text-white`}
      >
        {name}
      </h1>
      {buttonComponent}
    </div>
  );
};

export default Header;