import { createContext, useContext } from 'react'

export interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

// Create the context with default values
export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
})

// Custom hook to use the sidebar context
export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
