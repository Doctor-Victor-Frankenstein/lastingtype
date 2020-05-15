import React, { useEffect } from "react";
import * as hive from "@hiveio/hive-js";
import {
  withFormik,
  Field,
  Form,
  FormikBag,
  FormikProps,
  FormikErrors,
} from "formik";

import Icon from "../components/Icon";
import {
  ApiErroredProperties,
  VerifyAuthBodyProperties,
  SuccessfulVerifyAuthBodyProperties,
} from "../Background";
import messageUtil from "../util/mesageUtil";
import { VERIFY_AUTH } from "../Background/constants";
import { ExtensionConfigProperties } from "./Options";
import { TextField } from "../components/Input";
import { updateExtensionSettings } from "../util/settings";

export type OptionsFormValuesProperties = {
  username: string;
  postingKey: string;
};

// Note: The default key-value pairs are not saved to storage without any first interaction
const InnerForm: React.FC<FormikProps<OptionsFormValuesProperties>> = (
  props
) => {
  const { isSubmitting, handleSubmit, setStatus, status } = props;

  // run on component update
  useEffect(() => {
    setStatus({ error: null, message: "" });
  }, [setStatus]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off" id="options__form">
      <div>
        <Field
          name="username"
          type="text"
          component={TextField}
          label="Username of your Hive account"
          onFocus={() => setStatus({ error: null, message: "" })}
        />
        <Field
          name="postingKey"
          type="password"
          component={TextField}
          label="Posting Key of your Hive account"
          onFocus={() => setStatus({ error: null, message: "" })}
        />

        <button
          type="submit"
          onClick={() => setStatus({ error: null, message: "" })}
          className={
            (status && status.error && "btn-primary submit danger") ||
            "btn-primary submit"
          }
          disabled={isSubmitting}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {isSubmitting ? (
            <Icon name="spinner" className="icon" />
          ) : status && status.error !== null ? (
            (status && !status.error && (
              <Icon name="tick" className="icon" />
            )) || <Icon name="cross" className="icon" />
          ) : (
            <Icon name="tick" className="icon" />
          )}
          {(status && status.error && status.message) || "Add account"}
        </button>
      </div>
    </Form>
  );
};

// The type of props `OptionsForm` receives
type OptionsFormProperties = {
  extensionConfig: ExtensionConfigProperties;
  setActiveAccountChain: any;
};

// Wrap our form with the withFormik HoC
const OptionsForm = withFormik<
  OptionsFormProperties,
  OptionsFormValuesProperties
>({
  // Transform outer props into form values
  mapPropsToValues: ({
    extensionConfig: { username, postingKey },
  }: OptionsFormProperties): OptionsFormValuesProperties => {
    return {
      username,
      postingKey,
    };
  },

  validate: (
    values: OptionsFormValuesProperties
  ): FormikErrors<OptionsFormValuesProperties> => {
    const errors: FormikErrors<OptionsFormValuesProperties> = {};
    const validateUsername = hive.utils.validateAccountName(values.username);

    if (!values.username || validateUsername) {
      errors.username = validateUsername;
    }

    if (!values.postingKey || !hive.auth.isWif(values.postingKey)) {
      errors.postingKey = "Please enter your correct Hive Posting Key.";
    }

    return errors;
  },
  handleSubmit: async (
    { username, postingKey }: OptionsFormValuesProperties,
    {
      props,
      ...actions
    }: FormikBag<OptionsFormProperties, OptionsFormValuesProperties>
  ) => {
    const authValidationBody: VerifyAuthBodyProperties = {
      username,
      postingKey,
    };
    const response:
      | SuccessfulVerifyAuthBodyProperties
      | ApiErroredProperties = await messageUtil.send(
      VERIFY_AUTH,
      authValidationBody
    );

    if (!response.error) {
      actions.setStatus({
        error: false,
        message: "Chain credentials are valid",
      });
      await updateExtensionSettings({ username, postingKey });
      props.setActiveAccountChain({ username, postingKey });
    } else {
      actions.setStatus({
        error: true,
        message: "Credentials are invalid. Try again?",
      });
    }

    actions.setSubmitting(false);
  },

  displayName: "OptionsForm",
})(InnerForm);

export default OptionsForm;
