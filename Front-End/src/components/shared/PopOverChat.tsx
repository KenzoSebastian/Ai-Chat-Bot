import { queryClient } from "@/lib/query-client";
import { deleteChatHistory, updateChatHistory } from "@/services/ChatHistoryServices";
import { useMutation } from "@tanstack/react-query";
import { EllipsisVertical, Pen, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const PopOverChat = ({ id }: { id: string }) => {
  const [openPopOver, setOpenPopOver] = useState<boolean>(false);
  const [updateAlert, setUpdateAlert] = useState<boolean>(false);
  const ellipsRef = useRef<SVGSVGElement | null>(null);
  const inputUpdateRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (openPopOver) {
      ellipsRef.current?.classList.remove("opacity-0");
      // inputUpdateRef.current?.focus();
    } else {
      ellipsRef.current?.classList.add("opacity-0");
      // inputUpdateRef.current?.blur();
    }
  }, [openPopOver]);

  const { mutate: updateChat } = useMutation({
    mutationFn: updateChatHistory,
    onSuccess: (res) => {
      toast.success(res.message);
      setUpdateAlert(false);
      setOpenPopOver(false);
      queryClient.invalidateQueries({ queryKey: ["chatHistories"] });
    },
  });

  const { mutate: deleteChat } = useMutation({
    mutationFn: deleteChatHistory,
    onSuccess: (res) => {
      toast.success(res.message);
      setOpenPopOver(false);
      queryClient.invalidateQueries({ queryKey: ["chatHistories"] });
    },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      updateChat({ id, title: inputUpdateRef.current!.value });
    }
  };

  return (
    <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
      <PopoverTrigger asChild>
        <EllipsisVertical
          ref={ellipsRef}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 hover:scale-110 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100"
        />
      </PopoverTrigger>
      <PopoverContent className="w-80 translate-x-3" align="start" sideOffset={-40} alignOffset={70}>
        {/* Update chat */}
        <AlertDialog open={updateAlert} onOpenChange={setUpdateAlert}>
          <AlertDialogTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Pen className="w-5" />
              <p className="text-sm">update Chat</p>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mau ganti apa bang judul chat ini?</AlertDialogTitle>
              <AlertDialogDescription className="w-full">
                <Input
                  ref={inputUpdateRef}
                  placeholder="Masukan judul baru"
                  className="my-5 focus-visible:ring-2 focus-visible:ring-ring"
                  autoFocus
                  onKeyDown={handleKeyPress}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={async (e) => {
                  if (inputUpdateRef.current?.value === "") {
                    toast.error("judul gak boleh kosong bang");
                    e.preventDefault();
                    return;
                  }
                  updateChat({ id, title: inputUpdateRef.current!.value });
                }}
              >
                Update
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* delete chat */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Trash className="w-5" color="#fb2c36" />
              <p className="text-sm text-red-500">Hapus Chat</p>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>yang bener bang, mau dihapus nih chat?</AlertDialogTitle>
              <AlertDialogDescription>
                kalo dihapus gak bakal ada lagi, siapa tau chat ini akan penting buat nanti, kamu pikirkan
                baik baik ya
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteChat(id);
                }}
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PopoverContent>
    </Popover>
  );
};
