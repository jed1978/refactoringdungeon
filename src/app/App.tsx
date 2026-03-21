import { useState } from 'react';
import { TitleScreen } from '../ui/TitleScreen';
import { GameCanvas } from '../ui/GameCanvas';
import { HUD } from '../ui/HUD';
import { BottomHUD } from '../ui/BottomHUD';

type Screen = 'title' | 'game';

export function App() {
  const [screen, setScreen] = useState<Screen>('title');

  if (screen === 'title') {
    return <TitleScreen onStart={() => setScreen('game')} />;
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-3xl aspect-[240/176]">
        <GameCanvas />
        <HUD />
        <BottomHUD />
      </div>
    </div>
  );
}
