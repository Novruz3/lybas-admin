import { t } from "i18next";
import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../App";

function Search({
  className,
  title,
  action = null
}) {
  const { lang } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      className={
        "search p-5 bg-white rounded-lg shadow-lybas-1 w-full " + className
      }
    >
      <div className="search_header flex justify-between items-center">
        <div className="search_header_title text-lg font-bold">{t(title)}</div>
        {action && (
          <Link
            to={"/" + action.link}
            className="text-white bg-lybas-blue px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            {t(action.text)}
          </Link>
        )}
      </div>
    </div>
  );
}

export default Search;
