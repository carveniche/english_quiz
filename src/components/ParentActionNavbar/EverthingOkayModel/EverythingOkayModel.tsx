import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import Slider from "@mui/material/Slider";
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

interface EverythingOkayModelProps {
  handleClose: () => void;
}

export default function EverythingOkayModel({
  handleClose,
}: EverythingOkayModelProps) {
  const [ratingUsModelShow, setRatingUsModelShow] = useState(false);
  const [selectedSliderValue, setSelectedSliderValue] = useState(0);
  const [feedbackRatings, setFeedbackRatings] = useState({
    how_happy: 0,
    improvement: 0,
    positive_feeling: 0,
  });

  const rateUs = () => {
    setRatingUsModelShow(true);
    console.log("rate us");
  };

  const leaveSession = () => {};

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSliderValue(Number(event.target.value));
    const updatedFeedbackRatings = { ...feedbackRatings };

    updatedFeedbackRatings[event.target.name as keyof typeof feedbackRatings] =
      Number(event.target.value);
    setFeedbackRatings(updatedFeedbackRatings);
  };

  console.log("feedbackRatings", feedbackRatings);

  return (
    <div>
      {!ratingUsModelShow ? (
        <div>
          <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="flex justify-center items-center">
                <p className="text-speedMathTextColor font-semibold text-lg text-center">
                  Thank you for your time , we appreciate your concern &
                  involvement with your child’s learning. Please help us rate
                </p>
              </div>
              <div className="flex justify-around flex-row items-center mt-5">
                <Button onClick={rateUs} variant="contained" color="primary">
                  Rate Us
                </Button>
                <Button
                  onClick={leaveSession}
                  variant="contained"
                  color="primary"
                >
                  Will Disconnect & Do later
                </Button>
              </div>
            </Box>
          </Modal>
        </div>
      ) : (
        <div>
          <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="flex flex-col justify-center items-center">
                <div className="flex justify-center items-center ">
                  <p className="text-speedMathTextColor font-semibold text-lg text-center">
                    {selectedSliderValue || ""}
                  </p>
                </div>

                <div>
                  <p className="text-speedMathTextColor font-semibold text-lg text-center">
                    How was your Experience?
                  </p>

                  <input
                    type="range"
                    defaultValue={0}
                    min={0}
                    max={5}
                    step={1}
                    onChange={handleChange}
                    className="slider-thumb:w-6 slider-thumb:h-6 slider-thumb:bg-blue-500 slider-thumb:rounded-full slider-thumb:shadow-md
                    slider-track:h-2.5 slider-track:bg-gray-400 slider-track:rounded-full
                     w-full mt-1 appearance-auto"
                    name="how_happy"
                  />
                </div>
                <div>
                  <p className="text-speedMathTextColor font-semibold text-lg text-center">
                    Would you rate us to your friends?
                  </p>
                  <input
                    type="range"
                    defaultValue={0}
                    min={0}
                    max={5}
                    step={1}
                    onChange={handleChange}
                    className="slider-thumb:w-6 slider-thumb:h-6 slider-thumb:bg-blue-500 slider-thumb:rounded-full slider-thumb:shadow-md
                    slider-track:h-2.5 slider-track:bg-gray-400 slider-track:rounded-full
                    w-full mt-1 appearance-auto"
                    name="improvement"
                  />
                </div>
                <div>
                  <p className="text-speedMathTextColor font-semibold text-lg text-center">
                    Would you like to rate us on playstore?
                  </p>
                  <input
                    type="range"
                    defaultValue={0}
                    min={0}
                    max={5}
                    step={1}
                    onChange={handleChange}
                    className="slider-thumb:w-6 slider-thumb:h-6 slider-thumb:bg-blue-500 slider-thumb:rounded-full slider-thumb:shadow-md
                    slider-track:h-2.5 slider-track:bg-gray-400 slider-track:rounded-full
                     w-full mt-1 appearance-auto"
                    name="positive_feeling"
                  />
                </div>
              </div>

              {/* <div className="flex justify-around flex-row items-center mt-5">
              <Button onClick={rateUs} variant="contained" color="primary">
                Rate Us
              </Button>
              <Button
                onClick={leaveSession}
                variant="contained"
                color="primary"
              >
                Will Disconnect & Do later
              </Button>
            </div> */}
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
}
