import BegalileoLogo from "./NavbarIcons/beGalileoLogo";

export default function Header() {
  return (
    <>
      <div className="bg-header-black-top flex min-h-[40px] w-full justify-between ">
        <div className=" justify-center content-center p-4">
          <BegalileoLogo />
          <span className="text-BDBDBD p-4 mt-10">Coach: Ms.Styella</span>
        </div>
        <div className=" justify-center content-center p-4">
          <span className="text-BDBDBD p-4 mt-10">
            Class 2, Div A, Live class with Aashish
          </span>
        </div>
        <div className=" justify-center content-center items-center p-4">
          <BegalileoLogo />
          <span className="text-BDBDBD p-4 mt-10">Coach: Ms.Styella</span>
        </div>
      </div>
    </>
  );
}
