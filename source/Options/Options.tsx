import React, { useEffect, useState } from "react";
import { getExtensionSettings } from "../util/settings";
import { goTo } from "../util/tabs";

import BodyWrapper from "../components/BodyWrapper";
import Loader from "../components/Loader";
import OptionsForm from "./OptionsForm";
import Icon from "../components/Icon";

export type ExtensionConfigProperties = {
  username: string;
  postingKey: string;
};

const Options: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [accountChange, setAccountChange] = useState(false);
  const [extensionConfig, setExtensionConfig] = useState<
    ExtensionConfigProperties
  >({
    username: "",
    postingKey: "",
  });

  useEffect(() => {
    async function getSavedSettings(): Promise<void> {
      const { settings = {} } = await getExtensionSettings();
      const userConfig: ExtensionConfigProperties = {
        username: settings.username || extensionConfig.username,
        postingKey: settings.postingKey || extensionConfig.postingKey,
      };

      setExtensionConfig(userConfig);
      setLoading(false);
    }

    getSavedSettings();
  }, [extensionConfig.username, extensionConfig.postingKey]);

  const setActiveAccountChain = (data: ExtensionConfigProperties) => {
    setExtensionConfig(data);
    setAccountChange(false);
  };

  return (
    <BodyWrapper>
      <div id="options">
        <div className="logo">
          <img src="assets/logo-white.png" alt="logo" />
        </div>
        {!loading ? (
          ((!extensionConfig.username ||
            !extensionConfig.postingKey ||
            accountChange) && (
            <>
              <h2>Setup your account</h2>
              <OptionsForm
                extensionConfig={extensionConfig}
                setActiveAccountChain={setActiveAccountChain}
              />
              <small>
                All your information are safely stored in your browser and are
                only used locally.
              </small>
            </>
          )) || (
            <div id="options-loggedin">
              <h2>
                Let's get to typing.<span className="blink">.</span>
                <span className="blink">.</span>
              </h2>
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
                  <img
                    src="assets/blogger.png"
                    alt="Blogger logo"
                    width="90px"
                  />
                </li>
                <li className="disabled">
                  <Icon name="zap" className="icon" />
                  <img
                    src="assets/ghost.png"
                    alt="Ghost CMS logo"
                    width="100px"
                  />
                </li>
              </ul>
              <div className="change-account">
                <p>
                  You are logged in with the blockchain user{" "}
                  <b>{extensionConfig.username}</b>. Would you like to change
                  your account?
                </p>
                <button
                  type="button"
                  onClick={() => setAccountChange(true)}
                  className="btn-primary submit"
                >
                  <Icon name="refresh" className="icon" /> Change account
                </button>
              </div>
            </div>
          )
        ) : (
          <Loader />
        )}
      </div>
    </BodyWrapper>
  );
};

export default Options;
