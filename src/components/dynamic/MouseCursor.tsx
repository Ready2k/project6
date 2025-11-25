import { useEffect, useState } from 'react';

interface MouseCursorProps {
  targetElement?: string; // CSS selector for the target element
  action?: 'move' | 'click';
  visible: boolean;
}

function MouseCursor({ targetElement, action, visible }: MouseCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (!visible || !targetElement) {
      setPosition({ x: -100, y: -100 });
      return;
    }

    const element = document.querySelector(targetElement);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    // Animate cursor movement
    setPosition({ x: targetX, y: targetY });

    // If action is click, show click animation after movement
    if (action === 'click') {
      const clickTimer = setTimeout(() => {
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);
      }, 800);
      return () => clearTimeout(clickTimer);
    }
  }, [targetElement, action, visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-all duration-700 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Cursor */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={`transition-transform ${isClicking ? 'scale-90' : 'scale-100'}`}
      >
        <path
          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
          fill="#FF6B6B"
          stroke="#000"
          strokeWidth="1"
        />
      </svg>
      
      {/* Click ripple effect */}
      {isClicking && (
        <div className="absolute inset-0 -m-4">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-400 animate-ping" />
        </div>
      )}
    </div>
  );
}

export default MouseCursor;
