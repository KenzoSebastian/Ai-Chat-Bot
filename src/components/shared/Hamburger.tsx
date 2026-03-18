type HamburgerProps = {
  status: boolean;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Hamburger = ({ status, setStatus }: HamburgerProps) => {
  return (
    <div
      id="hamburger"
      className={`flex pl-5 flex-col justify-around p-2 gap-1.5 rounded-lg focus:outline-none z-50 group ${status ? "active" : ""}`}
      onClick={() => setStatus(!status)}
    >
      <span
        className={`w-6 h-0.5 bg-white transform transition-all group-[.active]:bg-white duration-500 ease-in-out origin-top-left group-[.active]:rotate-45`}
      ></span>
      <span
        className={`w-6 h-0.5 bg-white transform transition-all group-[.active]:bg-white duration-500 ease-in-out group-[.active]:opacity-0 group-[.active]:scale-0 opacity-100`}
      ></span>
      <span
        className={`w-6 h-0.5 bg-white transform transition-all group-[.active]:bg-white duration-500 ease-in-out origin-bottom-left group-[.active]:-rotate-45`}
      ></span>
    </div>
  );
}