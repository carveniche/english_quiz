import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

import UploadResourceFileTextBigIcon from "./UploadResourceIcons/UploadResourceFileTextBigIcon";
import { removeUploadResources } from "../../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { toggleUploadResourceDeleteModal } from "../../../redux/features/liveClassDetails";

export default function UploadResourceDeleteModal({
  uploadItemsDetails,
  handleUpdateUploadResourceApi,
}: {
  uploadItemsDetails: {};
  handleUpdateUploadResourceApi: Function;
}) {
  const dispatch = useDispatch();
  const { uploadResourceDeleteModal, liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const handleCloseUploadResource = () => {
    dispatch(toggleUploadResourceDeleteModal(false));
  };

  const handleCallUploadDeleteApi = async (e: any) => {
    e.preventDefault();

    let uploadFileDeleteResult = await removeUploadResources(
      liveClassId,
      uploadItemsDetails?.id
    );

    if (uploadFileDeleteResult.data.status) {
      handleUpdateUploadResourceApi();
      handleCloseUploadResource();
    }
  };

  return (
    <div>
      <Modal
        open={uploadResourceDeleteModal}
        // onClose={handleCloseUploadResource}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-center items-center mb-4">
            <p className="font-semibold leading-4 tracking-normal text-center text-[#292929]">
              Are your sure you want to delete the file?
            </p>
          </div>
          <div className="flex flex-col justify-center items-center w-full h-full border border-[#ECEBEB] rounded p-5">
            <div className="flex w-[60px] h-[60px] justify-center items-center border-[#ECEBEB] bg-[#ECEBEB] rounded">
              <UploadResourceFileTextBigIcon />
            </div>
            <div className="flex justify-center items-center mt-5">
              <p className="font-normal leading-4 tracking-normal text-center text-[#292929]">
                {uploadItemsDetails?.name || ""}
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full h-[90px] mt-5">
            <div className="flex w-full h-full justify-center mt-3">
              <button
                onClick={handleCallUploadDeleteApi}
                className="flex justify-center items-center w-[104px] h-[26px] p-4 8 4 8 bg-[#F24A4A] rounded-full gap-4 "
              >
                <p className="font-semibold leading-4 tracking-normal text-[#F2F2F2] text-center">
                  Delete file
                </p>
              </button>
            </div>

            <div className="flex w-full h-full justify-center">
              <button onClick={handleCloseUploadResource}>
                <p className="font-semibold text-base leading-6 text-[#292929]">
                  Cancel
                </p>
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
