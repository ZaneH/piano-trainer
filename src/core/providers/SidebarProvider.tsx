import { FC, ReactNode, useState } from 'react'
import SettingsSidebar from '../../components/SettingsSidebar/SettingsSidebar'
import { SidebarContext, useSidebar } from '../contexts/SidebarContext'

interface SidebarProviderProps {
  children: ReactNode
}

const SidebarWrapper: FC<SidebarProviderProps> = ({ children }) => {
  const { isOpen } = useSidebar()

  return (
    <>
      {isOpen && <SettingsSidebar />}
      {children}
    </>
  )
}

const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen: (open) => setIsOpen(open),
      }}
    >
      <SidebarWrapper>{children}</SidebarWrapper>
    </SidebarContext.Provider>
  )
}

export default SidebarProvider
