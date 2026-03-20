Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 Plan: Create Skeleton Loading Component for SideBar

 Context

 The SideBar component currently shows a simple "Loading..." text while 
  chat histories are being fetched. This provides a poor user
 experience. We need to replace this with a skeleton loading UI that    
 mimics the structure of the loaded content, providing better visual    
 feedback during loading.

 Current State

 - File: Front-End/src/components/shared/SideBar.tsx
 - Loading state: Simple text "Loading..." that appears/disappears      
 based on isOpen state
 - Loaded content structure:
   a. "New Chat" button row (with FilePenLine icon + text)
   b. "Chat History" heading
   c. List of chat history items (dynamic array)

 Implementation Plan

 1. Create Generic Skeleton Component

 File: Front-End/src/components/ui/skeleton.tsx

 Create a reusable Skeleton component following the shadcn/ui pattern   
 used in the project:
 - Use class-variance-authority for variants (optional, but consistent  
 with project patterns)
 - Apply the animate-pulse class for the loading animation
 - Use a muted background color (bg-muted) for the skeleton blocks      
 - Export a Skeleton component with proper TypeScript typing

 2. Create SidebarSkeleton Component

 File: Front-End/src/components/shared/SidebarSkeleton.tsx

 Create a dedicated skeleton component that mirrors the SideBar layout: 
 - Match the same container structure and width transitions as the real 
  SideBar
 - Include skeleton elements for:
   - Hamburger menu icon placeholder (square)
   - "New Chat" row: icon placeholder (square) + text line (rectangle)  
   - "Chat History" heading: text line
   - Chat history list: Enough skeleton items to fill the full viewport 
  height (use flex layout with flex-1 and overflow-y-auto to match real 
  behavior)
 - Use the same isOpen prop to control width transitions
 - Apply proper margins, padding, and positioning to match the actual   
 SideBar
 - Vary skeleton widths slightly for realism (some shorter, some        
 longer)

 3. Update SideBar Component

 File: Front-End/src/components/shared/SideBar.tsx

 Replace the current conditional loading logic:
 - Import the new SidebarSkeleton component
 - Replace the simple "Loading..." div with <SidebarSkeleton
 isOpen={isOpen} />
 - Keep the existing data-loaded rendering logic unchanged

 Technical Details

 Skeleton component should:
 import { cn } from "@/lib/utils"

 function Skeleton({ className, ...props }:
 React.HTMLAttributes<HTMLDivElement>) {
   return (
     <div
       className={cn("animate-pulse rounded-md bg-muted", className)}   
       {...props}
     />
   )
 }

 SidebarSkeleton should replicate the SideBar's structure but with      
 Skeleton elements instead of real content, respecting the same
 Tailwind classes for layout and transitions. The chat list should be   
 long enough to demonstrate the scroll behavior.

 Verification Steps

 1. Start the frontend development server
 2. Navigate to the page with the SideBar
 3. Observe that while chat histories are loading, the skeleton UI      
 appears instead of "Loading..."
 4. Verify the skeleton matches the visual structure of the loaded      
 SideBar
 5. Test the sidebar open/close toggle to ensure the skeleton respects
 the width transitions
 6. Verify the animation runs smoothly and the list is scrollable when
 open

 Files to Modify

 - Create: Front-End/src/components/ui/skeleton.tsx
 - Create: Front-End/src/components/shared/SidebarSkeleton.tsx
 - Update: Front-End/src/components/shared/SideBar.tsx