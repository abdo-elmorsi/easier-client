import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'; // Import PropTypes
import { Select } from 'components/UI';

export default function TrueOrFalseOptions({ label, KeyName }) {
  const { t } = useTranslation("common");

  return (
    <div className="">
      <Select
        label={label}
        options={[
          {
            value: null,
            label: t("all_key")
          },
          {
            value: true,
            label: t("yes_key")
          },
          {
            value: false,
            label: t("no_key")
          }
        ]}
        value={paymentMethod.value}
        onChange={(value) => {
          paymentMethod.changeValue(value);
          fetchReport && fetchReport({ [KeyName]: value });
        }}
        {...KeyName.bind}
      />
    </div>
  );
}

TrueOrFalseOptions.propTypes = {
  label: PropTypes.string.isRequired,
  KeyName: PropTypes.string.isRequired,
};
