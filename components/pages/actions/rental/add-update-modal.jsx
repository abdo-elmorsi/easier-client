import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { createOne } from "helper/apis/actions/rental";

// Custom
import { useHandleMessage, useInput, useSelect } from "hooks"
import { Button, Spinner, Input, DateInput } from "components/UI";
import { useTranslation } from "react-i18next";
import { isSuperAdmin } from "utils/utils";
import { PieceSearch, TowersSearch, UserSearch } from "components/global";
import moment from "moment";


export default function AddUpdateModal({ fetchReport, handleClose, session }) {
  const { t } = useTranslation("common");
  const is_super_admin = isSuperAdmin(session);

  const handleMessage = useHandleMessage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const user_id = useSelect("", "select");
  const tower_id = useSelect("", "select");
  const piece_id = useSelect("", "select");
  const rent_price = useInput("", "number", true);
  const rented_at = useInput("", "");



  const validation = useCallback(() => {
    if (user_id?.value?.value && tower_id?.value?.value && piece_id?.value?.value && rent_price.value && rented_at.value) {
      return true;
    }
  }, [
    user_id?.value?.value,
    tower_id?.value?.value,
    piece_id?.value?.value,
    rent_price.value,
    rented_at.value
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const data = {
      user_id: user_id?.value?.value,
      tower_id: tower_id?.value?.value,
      piece_id: piece_id?.value?.value,
      rent_price: rent_price?.value,
      rented_at: moment(rented_at?.value).format('YYYY-MM-DD')
    }
    try {
      const req = (data) => createOne(data);
      await req(data);
      fetchReport(1, 10);
      handleClose();
    } catch (error) {
      handleMessage(error);
    } finally {
      setSubmitted(false);
    }
  }

  // useEffect(() => {
  //   const getData = async () => {
  //     setLoading(true);
  //     try {
  //       const item = await getOne(id);
  //       item?.user_id && user_id.changeValue({ label: item?.user_id, value: item?.user_id })
  //       item?.tower_id && tower_id.changeValue({ label: item?.tower_id, value: item?.tower_id })
  //       item?.piece_id && piece_id.changeValue({ label: item?.piece_id, value: item?.piece_id })
  //       item?.rent_price && rent_price.changeValue(item?.rent_price)
  //       item?.rented_at && rented_at.changeValue(item?.rented_at)
  //       setLoading(false);
  //     } catch (error) {
  //       handleMessage(error);
  //     }
  //   }
  //   id && getData();

  // }, [id]);


  return (
    <form onSubmit={handleSubmit}>
      <>
        {loading ? <Spinner className="w-16 mx-40" /> : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


            <TowersSearch
              label={t("tower_key")}
              tower={tower_id}
            />

            <PieceSearch
              tower_id={tower_id.value?.value}
              isDisabled={!tower_id.value?.value}
              isOptionDisabled={(option) => console.log(option)}
              // label={t("tower_key")}
              piece={piece_id}
            />




            <UserSearch
              label={t("tenant_key")}
              roleFilter={"user"}
              user={user_id}
            />


            <Input
              mandatory
              label={t("rent_price_key")}
              {...rent_price.bind}
            />
            <DateInput
              mandatory
              label={t("rented_at_key")}
              value={rented_at.value}
              onChange={(value) => rented_at.changeValue(value)}
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
};