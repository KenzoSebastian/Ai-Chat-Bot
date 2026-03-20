import { getAllChatHistory } from "@/services/getAllChatHistory";
import { useQuery } from "@tanstack/react-query";
import { FilePenLine } from "lucide-react";
import { Hamburger } from "./Hamburger";
import { SidebarSkeleton } from "./SidebarSkeleton";

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const paramsUrl = new URL(window.location.href).href.split("/").slice(-1)[0];

  const { data: chatHistories, isLoading: isLoadingChatHistories } = useQuery({
    queryKey: ["chatHistories"],
    queryFn: getAllChatHistory,
  });

  return (
    <div
      className={`bg-secondary transition-all duration-300 ease-in-out pt-7 flex flex-col sticky top-0 h-screen ${
        isOpen ? "w-64" : "w-17 overflow-hidden"
      }`}
    >
      <Hamburger status={isOpen} setStatus={setIsOpen} />
      {isLoadingChatHistories ? (
        <SidebarSkeleton isOpen={isOpen} />
      ) : (
        <div>
          <div className="pl-5 py-3 mt-5 w-full flex items-center cursor-pointer hover:bg-muted transition-all duration-300 ease-in-out">
            <FilePenLine className="mr-2" />
            <p
              className={`font-bold text-nowrap inline-block overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "w-full" : "w-0"}`}
            >
              New Chat
            </p>
          </div>
          <ul className={`mt-10 flex-1 overflow-y-auto transition-opacity duration-300`}>
            <p
              className={`font-bold text-nowrap inline-block overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "w-full pl-5" : "w-0 pl-0"}`}
            >
              Chat History
            </p>
            {Array.isArray(chatHistories) &&
              chatHistories.map((item) => (
                <a href={`${item.id}`} key={item.id}>
                  <li
                    className={`py-3 text-nowrap cursor-pointer block overflow-hidden transition-all  duration-300 ease-in-out ${isOpen ? "w-full px-5" : "w-0 p-0"} ${item.id === paramsUrl ? "bg-popover text-white" : "hover:bg-muted"}`}
                  >
                    {item.title}
                  </li>
                </a>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
