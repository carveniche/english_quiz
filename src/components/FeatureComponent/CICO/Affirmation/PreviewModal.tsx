import React from "react";

export default function PreviewModal({
  img,
  onClose,
  onConfirm,
  badges,
}: {
  img: string;
  onClose: Function;
  onConfirm: Function;
  badges: string;
}) {
  return (
    <>
      {/* modal */}
      <div
        className="fixed top-0 left-0 right-0 z-999 flex w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black opacity-50"
        style={{ zIndex: 9999 }}
      ></div>
      <div
        id="defaultModal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-999 flex w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        style={{ zIndex: 99999999999 }}
      >
        <div className="relative w-full max-w-2xl max-h-full m-auto">
          {/* modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* modal header */}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"></div>
            {/* modal body */}
            <div className="p-12 space-y-6">
              <div
                className="relative"
                style={{ width: "fit-content", margin: "auto" }}
                id="badgesWithImages"
              >
                <div style={{ width: 230, height: 155 }}>
                  <img src={img} style={{ maxWidth: 250 }} alt="noimage" />
                </div>
                <div
                  style={{
                    width: "fit-content",
                    position: "absolute",
                    right: "-0%",
                    bottom: "-0px",
                    transform: "rotate(-30deg)",
                  }}
                >
                  <img
                    style={{ maxWidth: 100 }}
                    alt="noimage"
                    crossOrigin=""
                    src={badges + "?dummy=1234"}
                  />
                </div>
              </div>
            </div>
            {/* modla foolter */}
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={onConfirm}
              >
                Confirm
              </button>
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
