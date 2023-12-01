import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select } from 'components/UI';
import { useSavedState } from 'hooks';
import { getAll } from 'helper/apis/towers';

export default function TowersSearch({ tower, ...props }) {
  const { t } = useTranslation('common');
  const [defaultOptions, setDefaultOptions, clearDefaultOptions] = useSavedState([], "easier-towers-cache");
  useEffect(() => {
    const fetchData = async () => {
      await TowersSearch("", (data) => setDefaultOptions(data));
    };
    !defaultOptions?.length && fetchData();
  }, [])

  const TowersSearch = async (inputValue = "", callback) => {
    const data = await getAll({
      search: inputValue,
      searchFields: ["name"],
      sort: "name",
      select: "name -owner",
      page: 1,
      limit: 10
    })
    const items = data.items;
    if (!items?.length) {
      return callback([]);
    }
    return callback(
      [...items]?.map((c) => {
        return {
          value: c._id,
          label: c.name,
        };
      })
    );


  };

  return (
    <Select
      label={t('tower_key')}
      mandatory
      async={true}
      loadOptions={TowersSearch}
      isDisabled={false}
      value={tower.value}
      onChange={(value) => {
        tower.changeValue(value);
      }}
      {...props}
      defaultOptions={defaultOptions}
    />
  );
}

TowersSearch.propTypes = {
  tower: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
};