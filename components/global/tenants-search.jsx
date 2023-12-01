import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select } from 'components/UI';
import { useSavedState } from 'hooks';
import { getAll } from 'helper/apis/tenants';

export default function TenantsSearch({ tenant, ...props }) {
  const { t } = useTranslation('common');
  const [defaultOptions, setDefaultOptions, clearDefaultOptions] = useSavedState([], "easier-tenant-cache");
  useEffect(() => {
    const fetchData = async () => {
      await TenantsSearch("", (data) => setDefaultOptions(data));
    };
    !defaultOptions?.length && fetchData();
  }, [])

  const TenantsSearch = async (inputValue = "", callback) => {
    const data = await getAll({
      search: inputValue,
      searchFields: ["name"],
      sort: "name",
      select: "name role",
      filters: "role=user",
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
      label={t('tenant_key')}
      mandatory
      async={true}
      loadOptions={TenantsSearch}
      isDisabled={false}
      value={tenant.value}
      onChange={(value) => {
        tenant.changeValue(value);
      }}
      {...props}
      defaultOptions={defaultOptions}
    />
  );
}

TenantsSearch.propTypes = {
  tenant: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
};