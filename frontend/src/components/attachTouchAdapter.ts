// Keep the game logic (canvas coordinate system / key input system) untouched.
// Separate only the canvas touch → (keyboard/mouse) event emulator.

// Option type (helper for browsers requiring passive setting)
type NonPassiveOpts = boolean | (AddEventListenerOptions & { passive?: boolean });

// Emulates touch input on a canvas as keyboard/mouse events.
// Left half: Player1 (W/S)
// Right half: Player2 (ArrowUp/ArrowDown)
// On touch start: emulate menu click
// On touch move: emulate menu hover (mousemove)
// Returns a cleanup function (removes listeners and releases key states)
export function attachTouchAdapter(canvas: HTMLCanvasElement): () => void {
 // Helper to dispatch keydown/keyup events
  const fireKey = (type: 'keydown' | 'keyup', key: string) => {
    const ev = new KeyboardEvent(type, { key, bubbles: true, cancelable: true });
    document.dispatchEvent(ev);
  };

  let activeLeft: 'up' | 'down' | null = null;
  let activeRight: 'up' | 'down' | null = null;

  const handleTouchMoveOrStart = (e: TouchEvent) => {
    // Prevent scrolling / double-tap zoom
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0] || e.changedTouches[0];
    if (!t) return;

    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    const half = rect.width / 2;
    const verticalCenter = rect.height / 2;

     // Emulate mousemove to improve menu hover/click response
    const moveEv = new MouseEvent('mousemove', {
      clientX: t.clientX,
      clientY: t.clientY,
      bubbles: true,
    });
    canvas.dispatchEvent(moveEv);

    // Left half (W/S)
    if (x < half) {
      const dir: 'up' | 'down' | null = y < verticalCenter ? 'up' : 'down';
      if (activeLeft !== dir) {
        if (activeLeft === 'up') fireKey('keyup', 'w');
        if (activeLeft === 'down') fireKey('keyup', 's');
        if (dir === 'up') fireKey('keydown', 'w');
        if (dir === 'down') fireKey('keydown', 's');
        activeLeft = dir;
      }
    } else {
     // Right half (Arrow keys)
      const dir: 'up' | 'down' | null = y < verticalCenter ? 'up' : 'down';
      if (activeRight !== dir) {
        if (activeRight === 'up') fireKey('keyup', 'ArrowUp');
        if (activeRight === 'down') fireKey('keyup', 'ArrowDown');
        if (dir === 'up') fireKey('keydown', 'ArrowUp');
        if (dir === 'down') fireKey('keydown', 'ArrowDown');
        activeRight = dir;
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    // Emulate click for menu buttons (once at touch start)
    const t = e.touches[0];
    if (t) {
      const clickEv = new MouseEvent('click', {
        clientX: t.clientX,
        clientY: t.clientY,
        bubbles: true,
      });
      canvas.dispatchEvent(clickEv);
    }
    handleTouchMoveOrStart(e);
  };

  const handleTouchEndOrCancel = (e?: TouchEvent) => {
    if (e) e.preventDefault();

    // Release all keys (safety)
    if (activeLeft === 'up') fireKey('keyup', 'w');
    if (activeLeft === 'down') fireKey('keyup', 's');
    if (activeRight === 'up') fireKey('keyup', 'ArrowUp');
    if (activeRight === 'down') fireKey('keyup', 'ArrowDown');
    activeLeft = null;
    activeRight = null;
  };

  // Register listeners (passive:false — prevent default gestures/scrolling)
  const opts: NonPassiveOpts = { passive: false };
  canvas.addEventListener('touchstart', handleTouchStart, opts);
  canvas.addEventListener('touchmove', handleTouchMoveOrStart, opts);
  canvas.addEventListener('touchend', handleTouchEndOrCancel, opts);
  canvas.addEventListener('touchcancel', handleTouchEndOrCancel, opts);

   // Return cleanup
  return () => {
    canvas.removeEventListener('touchstart', handleTouchStart as any);
    canvas.removeEventListener('touchmove', handleTouchMoveOrStart as any);
    canvas.removeEventListener('touchend', handleTouchEndOrCancel as any);
    canvas.removeEventListener('touchcancel', handleTouchEndOrCancel as any);
    // Ensure any remaining key states are released
    handleTouchEndOrCancel();
  };
}
