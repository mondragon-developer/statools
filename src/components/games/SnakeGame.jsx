import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { announcePolite } from '../../utils/announce';

// The canvas keeps a ~1200px drawing width and is scaled to fit its container,
// so zooming means fewer, larger cells rather than a bigger canvas.
const ZOOM_LEVELS = [
  { label: 'Small', cols: 80, rows: 30, cell: 15 },
  { label: 'Medium', cols: 60, rows: 22, cell: 20 },
  { label: 'Large', cols: 48, rows: 18, cell: 25 },
  { label: 'Extra large', cols: 40, rows: 15, cell: 30 },
];
const DEFAULT_ZOOM = 2;
const ZOOM_STORAGE_KEY = 'snake-zoom';
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_GAME_SPEED = 150;

const MATH_SYMBOLS = ['π', 'Σ', '∫', '∞', '√', 'α', 'β', 'γ', 'δ', 'θ', 'λ', 'μ', 'σ', '∂', '∇', '≈', '≠', '≤', '≥', '±', '×', '÷', '∈', '∉', '⊂', '⊃', '∪', '∩'];

const SYMBOL_NAMES = {
  'π': 'Pi',
  'Σ': 'Summation',
  '∫': 'Integral',
  '∞': 'Infinity',
  '√': 'Square Root',
  'α': 'Alpha',
  'β': 'Beta',
  'γ': 'Gamma',
  'δ': 'Delta',
  'θ': 'Theta',
  'λ': 'Lambda',
  'μ': 'Mu (Mean)',
  'σ': 'Sigma (Std Dev)',
  '∂': 'Partial Derivative',
  '∇': 'Nabla (Del)',
  '≈': 'Approximately',
  '≠': 'Not Equal',
  '≤': 'Less or Equal',
  '≥': 'Greater or Equal',
  '±': 'Plus-Minus',
  '×': 'Multiplication',
  '÷': 'Division',
  '∈': 'Element Of',
  '∉': 'Not Element Of',
  '⊂': 'Subset Of',
  '⊃': 'Superset Of',
  '∪': 'Union',
  '∩': 'Intersection'
};

const MIN_DELAY = 50;
const MAX_DELAY = 300;

function readStoredZoom() {
  try {
    const stored = Number(localStorage.getItem(ZOOM_STORAGE_KEY));
    return Number.isInteger(stored) && stored >= 0 && stored < ZOOM_LEVELS.length ? stored : DEFAULT_ZOOM;
  } catch {
    return DEFAULT_ZOOM;
  }
}

function initialSnake(grid) {
  return [{ x: Math.floor(grid.cols / 2), y: Math.floor(grid.rows / 2) }];
}

