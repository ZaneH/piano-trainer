import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Keyboard from './components/Keyboard'
import KVProvider from './components/KVProvider/KVProvider'
import { Quiz } from './components/Quiz'
import ScreenManager from './components/ScreenManager/ScreenManager'
import SidebarProvider from './components/SidebarProvider/SidebarProvider'
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
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key, metaKey } = e
    let preventDefault = true

    if (key === 'q' && metaKey) {
      preventDefault = false
    }

    if (preventDefault) {
      e.preventDefault()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <KVProvider>
      <SidebarProvider>
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
                <Quiz />
              </QuizScreenLayout>
            }
          />
        </TrainerProvider>
      </SidebarProvider>
    </KVProvider>
  )
}

export default App
