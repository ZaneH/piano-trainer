import styled from 'styled-components'
import Keyboard from './components/Keyboard'
import { Quiz, QuizHeader } from './components/Quiz'
import ScreenManager from './components/ScreenManager/ScreenManager'
import { TrainerDisplay, TrainerPiano } from './components/Trainer'
import TrainerProvider from './components/TrainerProvider'

const PracticeScreenLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const QuizScreenLayout = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

function App() {
  return (
    <TrainerProvider>
      <ScreenManager
        practice={
          <PracticeScreenLayout>
            <TrainerPiano />
            <TrainerDisplay />
            <Keyboard />
          </PracticeScreenLayout>
        }
        quiz={
          <QuizScreenLayout>
            <QuizHeader />
            <Quiz />
          </QuizScreenLayout>
        }
      />
    </TrainerProvider>
  )
}

export default App
