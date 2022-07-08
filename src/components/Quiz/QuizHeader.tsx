import styled from 'styled-components'
import ArrowBack from 'remixicon-react/ArrowLeftFillIcon'
import SettingsIcon from 'remixicon-react/Settings2FillIcon'
import { useContext } from 'react'
import { TrainerContext } from '../TrainerProvider'
import { SidebarContext } from '../SidebarProvider'

const HeaderContainer = styled.div`
  width: 100%;
  height: 96px;
  background-color: #161616;
  text-align: center;
  display: flex;
  flex-direction: row;
  color: white;
  justify-content: space-between;
  align-items: center;
`

const BackIconContainer = styled.div`
  padding: 8px;
  width: 2em;
  height: 2em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  margin-left: 32px;
`

const SettingsIconContainer = styled.div`
  padding: 8px;
  width: 2em;
  height: 2em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  margin-right: 32px;
`

const QuizHeader = () => {
  const { setCurrentScreen } = useContext(TrainerContext)
  const { setIsOpen } = useContext(SidebarContext)

  return (
    <HeaderContainer>
      <BackIconContainer
        title='Back to practice mode'
        onClick={() => setCurrentScreen?.('practice')}
      >
        <ArrowBack color='#1f1f20' />
      </BackIconContainer>
      <h1>Quiz Mode</h1>
      <SettingsIconContainer onClick={() => setIsOpen?.(true)}>
        <SettingsIcon color='#1f1f20' />
      </SettingsIconContainer>
    </HeaderContainer>
  )
}

export default QuizHeader
