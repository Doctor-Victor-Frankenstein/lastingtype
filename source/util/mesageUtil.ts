/* eslint-disable @typescript-eslint/no-explicit-any */

import { browser } from "webextension-polyfill-ts";

const messageUtil = {
  send(name: string, params?: any): Promise<any> {
    const data = {
      action: name,
      params,
    };
    return browser.runtime.sendMessage(data);
  },
  async sendInTab(name: string, params?: any): Promise<any> {
    const data = {
      action: name,
      params,
    };
    const tabs: any = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    return browser.tabs.sendMessage(tabs[0].id, data);
  },
};

export default messageUtil;
