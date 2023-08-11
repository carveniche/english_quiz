import Navbar from "./Navbar";

import { useState } from "react";
import ActiveTabMenu from "./ActiveTabMenu";
import NestedMenu from "../MenuBar/NestedMenu";

export default function Header2() {
  return (
    <>
      <div className="bg-header-black flex min-h-[40px] w-full">
        <div className="relative z-[1]">
          <NestedMenu />

          {false && (
            <div className="absolute z-50 left-0 mt-2 bg-header-black border-black-300 rounded-md p-2 ">
              <div className="min-w-[200px] flex justify-center content-center flex-col">
                <Navbar />
              </div>
            </div>
          )}
        </div>
        <ActiveTabMenu />
      </div>
    </>
  );
}
