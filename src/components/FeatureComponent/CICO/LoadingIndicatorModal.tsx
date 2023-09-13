import React from "react";

export default function LoadingIndicatorModal({ text }: { text: string }) {
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
            {/* modal body */}
            <div className="p-6 space-y-6">
              <div>
                <h3>{text || "Loading..."}</h3>
              </div>
            </div>
            {/* modla foolter */}
          </div>
        </div>
      </div>
    </>
  );
}
