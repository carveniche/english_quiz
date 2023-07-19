import ActiveTabMenu from "./ActiveTabMenu";
import Navbar from "./Navbar";

export default function Header2() {
  return (
    <div className="bg-header-black flex min-h-[40px] w-full">
        <Navbar />
        <div><ActiveTabMenu /></div>
    </div>
  )
}
