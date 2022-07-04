import Keyboard from './components/Keyboard'
import { TrainerDisplay, TrainerPiano } from './components/Trainer'
import TrainerProvider from './components/TrainerProvider'

function App() {
  return (
    <div className='App'>
      <TrainerProvider>
        <TrainerPiano />
        <TrainerDisplay />
        <Keyboard />
      </TrainerProvider>
    </div>
  )
}

export default App
