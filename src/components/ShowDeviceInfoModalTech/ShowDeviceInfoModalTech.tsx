import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { openCloseShowDeviceInfoModalTech } from "../../redux/features/liveClassDetails";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function ShowDeviceInfoModalTech() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<undefined | {}[]>(undefined);

  const { participantDeviceInformation } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const filterDeviceDataForTech = () => {
    let data = participantDeviceInformation || [];
    let finalObj = [];
    for (let i = 0; i < data.length; i = i + 2) {
      let obj = { ...data[i], ...data[i + 1] };

      let finalObject = Object.keys(obj)
        .filter((k) => (obj[k] != "" ? 1 : 0))
        .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});

      finalObj.push(finalObject);
    }

    setData(finalObj);
  };

  useEffect(() => {
    filterDeviceDataForTech();
  }, []);

  const handleClose = () => {
    setOpen(false);
    dispatch(openCloseShowDeviceInfoModalTech(false));
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <table className="border border-black-100 p-1">
              <tr className="border border-black-100 p-1">
                <th className="border border-black-100 p-1">Name</th>
                <th className="border border-black-100 p-1">Browser</th>
                <th className="border border-black-100 p-1">Version</th>
                <th className="border border-black-100 p-1">Plateform</th>
                <th className="border border-black-100 p-1">OS</th>
                <th className="border border-black-100 p-1">Device</th>
              </tr>
              {data?.map((val, key) => {
                return (
                  <tr className="border border-black-100 p-1" key={key}>
                    <td className="border border-black-100 p-1">{val?.name}</td>
                    <td className="border border-black-100 p-1">
                      {val?.browser}
                    </td>
                    <td className="border border-black-100 p-1">
                      {val?.version}
                    </td>
                    <th className="border border-black-100 p-1">
                      {val?.platform}
                    </th>
                    <th className="border border-black-100 p-1">{val?.os}</th>
                    <th className="border border-black-100 p-1">
                      {val?.desktop
                        ? "Desktop"
                        : val?.android
                        ? "Android"
                        : val?.ios
                        ? "IOS"
                        : val?.tablet
                        ? "Tablet"
                        : ""}
                    </th>
                  </tr>
                );
              })}
            </table>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
