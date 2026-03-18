import { Hamburger } from "./Hamburger";

const dummyHistory = [
  {
    id: "1",
    title: "History 1",
  },
  {
    id: "2",
    title: "History 2",
  },
  {
    id: "3",
    title: "History 3",
  },
  {
    id: "4",
    title: "History 4",
  },
  {
    id: "5",
    title: "History 5",
  },
];

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const paramsUrl = new URL(window.location.href).href.split("/").slice(-1)[0];

  return (
    <div
      className={`bg-secondary transition-all duration-300 ease-in-out pt-4 flex flex-col sticky top-0 h-screen ${
        isOpen ? "w-64" : "w-18 overflow-hidden"
      }`}
    >
      <Hamburger status={isOpen} setStatus={setIsOpen} />

      <ul className={`mt-10 flex-1 overflow-y-auto transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        <p className={`font-bold pl-5 text-nowrap ${isOpen ? "block" : "hidden"}`}>Chat History</p>
        {isOpen &&
          dummyHistory.map((item) => (
            <a href={`${item.id}`}>
              <li
                key={item.id}
                className={`py-3 px-5 text-nowrap cursor-pointer ${item.id === paramsUrl ? "bg-popover text-white" : "hover:bg-muted"}`}
              >
                {item.title}
              </li>
            </a>
          ))}
      </ul>
    </div>
  );
};
