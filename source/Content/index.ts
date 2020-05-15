import { browser } from "webextension-polyfill-ts";
import * as constants from "./constants";

function getDOMTitle(params: { platform: string }): Promise<string> {
  switch (params.platform) {
    case "Medium": {
      const domTitle: HTMLElement | null = document.querySelector(
        "h3.graf--title"
      );
      const innerTitle = (domTitle && domTitle.innerText) || "";
      return Promise.resolve(innerTitle);
    }
    default:
      return Promise.reject();
  }
}

function getDOMContent(params: { platform: string }): Promise<string> {
  switch (params.platform) {
    case "Medium": {
      const domParagraphs = document.querySelectorAll(
        ".section-content p.graf--p, .section-content img, .section-content h3:not(.graf--title), .section-content h4, .section-content blockquote"
      );
      let domContent = "";

      Array.from(domParagraphs).forEach(function (el) {
        domContent = domContent + el.outerHTML;
      });

      return Promise.resolve(domContent);
    }
    default:
      return Promise.reject();
  }
}

function getDOMImage(params: { platform: string }): Promise<string> {
  switch (params.platform) {
    case "Medium": {
      const domImage = document.querySelector(".section-content img");
      const imageUrl = (domImage && domImage.getAttribute("src")) || "";

      return Promise.resolve(imageUrl);
    }
    default:
      return Promise.reject();
  }
}

/**
 *  Listen for messages from UI
 */
browser.runtime.onMessage.addListener((request, _sender): any => {
  // eslint-disable-next-line default-case
  switch (request.action) {
    case constants.GET_TITLE: {
      return getDOMTitle(request.params);
    }
    case constants.GET_CONTENT: {
      return getDOMContent(request.params);
    }
    case constants.GET_IMAGE: {
      return getDOMImage(request.params);
    }
  }
});
