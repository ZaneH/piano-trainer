import { createContext, Dispatch, FC, SetStateAction, useState } from 'react'
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar'

type SidebarContextType = {
  children?: React.ReactNode

  isOpen?: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
}

export const SidebarContext = createContext({} as SidebarContextType)

const SidebarProvider: FC<SidebarContextType> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const context: SidebarContextType = {
    isOpen,
    setIsOpen,
  }

  return (
    <SidebarContext.Provider value={context}>
      {isOpen && <SettingsSidebar />}
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider
