import React from "react";
import Typist from "react-typist";

import { POPUP_PUBLISH, POPUP_PUBLISHED, POPUP_NEW } from "./constants";
import Icon, { Icons } from "../components/Icon";

import "./styles.scss";
import { goTo } from "../util/tabs";

type PopupBodyProperties = {
  popupView: string;
  article: {
    id: string | undefined;
    permlink: string | undefined;
    title: string;
    image: string;
    body: string;
  };
  targetPlatform: string;
  user: string;
  publish: any;
};

const PopupBody: React.FC<PopupBodyProperties> = ({
  popupView,
  article,
  targetPlatform,
  publish,
  user,
}) => {
  if (popupView === POPUP_NEW || !article.title || !article.body)
    return (
      <div className="main">
        <div className="newstory">
          <h3>Start typing. Make it awesome!</h3>
          <img src="assets/writing-gif.gif" />
          <Typist className="typing">
            Once upon a time.<span className="blink">.</span>
            <span className="blink">.</span>
          </Typist>
        </div>
      </div>
    );

  if (popupView === POPUP_PUBLISH)
    return (
      <div className="main">
        <div className="publish">
          <div className="article">
            <div className="title">
              <Icon name={targetPlatform as Icons} className="icon-platform" />{" "}
              <span>{article.title}</span>
            </div>
            {article.image && (
              <div
                className="article-img"
                style={{ backgroundImage: `url("${article.image}")` }}
              />
            )}
          </div>
          <button
            type="button"
            className="btn-primary submit"
            onClick={() => publish()}
          >
            <Icon name="zap" className="icon" /> Publish to the blockchain
          </button>
        </div>
      </div>
    );

  if (popupView === POPUP_PUBLISHED)
    return (
      <div className="main">
        <div className="published">
          <h2>It will now last forever!</h2>
          <img src="assets/success-gif.gif" />
          <button
            type="button"
            className="btn-primary submit"
            onClick={() =>
              goTo(`https://hive.blog/lastingtype/@${user}/${article.permlink}`)
            }
          >
            <Icon name="zap" className="icon" /> View on the blockchain
          </button>
        </div>
      </div>
    );

  return (
    <div className="error">
      <h2>Something went wrong :(</h2>
    </div>
  );
};

export default PopupBody;
