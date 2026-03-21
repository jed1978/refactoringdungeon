import { useState, useEffect } from 'react';

type Choice = {
  readonly label: string;
  readonly onSelect: () => void;
};

type Props = {
  readonly portrait: string;
  readonly title: string;
  readonly text: string;
  readonly choices: readonly Choice[];
  readonly onClose?: () => void;
};

const TYPEWRITER_SPEED = 25; // ms per character

export function DialogueBox({ portrait, title, text, choices, onClose }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, TYPEWRITER_SPEED);
    return () => clearInterval(interval);
  }, [text]);

  const skipToEnd = () => {
    setDisplayed(text);
    setDone(true);
  };

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-[20%] z-40 pointer-events-none">
      <div
        className="w-[90%] max-w-sm bg-gray-900/95 border-2 border-yellow-400 p-3 pointer-events-auto"
        style={{ boxShadow: '0 0 0 1px #000, 2px 2px 0 #000' }}
        onClick={!done ? skipToEnd : undefined}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{portrait}</span>
          <span
            className="text-yellow-400"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px' }}
          >
            {title}
          </span>
        </div>

        {/* Text area */}
        <div
          className="text-white min-h-[48px] mb-3 cursor-pointer"
          style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-line' }}
        >
          {displayed}
          {!done && <span className="animate-pulse">▋</span>}
        </div>

        {/* Choices (shown only when typewriter done) */}
        {done && (
          <div className="flex flex-col gap-1">
            {choices.map((choice, i) => (
              <button
                key={i}
                className="text-left text-white hover:text-yellow-300 hover:bg-yellow-400/10 px-2 py-1 border border-gray-600 hover:border-yellow-400 transition-colors"
                style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: '12px' }}
                onClick={choice.onSelect}
              >
                ▶ {choice.label}
              </button>
            ))}
            {onClose && choices.length === 0 && (
              <button
                className="text-center text-gray-400 hover:text-white border border-gray-600 py-1"
                style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: '12px' }}
                onClick={onClose}
              >
                關閉
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
