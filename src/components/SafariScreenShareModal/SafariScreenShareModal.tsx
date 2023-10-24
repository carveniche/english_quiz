import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

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

export default function SafariScreenShareModal() {
  const { toggleScreenShare } = useVideoContext();
  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-center items-center">
            <p className="text-speedMathTextColor font-semibold text-lg text-center">
              Please Click on Screen Share and then click on Allow to Share
              Screen
            </p>
          </div>
          <div className="flex justify-around flex-row items-center mt-5">
            <Button
              onClick={() => toggleScreenShare("usergesture")}
              variant="contained"
              color="primary"
            >
              Share Screen
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
