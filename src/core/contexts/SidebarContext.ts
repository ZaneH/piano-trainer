import { createContext, useContext } from 'react'

export interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
})

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
