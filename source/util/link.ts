import base58 from "bs58";
import getSlug from "speakingurl";
import secureRandom from "secure-random";
import * as hive from "@hiveio/hive-js";

export const removeProtocol = (link: string): string =>
  link.replace(/^https?:\/\//, "");

function slug(text: string) {
  return getSlug(text.replace(/[<>]/g, ""), { truncate: 128 });
}

function checkPermLinkLength(permlink: string) {
  if (permlink.length > 255) {
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, "");
  return permlink;
}

export function createPermlink(title: string, author: string) {
  return new Promise((resolve) => {
    let permlink: string;
    let s = slug(title);
    if (s === "") {
      s = base58.encode(secureRandom.randomBuffer(4));
    }

    hive.api.getContent(author, s, function (err: string, res: any) {
      if (err) return Promise.reject(err);
      let prefix;
      if (res.body !== "") {
        prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
      } else {
        prefix = "";
      }
      permlink = prefix + s;

      return resolve(checkPermLinkLength(permlink));
    });
  });
}
