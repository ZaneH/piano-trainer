import { useContext } from 'react'
import { TrainerContext } from '../TrainerProvider'

const TrainerDisplay = () => {
  const { scale } = useContext(TrainerContext)
  return <h1>{scale?.name}</h1>
}

export default TrainerDisplay
