import { GamePhase } from '../types/game'

interface LoaderProps {
  phase: GamePhase
}

export function Loader({ phase }: LoaderProps) {
  const isLoaded = phase !== GamePhase.LOADING
  const isStarted = phase === GamePhase.PLAYING || phase === GamePhase.GAME_OVER

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center uppercase"
      style={{
        zIndex: 400,
        backgroundColor: '#e5e5e5',
        transition: '300ms ease-in-out',
        opacity: isStarted ? 0 : 1,
        visibility: isStarted ? 'hidden' : 'visible',
      }}
    >
      {!isLoaded && <div className="loader-spinner mb-[30px]" />}
      <p className="mb-[15px]">
        {isLoaded ? (
          <>
            Press <Kbd>ENTER</Kbd> to start
          </>
        ) : (
          'Loading, please wait...'
        )}
      </p>
      {isLoaded && (
        <ul className="mt-[25px]">
          <li className="mb-[15px]"><Kbd>&larr;</Kbd> - move left</li>
          <li className="mb-[15px]"><Kbd>&rarr;</Kbd> - move right</li>
          <li className="mb-[15px]"><Kbd>SPACEBAR</Kbd> - fire</li>
          <li className="mb-0"><Kbd>ENTER</Kbd> - start</li>
        </ul>
      )}
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <strong className="rounded-[3px] border border-black px-[10px] py-[3px]">
      {children}
    </strong>
  )
}