function randomFood(grid, currentSnake) {
  let newFood;
  let attempts = 0;
  do {
    newFood = {
      x: Math.floor(Math.random() * grid.cols),
      y: Math.floor(Math.random() * grid.rows),
      symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)]
    };
    attempts++;
  } while (
    attempts < 100 &&
    currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
  );
  return newFood;
}

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [zoomIndex, setZoomIndex] = useState(readStoredZoom);
  const grid = ZOOM_LEVELS[zoomIndex];
  const [snake, setSnake] = useState(() => initialSnake(grid));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(() => ({ ...randomFood(grid, initialSnake(grid)), symbol: 'π' }));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mondragronProgress, setMondragronProgress] = useState('');
  const [gameSpeed, setGameSpeed] = useState(INITIAL_GAME_SPEED);
  // The speed the player picked; each new game (and zoom change) starts from it.
  const [baseSpeed, setBaseSpeed] = useState(INITIAL_GAME_SPEED);
  const [mondragonsCompleted, setMondragonsCompleted] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const directionRef = useRef(INITIAL_DIRECTION);
  const scoreRef = useRef(0);

  const MONDRAGON_TEXT = 'I-LOVE-STATISTICS';

  // Clear feedback after animation
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 4000); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Generate random food position with math symbol
  const generateFood = useCallback((currentSnake) => randomFood(grid, currentSnake), [grid]);

  // Get the letter to display on each snake segment
  const getSnakeSegmentLetter = (index) => {
    if (index === 0) return ''; // Head has no letter

    const letterIndex = index - 1;
    const fullMondragonLength = MONDRAGON_TEXT.length;

    if (letterIndex < fullMondragonLength) {
      // First word: m, o, n, d, r, a, g, o, n
      return MONDRAGON_TEXT[letterIndex];
    } else if (letterIndex === fullMondragonLength) {
      // Add hyphen after first "mondragon"
      return '-';
    } else {
      // Repeat: mondragon-m, mondragon-mo, etc.
      const repeatIndex = (letterIndex - fullMondragonLength - 1) % (fullMondragonLength + 1);
      if (repeatIndex === fullMondragonLength) {
        return '-';
      }
      return MONDRAGON_TEXT[repeatIndex];
    }
  };

  // Build the current "mondragon" progress text
  const updateMondragronText = useCallback((snakeLength) => {
    let text = '';
    for (let i = 1; i < snakeLength; i++) {
      text += getSnakeSegmentLetter(i);
    }
    setMondragronProgress(text);

    // Check if we've completed another "mondragon"
    const completedCount = Math.floor((snakeLength - 1) / (MONDRAGON_TEXT.length + 1));
    if (completedCount > mondragonsCompleted) {
      setMondragonsCompleted(completedCount);
      // Increase speed by reducing interval (max speed at 50ms)
      setGameSpeed(prevSpeed => Math.max(50, prevSpeed - 10));
    }
  }, [mondragonsCompleted]);

  // Handle direction change
  const changeDirection = useCallback((newDir) => {
    const currentDir = directionRef.current;
    
    // Check if new direction is opposite to current direction
    // Cannot reverse: e.g. if moving x=1 (right), cannot move x=-1 (left)
    if (
      (newDir.x !== 0 && currentDir.x !== 0) || 
      (newDir.y !== 0 && currentDir.y !== 0)
    ) {
      return;
    }

    directionRef.current = newDir;
    setDirection(newDir);
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + directionRef.current.x,
        y: prevSnake[0].y + directionRef.current.y
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= grid.cols ||
        newHead.y < 0 ||
        newHead.y >= grid.rows
      ) {
        setGameOver(true);
        setIsPlaying(false);
        announcePolite(`Game over! Final score: ${scoreRef.current}. Snake length: ${prevSnake.length}.`);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        announcePolite(`Game over! Final score: ${scoreRef.current}. Snake length: ${prevSnake.length}.`);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => { scoreRef.current = prev + 10; return prev + 10; });
        
        // Trigger feedback
        setFeedback({
          text: `${food.symbol} ${SYMBOL_NAMES[food.symbol] || ''}`,
          id: Date.now()
        });
        announcePolite(`Collected ${SYMBOL_NAMES[food.symbol] || food.symbol}. Score: ${scoreRef.current}.`);

        setFood(generateFood(newSnake));
        updateMondragronText(newSnake.length);
        return newSnake;
      }

      // Remove tail if no food eaten
      newSnake.pop();
      return newSnake;
    });
  }, [food, gameOver, isPaused, generateFood, updateMondragronText, grid]);

  const togglePause = useCallback(() => {
    if (isPlaying) {
      setIsPaused(!isPaused);
      announcePolite(isPaused ? 'Game resumed.' : 'Game paused.');
    }
  }, [isPlaying, isPaused]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    const key = e.key;

    if (key === 'Escape' && isPlaying) {
      togglePause();
      e.preventDefault();
      return;
    }

    if (!isPlaying || isPaused) return;

    switch (key) {
      case 'ArrowUp':
        changeDirection({ x: 0, y: -1 });
        e.preventDefault();
        break;
      case 'ArrowDown':
        changeDirection({ x: 0, y: 1 });
        e.preventDefault();
        break;
      case 'ArrowLeft':
        changeDirection({ x: -1, y: 0 });
        e.preventDefault();
        break;
      case 'ArrowRight':
        changeDirection({ x: 1, y: 0 });
        e.preventDefault();
        break;
      default:
        break;
    }
  }, [isPlaying, isPaused, changeDirection, togglePause]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const gameLoop = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameLoop);
  }, [isPlaying, isPaused, moveSnake, gameSpeed]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { cols, rows, cell: CELL_SIZE } = grid;
    // Eye and font sizes were tuned for 15px cells; scale them with the cell.
    const unit = CELL_SIZE / 15;

    // Draw grid
    ctx.strokeStyle = '#E6E6E6';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, rows * CELL_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(cols * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food (math symbol)
    ctx.fillStyle = '#D97706';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = '#2A2A2A';
    ctx.font = `bold ${Math.round(12 * unit)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      food.symbol,
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2
    );

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        // Draw eyes on head
        ctx.fillStyle = '#2A2A2A';
        const eyeSize = 2 * unit;
        const eyeOffset = 4 * unit;
        const near = 3 * unit;
        const edge = 2 * unit;
        const far = CELL_SIZE - 5 * unit;

        if (direction.x === 1) { // Right
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + near, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + far, eyeSize, eyeSize);
        } else if (direction.x === -1) { // Left
          ctx.fillRect(segment.x * CELL_SIZE + edge, segment.y * CELL_SIZE + near, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + edge, segment.y * CELL_SIZE + far, eyeSize, eyeSize);
        } else if (direction.y === -1) { // Up
          ctx.fillRect(segment.x * CELL_SIZE + near, segment.y * CELL_SIZE + edge, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + far, segment.y * CELL_SIZE + edge, eyeSize, eyeSize);
        } else { // Down
          ctx.fillRect(segment.x * CELL_SIZE + near, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + far, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
        }
      } else {
        // Body with letters
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Draw letter
        const letter = getSnakeSegmentLetter(index);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.round(10 * unit)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          letter,
          segment.x * CELL_SIZE + CELL_SIZE / 2,
          segment.y * CELL_SIZE + CELL_SIZE / 2
        );
      }
    });
  }, [snake, food, direction, grid]);

  const initializeGameState = (playing, targetGrid = grid) => {
    const startSnake = initialSnake(targetGrid);
    setSnake(startSnake);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(randomFood(targetGrid, startSnake));
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    setIsPlaying(playing);
    setIsPaused(false);
    setMondragronProgress('');
    setGameSpeed(baseSpeed);
    setMondragonsCompleted(0);
  };

  const startGame = () => {
    initializeGameState(true);
    announcePolite('Game started. Use arrow keys to move.');
  };


  const resetGame = () => {
    initializeGameState(false);
    announcePolite('Game reset.');
  };

  // A different grid invalidates every position, so a zoom change always restarts.
  const changeZoom = (index) => {
    setZoomIndex(index);
    try {
      localStorage.setItem(ZOOM_STORAGE_KEY, String(index));
    } catch {
      // Storage can be blocked (private mode); the zoom still applies for this visit.
    }
    initializeGameState(false, ZOOM_LEVELS[index]);
    announcePolite(`Board zoom set to ${ZOOM_LEVELS[index].label}. Game reset.`);
  };

  const speedLabel = gameSpeed <= 80 ? 'Fast' : gameSpeed <= 130 ? 'Medium' : 'Slow';
  // Left-to-right runs slow to fast, the reverse of the tick delay stored in gameSpeed.
  const sliderValue = MIN_DELAY + MAX_DELAY - gameSpeed;
  const sliderFill = ((sliderValue - MIN_DELAY) / (MAX_DELAY - MIN_DELAY)) * 100;

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          10% { transform: translateY(-25px); opacity: 1; }
          90% { transform: translateY(-25px); opacity: 1; }
          100% { transform: translateY(-35px); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 4s ease-out forwards;
        }
      `}</style>

      <div className="mb-4 text-center relative w-full h-16 flex flex-col items-center justify-center">
        <div className={`transition-opacity duration-200 ${feedback ? 'opacity-10' : 'opacity-100'}`}>
          <h3 className="text-xl font-bold text-darkGrey mb-2">Math Snake Game</h3>
          <p className="text-sm text-darkGrey opacity-70">Eat math symbols to grow!</p>
        </div>
        
        {feedback && (
          <div 
            key={feedback.id}
            className="absolute z-10 animate-float-up"
          >
            <span className="text-2xl font-bold text-darkTeal bg-white px-3 py-1 rounded shadow-sm border border-darkTeal">
              {feedback.text}
            </span>
          </div>
        )}
      </div>

      {/* Game Canvas */}
      <div className="relative mb-4 w-full max-w-[1200px] flex justify-center">
        <canvas
          ref={canvasRef}
          width={grid.cols * grid.cell}
          height={grid.rows * grid.cell}
          className="border-4 border-darkTeal rounded-lg bg-white w-full h-auto max-w-full block"
          role="img"
          aria-label={`Math Snake game canvas. Score: ${score}. Snake length: ${snake.length}. ${gameOver ? 'Game over.' : isPlaying ? (isPaused ? 'Paused.' : 'Playing.') : 'Press Start to play.'}`}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-darkGrey bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <p className="text-white text-2xl font-bold mb-2">Game Over!</p>
              <p className="text-accent text-xl mb-4">Score: {score}</p>
              <button
                onClick={startGame}
                className="bg-darkTeal text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-darkTeal bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <p className="text-white text-xl font-bold mb-4">Ready to Play?</p>
              <button
                onClick={startGame}
                className="bg-accent border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all flex items-center gap-2 mx-auto"
              >
                <Play size={20} />
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && isPlaying && (
          <div className="absolute inset-0 bg-darkGrey bg-opacity-75 flex items-center justify-center rounded-lg">
            <p className="text-white text-2xl font-bold">PAUSED</p>
          </div>
        )}
      </div>

      {/* Score and Progress */}
      <div className="mb-4 text-center w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <div className="text-darkGrey">
            <span className="font-bold">Score:</span> <span className="text-darkTeal text-xl font-bold">{score}</span>
          </div>
          <div className="text-darkGrey">
            <span className="font-bold">Length:</span> <span className="text-darkTeal text-xl font-bold">{snake.length}</span>
          </div>
        </div>

        {mondragronProgress && (
          <div className="bg-accent bg-opacity-20 border-2 border-accent rounded-lg p-2">
            <p className="text-sm text-darkGrey font-bold">Snake Text:</p>
            <p className="text-lg font-bold text-darkTeal font-mono break-all">{mondragronProgress}</p>
          </div>
        )}
      </div>

      {/* Speed control — SC 2.2.1 Timing Adjustable */}
      <div className="mb-4 w-full max-w-md">
        <label htmlFor="snake-speed" className="block text-sm font-medium text-darkGrey mb-1">
          Game Speed: {speedLabel}
        </label>
        <input
          id="snake-speed"
          type="range"
          min={MIN_DELAY}
          max={MAX_DELAY}
          step="10"
          value={sliderValue}
          onChange={(e) => {
            const delay = MIN_DELAY + MAX_DELAY - Number(e.target.value);
            setGameSpeed(delay);
            setBaseSpeed(delay);
          }}
          aria-valuetext={`${speedLabel} speed`}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #0F766E 0%, #0F766E ${sliderFill}%, #e0e0e0 ${sliderFill}%, #e0e0e0 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-darkGrey/60 mt-1">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      <fieldset className="mb-4 w-full max-w-md">
        <legend className="block text-sm font-medium text-darkGrey mb-1">Board zoom (changing it restarts the game)</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ZOOM_LEVELS.map((level, index) => (
            <button
              key={level.label}
              type="button"
              onClick={() => changeZoom(index)}
              aria-pressed={index === zoomIndex}
              className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-1
                ${index === zoomIndex
                  ? 'bg-darkTeal border-darkTeal text-white'
                  : 'bg-white border-platinum text-darkGrey hover:border-darkTeal'}`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Touch Controls - Visible on all devices but intended for touch */}
      <div className="grid grid-cols-3 gap-2 mb-4 max-w-[200px]">
        <div></div>
        <button 
          className="bg-darkGrey text-white p-4 rounded-lg active:bg-darkTeal transition-colors flex items-center justify-center shadow-md"
          onClick={() => changeDirection({ x: 0, y: -1 })}
          aria-label="Up"
        >
          <ArrowUp size={24} />
        </button>
        <div></div>
        
        <button 
          className="bg-darkGrey text-white p-4 rounded-lg active:bg-darkTeal transition-colors flex items-center justify-center shadow-md"
          onClick={() => changeDirection({ x: -1, y: 0 })}
          aria-label="Left"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          className="bg-darkGrey text-white p-4 rounded-lg active:bg-darkTeal transition-colors flex items-center justify-center shadow-md"
          onClick={() => changeDirection({ x: 0, y: 1 })}
          aria-label="Down"
        >
          <ArrowDown size={24} />
        </button>
        <button 
          className="bg-darkGrey text-white p-4 rounded-lg active:bg-darkTeal transition-colors flex items-center justify-center shadow-md"
          onClick={() => changeDirection({ x: 1, y: 0 })}
          aria-label="Right"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        {isPlaying && (
          <button
            onClick={togglePause}
            className="bg-accent border-2 border-darkGrey text-darkGrey px-4 py-2 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all flex items-center gap-2"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        {isPlaying && (
          <button
            onClick={resetGame}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-darkGrey opacity-70 max-w-xs">
        <p className="font-bold mb-1">How to Play:</p>
        <p>Eat math symbols and use the arrows or on-screen buttons to move!</p>
      </div>
    </div>
  );
};

export default SnakeGame;
