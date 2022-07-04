import styled from 'styled-components'
import Keyboard from './components/Keyboard'
import { TrainerDisplay, TrainerPiano } from './components/Trainer'
import TrainerProvider from './components/TrainerProvider'

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

function App() {
  return (
    <TrainerProvider>
      <AppLayout>
        <TrainerPiano />
        <TrainerDisplay />
        <Keyboard />
      </AppLayout>
    </TrainerProvider>
  )
}

export default App
