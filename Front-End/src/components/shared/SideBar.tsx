import { deleteChatHistory, getAllChatHistory } from "@/services/ChatHistoryServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FilePenLine, Trash } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Hamburger } from "./Hamburger";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { queryClient } from "@/lib/query-client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: chatHistories, isLoading: isLoadingChatHistories } = useQuery({
    queryKey: ["chatHistories"],
    queryFn: getAllChatHistory,
  });

  const { mutate: deleteChat } = useMutation({
    mutationFn: deleteChatHistory,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["chatHistories"] });
    },
  });

  const handleNewChat = () => {
    setSearchParams({});
  };

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
          <div
            className="pl-5 py-3 mt-5 w-full flex items-center cursor-pointer hover:bg-muted transition-all duration-300 ease-in-out"
            onClick={handleNewChat}
          >
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
                <li
                  key={item.id}
                  className={`py-3 group text-nowrap cursor-pointer block overflow-hidden transition-all relative duration-300 ease-in-out ${isOpen ? "w-full px-5" : "w-0 p-0"} ${item.id === searchParams.get("id") ? "bg-popover text-white" : "hover:bg-muted"}`}
                  onClick={() => setSearchParams({ id: item.id })}
                >
                  {item.title}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Trash className="absolute right-3 top-1/2 -translate-y-1/2 w-5 hover:scale-110 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>yang bener bang, mau dihapus nih chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                          kalo dihapus gak bakal ada lagi, siapa tau chat ini akan penting buat nanti, kamu pikirkan baik baik ya
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(item.id);
                          }}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
