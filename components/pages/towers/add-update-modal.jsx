import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { createOne, getOne, updateOne } from "helper/apis/towers";

// Custom
import { useHandleMessage, useInput } from "hooks"
import { Button, Spinner, Input } from "components/UI";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";


export default function AddUpdateModal({ fetchReport, handleClose, id }) {
  const { t } = useTranslation("common");

  const handleMessage = useHandleMessage();
  const [loading, setLoading] = useState(id);
  const [submitted, setSubmitted] = useState(false);

  const name = useInput("", "");
  const address = useInput("", "");



  const validation = useCallback(() => name.value && address.value, [address.value, name.value]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const data = {
      "name": name.value,
      "address": address.value
    }
    try {
      const req = (data) => id ? updateOne(data, id) : createOne(data);
      await req(data);
      fetchReport(1, 10);
      handleClose();
    } catch (error) {
      handleMessage(error?.response?.data?.message);
    } finally {
      setSubmitted(false);
    }
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const item = await getOne(id);
        name.changeValue(item?.name)
        address.changeValue(item?.address)
        setLoading(false);
      } catch (error) {
        handleMessage(error?.response?.data?.message);
      }
    }
    id && getData();
  }, [id]);


  return (
    <form onSubmit={handleSubmit}>
      <>
        {loading ? <Spinner className="w-16 mx-40" /> : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              mandatory
              label={t("name_key")}
              {...name.bind}
            />
            <Input
              mandatory
              label={t("address_key")}
              {...address.bind}
            />
          </div>

        )}

        <div className='flex items-center justify-end gap-4 pt-4 mt-20 border-t'>
          <Button
            onClick={handleClose}
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
  fetchReport: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};