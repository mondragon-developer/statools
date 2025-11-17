import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GRID_WIDTH = 80;
const GRID_HEIGHT = 30;
const CELL_SIZE = 15;
const INITIAL_SNAKE = [{ x: 40, y: 15 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_GAME_SPEED = 150;

const MATH_SYMBOLS = ['π', 'Σ', '∫', '∞', '√', 'α', 'β', 'γ', 'δ', 'θ', 'λ', 'μ', 'σ', '∂', '∇', '≈', '≠', '≤', '≥', '±', '×', '÷', '∈', '∉', '⊂', '⊃', '∪', '∩'];

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 60, y: 15, symbol: 'π' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mondragronProgress, setMondragronProgress] = useState('');
  const [gameSpeed, setGameSpeed] = useState(INITIAL_GAME_SPEED);
  const [mondragonsCompleted, setMondragonsCompleted] = useState(0);

  const directionRef = useRef(INITIAL_DIRECTION);

  const MONDRAGON_TEXT = 'I-LOVE-STATISTICS';

  // Generate random food position with math symbol
  const generateFood = useCallback(() => {
    let newFood;
    let attempts = 0;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
        symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)]
      };
      attempts++;
    } while (
      attempts < 100 &&
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, [snake]);

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
        newHead.x >= GRID_WIDTH ||
        newHead.y < 0 ||
        newHead.y >= GRID_HEIGHT
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
        updateMondragronText(newSnake.length);
        return newSnake;
      }

      // Remove tail if no food eaten
      newSnake.pop();
      return newSnake;
    });
  }, [food, gameOver, isPaused, generateFood, updateMondragronText]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (!isPlaying || isPaused) return;

    const key = e.key;
    const currentDir = directionRef.current;

    switch (key) {
      case 'ArrowUp':
        if (currentDir.y === 0) {
          directionRef.current = { x: 0, y: -1 };
          setDirection({ x: 0, y: -1 });
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (currentDir.y === 0) {
          directionRef.current = { x: 0, y: 1 };
          setDirection({ x: 0, y: 1 });
        }
        e.preventDefault();
        break;
      case 'ArrowLeft':
        if (currentDir.x === 0) {
          directionRef.current = { x: -1, y: 0 };
          setDirection({ x: -1, y: 0 });
        }
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (currentDir.x === 0) {
          directionRef.current = { x: 1, y: 0 };
          setDirection({ x: 1, y: 0 });
        }
        e.preventDefault();
        break;
      default:
        break;
    }
  }, [isPlaying, isPaused]);

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

    // Draw grid
    ctx.strokeStyle = '#E6E6E6';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_WIDTH * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food (math symbol)
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = '#2A2A2A';
    ctx.font = 'bold 12px Arial';
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
        const eyeSize = 2;
        const eyeOffset = 4;

        if (direction.x === 1) { // Right
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + 3, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - 5, eyeSize, eyeSize);
        } else if (direction.x === -1) { // Left
          ctx.fillRect(segment.x * CELL_SIZE + 2, segment.y * CELL_SIZE + 3, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 2, segment.y * CELL_SIZE + CELL_SIZE - 5, eyeSize, eyeSize);
        } else if (direction.y === -1) { // Up
          ctx.fillRect(segment.x * CELL_SIZE + 3, segment.y * CELL_SIZE + 2, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - 5, segment.y * CELL_SIZE + 2, eyeSize, eyeSize);
        } else { // Down
          ctx.fillRect(segment.x * CELL_SIZE + 3, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - 5, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
        }
      } else {
        // Body with letters
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Draw letter
        const letter = getSnakeSegmentLetter(index);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          letter,
          segment.x * CELL_SIZE + CELL_SIZE / 2,
          segment.y * CELL_SIZE + CELL_SIZE / 2
        );
      }
    });
  }, [snake, food, direction]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    setMondragronProgress('');
    setGameSpeed(INITIAL_GAME_SPEED);
    setMondragonsCompleted(0);
  };

  const togglePause = () => {
    if (isPlaying) {
      setIsPaused(!isPaused);
    }
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setIsPaused(false);
    setMondragronProgress('');
    setGameSpeed(INITIAL_GAME_SPEED);
    setMondragonsCompleted(0);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-darkGrey mb-2">Math Snake Game</h3>
        <p className="text-sm text-darkGrey opacity-70">Eat math symbols to grow!</p>
      </div>

      {/* Game Canvas */}
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          width={GRID_WIDTH * CELL_SIZE}
          height={GRID_HEIGHT * CELL_SIZE}
          className="border-4 border-turquoise rounded-lg bg-white"
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-darkGrey bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <p className="text-white text-2xl font-bold mb-2">Game Over!</p>
              <p className="text-yellow text-xl mb-4">Score: {score}</p>
              <button
                onClick={startGame}
                className="bg-turquoise text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-turquoise bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <p className="text-white text-xl font-bold mb-4">Ready to Play?</p>
              <button
                onClick={startGame}
                className="bg-yellow border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all flex items-center gap-2 mx-auto"
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
      <div className="mb-4 text-center w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="text-darkGrey">
            <span className="font-bold">Score:</span> <span className="text-turquoise text-xl font-bold">{score}</span>
          </div>
          <div className="text-darkGrey">
            <span className="font-bold">Length:</span> <span className="text-turquoise text-xl font-bold">{snake.length}</span>
          </div>
        </div>

        {mondragronProgress && (
          <div className="bg-yellow bg-opacity-20 border-2 border-yellow rounded-lg p-2">
            <p className="text-sm text-darkGrey font-bold">Snake Text:</p>
            <p className="text-lg font-bold text-turquoise font-mono">{mondragronProgress}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        {isPlaying && (
          <button
            onClick={togglePause}
            className="bg-yellow border-2 border-darkGrey text-darkGrey px-4 py-2 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all flex items-center gap-2"
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
        <p>Eat math symbols and use the arrows to move!</p>
      </div>
    </div>
  );
};

export default SnakeGame;
