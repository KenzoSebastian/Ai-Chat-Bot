import { Skeleton } from "@/components/ui/skeleton"

interface SidebarSkeletonProps {
  isOpen: boolean
}

export function SidebarSkeleton({ isOpen }: SidebarSkeletonProps) {
  return (
    <div
      className={`bg-secondary transition-all duration-300 ease-in-out pt-7 flex flex-col sticky top-0 h-screen ${
        isOpen ? "w-64" : "w-17 overflow-hidden"
      }`}
    >
      {/* Hamburger placeholder */}
      <div className="px-5 py-2">
        <Skeleton className="w-5 h-5" />
      </div>

      {/* New Chat row */}
      <div className="pl-5 py-3 mt-5 w-full flex items-center gap-2">
        <Skeleton className="w-5 h-5 shrink-0" />
        <Skeleton className={`h-4 ${isOpen ? "w-24" : "w-0"}`} />
      </div>

      {/* Chat History heading */}
      <div className="mt-10 flex-1 overflow-y-auto">
        <Skeleton className={`h-4 mb-4 ${isOpen ? "w-32 pl-5" : "w-0 pl-0"}`} />

        {/* Chat history list items */}
        <div className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className={`h-8 ${isOpen ? "w-3/4 px-5" : "w-0 p-0"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
