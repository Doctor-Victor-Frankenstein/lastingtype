import React, { useEffect, useState } from "react";
import * as hive from "@hiveio/hive-js";

import {
  ApiErroredProperties,
  SuccessfulPublishBodyProperties,
} from "../Background";
import messageUtil from "../util/mesageUtil";
import { PUBLISH } from "../Background/constants";
import { GET_TITLE, GET_CONTENT, GET_IMAGE } from "../Content/constants";
import { POPUP_PUBLISH, POPUP_PUBLISHED, POPUP_NEW } from "./constants";

import PopupHeader from "./Header";
import PopupGo from "./PopupGo";
import PopupBody from "./PopupBody";
import { getExtensionSettings } from "../util/settings";
import BodyWrapper from "../components/BodyWrapper";
import Loader from "../components/Loader";

import "./styles.scss";
import { openExtOptionsPage, getTabUrl } from "../util/tabs";

export type ProcessRequestProperties = React.Dispatch<
  React.SetStateAction<{
    error: boolean | null;
    message: string;
  }>
>;

export type UserConfigProperties = {
  username: string;
  postingKey: string;
};

export type SetPageReloadFlagProperties = React.Dispatch<
  React.SetStateAction<boolean>
>;

const Popup: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [popupView, setPopupView] = useState<string>("");
  const [article, setArticle] = useState<any>({});
  const [targetPlatform, setTargetPlatform] = useState<string>("");
  const [userConfig, setUserConfig] = useState<UserConfigProperties>({
    username: "",
    postingKey: "",
  });
  const { username, postingKey } = userConfig;
  const { title, body } = article;
  const publish = async () => {
    setLoading(true);

    const response:
      | SuccessfulPublishBodyProperties
      | ApiErroredProperties = await messageUtil.send(PUBLISH, {
      username,
      postingKey,
      title,
      body,
    });
    if (!response.error) {
      setPopupView(POPUP_PUBLISHED);
      setArticle({
        ...article,
        id: response.data.id,
        permlink: response.data.permlink,
      });
    }
    setLoading(false);
  };

  useEffect((): void => {
    async function getDomContent(): Promise<void> {
      const title: string = await messageUtil.sendInTab(GET_TITLE, {
        platform: targetPlatform,
      });
      const body: string = await messageUtil.sendInTab(GET_CONTENT, {
        platform: targetPlatform,
      });
      const image: string = await messageUtil.sendInTab(GET_IMAGE, {
        platform: targetPlatform,
      });
      setArticle({
        title,
        image,
        body,
      });
    }
    if (popupView === POPUP_PUBLISH) getDomContent();
  }, [popupView]);

  useEffect((): void => {
    async function getUserSettings(): Promise<void> {
      const { settings = {} } = await getExtensionSettings();
      const validateUsername = hive.utils.validateAccountName(
        settings.username
      );

      if (!hive.auth.isWif(settings.postingKey) || validateUsername) {
        setLoading(false);
        return openExtOptionsPage();
      }

      setUserConfig({
        username: settings.username,
        postingKey: settings.postingKey,
      });

      setLoading(false);
    }
    getUserSettings();
  }, []);

  useEffect((): void => {
    async function setupView() {
      const url = await getTabUrl();

      if (url.includes("medium.com") && targetPlatform !== "Medium")
        setTargetPlatform("Medium");

      if (url.includes("/new-story") && popupView !== "newstory")
        setPopupView(POPUP_NEW);

      if (url.includes("/edit") && popupView !== "publish")
        setPopupView(POPUP_PUBLISH);
    }

    setupView();
  }, []);

  return (
    <BodyWrapper>
      <div id="popup">
        {!loading ? (
          <>
            <PopupHeader username={userConfig.username} />
            {(!popupView && <PopupGo />) || (
              <PopupBody
                popupView={popupView}
                publish={publish}
                article={article}
                user={userConfig.username}
                targetPlatform={targetPlatform}
              />
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </BodyWrapper>
  );
};

export default Popup;
