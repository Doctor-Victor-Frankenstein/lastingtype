/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from "webextension-polyfill-ts";
import * as hive from "@hiveio/hive-js";
import { createPermlink } from "../util/link";

import * as constants from "./constants";

export type ApiErroredProperties = {
  error: true;
  message: string;
};

export type SuccessfulVerifyAuthBodyProperties = {
  error: false;
  data: {
    username: string;
    postingKey: string;
  };
};

export type VerifyAuthBodyProperties = {
  username: string;
  postingKey: string;
};

export type SuccessfulPublishBodyProperties = {
  error: false;
  data: any;
};
export type PublishBodyProperties = {
  username: string;
  postingKey: string;
  title: string;
  body: string;
};

async function verifyAuth({
  username,
  postingKey,
}: VerifyAuthBodyProperties): Promise<
  SuccessfulVerifyAuthBodyProperties | ApiErroredProperties
> {
  const getAccountPublicKey = () =>
    new Promise<any>((resolve, reject) => {
      hive.api.getAccounts([username], function (err: string, result: [any]) {
        console.log("err", err);
        console.log("result", result);

        if (result && result.length) {
          resolve(result[0].posting.key_auths[0][0]);
        } else reject();
      });
    });

  try {
    const publicKey = await getAccountPublicKey();

    if (publicKey && hive.auth.wifIsValid(postingKey, publicKey)) {
      return {
        error: false,
        data: { username, postingKey },
      };
    }
    return {
      error: true,
      message: "Error: Posting Key is invalid.",
    };
  } catch (e) {
    return {
      error: true,
      message: "Error: Something went wrong.",
    };
  }
}

async function publish({
  username,
  postingKey,
  title,
  body,
}: PublishBodyProperties): Promise<
  SuccessfulPublishBodyProperties | ApiErroredProperties
> {
  let operations: any[] = [];
  const permlink = await createPermlink(title, username);

  const commentOp = [
    "comment",
    {
      parent_author: "",
      parent_permlink: "lastingtype",
      author: username,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify({}),
    },
  ];

  const commentOptionsConfig = {
    author: username,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    max_accepted_payout: "1000000.000 SBD",
    percent_steem_dollars: 10000,
    extensions: [],
  };

  operations.push(commentOp);
  operations.push(["comment_options", commentOptionsConfig]);

  return new Promise(async (resolve, reject) => {
    hive.broadcast.send(
      {
        extensions: [],
        operations,
      },
      { posting: postingKey },
      (err: string, res: any) => {
        if (res && res.id)
          return resolve({
            error: false,
            data: {
              ...res,
              permlink,
            },
          });
        return reject({
          error: true,
          message: err,
        });
      }
    );
  });
}

/**
 *  Listen for messages from UI
 */
browser.runtime.onMessage.addListener((request, _sender): void | Promise<
  any
> => {
  // eslint-disable-next-line default-case
  switch (request.action) {
    case constants.PUBLISH: {
      return publish(request.params);
    }
    case constants.VERIFY_AUTH: {
      return verifyAuth(request.params);
    }
  }
});
