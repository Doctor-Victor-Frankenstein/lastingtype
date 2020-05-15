import React from "react";
import Icon from "../components/Icon";

import "./styles.scss";
import { goTo } from "../util/tabs";

const PopupGo: React.FC = () => {
  return (
    <div className="main">
      <div className="goto">
        <h3>
          Let's get to typing.<span className="blink">.</span>
          <span className="blink">.</span>
        </h3>
        <ul>
          <li>
            <Icon name="zap" className="icon" />
            <img
              src="assets/medium.png"
              alt="Medium.com logo"
              width="110px"
              onClick={() => goTo("https://medium.com/new-story")}
            />
          </li>
          <li className="disabled">
            <Icon name="zap" className="icon" />
            <img
              src="assets/wordpress.png"
              alt="WordPress logo"
              width="140px"
            />
          </li>
        </ul>
        <ul>
          <li className="disabled">
            <Icon name="zap" className="icon" />
            <img src="assets/blogger.png" alt="Blogger logo" width="90px" />
          </li>
          <li className="disabled">
            <Icon name="zap" className="icon" />
            <img src="assets/ghost.png" alt="Ghost CMS logo" width="100px" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PopupGo;
