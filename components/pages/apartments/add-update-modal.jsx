import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

// Custom
import { useHandleMessage, useInput, useSelect } from "hooks"
import { Button, Spinner, Input } from "components/UI";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { UserSearch, TowersSearch } from "components/global";
import API from "helper/apis";
import { cancelRequestWithUrl } from "helper/apis/axiosInstance";


export default function AddUpdateModal({  handleClose, id }) {
  const { t } = useTranslation("common");

  const handleMessage = useHandleMessage();
  const [loading, setLoading] = useState(id);
  const [submitted, setSubmitted] = useState(false);

  const piece_number = useInput("", "number", true);
  const floor_number = useInput("", "number", true);
  const rent_price = useInput("", "number", true);
  const maintenance_price = useInput("", "number", true);


  const tower = useSelect("", "select");
  // const tenant = useSelect("", "select");


  const validation = useCallback(() => {
    return piece_number.value && floor_number.value && rent_price.value && maintenance_price.value && tower.value?.value
  }, [
    piece_number.value,
    floor_number.value,
    rent_price.value,
    maintenance_price.value,
    tower.value?.value,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const data = {
      "piece_number": piece_number.value,
      "floor_number": floor_number.value,
      "rent_price": rent_price.value,
      "maintenance_price": maintenance_price.value,
      "tower": tower.value.value,
      // "user": tenant.value?.value || null,
    }
    try {
      const req = (data) => id ? API.updateApartment(data, id) : API.createApartment(data);
      await req(data);
      handleClose(true);
    } catch (error) {
      handleMessage(error);
    } finally {
      setSubmitted(false);
    }
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const item = await API.getOneApartment(id);
        piece_number.changeValue(item?.piece_number);
        floor_number.changeValue(item?.floor_number);
        rent_price.changeValue(item?.rent_price);
        maintenance_price.changeValue(item?.maintenance_price);
        tower.changeValue({ label: item?.tower?.name, value: item?.tower._id });
        setLoading(false);
      } catch (error) {
        handleMessage(error);
      }
    }
    id && getData();
    return () => {
      cancelRequestWithUrl("/apartments")
    }
  }, [id]);


  return (
    <form onSubmit={handleSubmit}>
      <>
        {loading ? <Spinner className="w-16 mx-40" /> : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              mandatory
              label={t("number_key")}
              {...piece_number.bind}
            />

            <Input
              mandatory
              name="floor_number"
              label={t("floor_number_key")}
              {...floor_number.bind}
            />
            <Input
              mandatory
              label={t("rent_price_key")}
              {...rent_price.bind}
            />
            <Input
              mandatory
              label={t("maintenance_price_key")}
              {...maintenance_price.bind}
            />
            <TowersSearch
              tower={tower}
            />
            {/* <UserSearch
              user={tenant}
              mandatory={false}
              roleFilter={"user"}

            /> */}
          </div>

        )}

        <div className='flex items-center justify-end gap-4 pt-4 mt-20 border-t'>
          <Button
            onClick={() => handleClose()}
            className="w-32 btn--secondary"
            type="button"
          >{t("cancel_key")}</Button>
          <Button
            type="submit"
            disabled={submitted || !validation()}
            onClick={handleSubmit}
            className="w-32 btn--primary"
          >
            {submitted ? (
              <>
                <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                {t("loading_key")}
              </>
            ) : (
              t("save_key")
            )}
          </Button>
        </div>
      </>
    </form>
  )
}
AddUpdateModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};