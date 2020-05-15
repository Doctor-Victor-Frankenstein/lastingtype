import React from "react";

import Icon from "../components/Icon";
import { openExtOptionsPage } from "../util/tabs";

type HeaderProperties = {
  username: string;
};

const Header: React.FC<HeaderProperties> = ({ username }) => {
  return (
    <>
      <header id="header">
        <div className="logo__holder">
          <img src="assets/logo.png" alt="logo" />
        </div>
        <div className="action__buttons--holder">
          <small>
            Connected as <b>{username}</b>
          </small>
          <Icon
            className="icon settings__icon"
            name="settings"
            title="Settings"
            onClick={openExtOptionsPage}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
