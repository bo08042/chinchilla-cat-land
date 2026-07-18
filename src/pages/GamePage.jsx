import { useParams } from 'react-router-dom'
import GameShell from '../components/GameShell'
import NotFound from './NotFound'
import { gameRoutes } from '../games'
import { games } from '../data/games'

export default function GamePage() {
  const { gameId } = useParams()
  const route = gameRoutes[gameId]
  const meta = games.find((g) => g.id === gameId)

  if (!route || !meta || meta.status !== 'live') return <NotFound />

  return (
    <GameShell title={meta.title} emoji={meta.emoji} instructions={route.instructions}>
      {route.element}
    </GameShell>
  )
}
