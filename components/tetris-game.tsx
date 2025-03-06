"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Play, Pause } from "lucide-react"

// Tetris piece shapes and their rotations
const SHAPES = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // J
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  // L
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  // O
  [
    [4, 4],
    [4, 4],
  ],
  // S
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  // T
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  // Z
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
]

// Colors for each piece
const COLORS = [
  "transparent",
  "#00FFFF", // I - Cyan
  "#0000FF", // J - Blue
  "#FF7F00", // L - Orange
  "#FFFF00", // O - Yellow
  "#00FF00", // S - Green
  "#800080", // T - Purple
  "#FF0000", // Z - Red
]

export function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Game constants
    const BLOCK_SIZE = 30
    const BOARD_WIDTH = 10
    const BOARD_HEIGHT = 20

    // Resize canvas to fit the game board
    canvas.width = BLOCK_SIZE * BOARD_WIDTH
    canvas.height = BLOCK_SIZE * BOARD_HEIGHT

    // Game variables
    let board = Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0))
    let currentPiece = null
    let currentX = 0
    let currentY = 0
    let currentShape = null
    let animationFrameId: number
    let dropCounter = 0
    let dropInterval = 1000 // ms
    let lastTime = 0
    let currentScore = 0
    let currentLevel = 1
    let linesCleared = 0

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("tetrisHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    // Game functions
    function createPiece(type: number) {
      return SHAPES[type]
    }

    function drawBlock(x: number, y: number, color: string) {
      ctx.fillStyle = color
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      ctx.strokeStyle = "#000"
      ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
    }

    function drawBoard() {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          const colorIndex = board[y][x]
          drawBlock(x, y, COLORS[colorIndex])
        }
      }
    }

    function drawPiece() {
      if (!currentPiece) return

      for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
          if (currentPiece[y][x] !== 0) {
            drawBlock(currentX + x, currentY + y, COLORS[currentPiece[y][x]])
          }
        }
      }
    }

    function drawGameOver() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 30px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30)

      ctx.font = "20px sans-serif"
      ctx.fillText(`Score: ${currentScore}`, canvas.width / 2, canvas.height / 2 + 10)
      ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2, canvas.height / 2 + 40)
    }

    function drawPaused() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 30px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2)
    }

    function drawGetReady() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 30px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("TETRIS", canvas.width / 2, canvas.height / 2 - 40)

      ctx.font = "20px sans-serif"
      ctx.fillText("Press SPACE to start", canvas.width / 2, canvas.height / 2 + 20)

      ctx.font = "16px sans-serif"
      ctx.fillText("← → : Move", canvas.width / 2, canvas.height / 2 + 60)
      ctx.fillText("↑ : Rotate", canvas.width / 2, canvas.height / 2 + 90)
      ctx.fillText("↓ : Drop", canvas.width / 2, canvas.height / 2 + 120)
    }

    function collide() {
      if (!currentPiece) return true

      for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
          if (currentPiece[y][x] !== 0) {
            const boardX = currentX + x
            const boardY = currentY + y

            // Check if outside the board or colliding with another piece
            if (
              boardX < 0 ||
              boardX >= BOARD_WIDTH ||
              boardY >= BOARD_HEIGHT ||
              (boardY >= 0 && board[boardY][boardX] !== 0)
            ) {
              return true
            }
          }
        }
      }

      return false
    }

    function rotate() {
      if (!currentPiece) return

      // Create a new rotated piece
      const rotated = []
      for (let i = 0; i < currentPiece[0].length; i++) {
        const row = []
        for (let j = currentPiece.length - 1; j >= 0; j--) {
          row.push(currentPiece[j][i])
        }
        rotated.push(row)
      }

      // Save the current piece
      const originalPiece = currentPiece

      // Try the rotation
      currentPiece = rotated

      // If the rotation causes a collision, revert back
      if (collide()) {
        currentPiece = originalPiece
      }
    }

    function moveLeft() {
      currentX--
      if (collide()) {
        currentX++
      }
    }

    function moveRight() {
      currentX++
      if (collide()) {
        currentX--
      }
    }

    function moveDown() {
      currentY++

      if (collide()) {
        currentY--
        merge()
        resetPiece()
        removeLines()
      }

      dropCounter = 0
    }

    function hardDrop() {
      while (!collide()) {
        currentY++
      }

      currentY--
      merge()
      resetPiece()
      removeLines()
      dropCounter = 0
    }

    function merge() {
      if (!currentPiece) return

      for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
          if (currentPiece[y][x] !== 0) {
            const boardY = currentY + y
            if (boardY >= 0) {
              // Only merge if the piece is on the board
              board[boardY][currentX + x] = currentPiece[y][x]
            }
          }
        }
      }
    }

    function removeLines() {
      let linesRemoved = 0

      outer: for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          if (board[y][x] === 0) {
            continue outer
          }
        }

        // Remove the line
        const row = board.splice(y, 1)[0].fill(0)
        board.unshift(row)
        y++

        linesRemoved++
      }

      // Update score based on lines removed
      if (linesRemoved > 0) {
        const points = [0, 40, 100, 300, 1200][linesRemoved] * currentLevel
        currentScore += points
        setScore(currentScore)

        // Update level
        linesCleared += linesRemoved
        const newLevel = Math.floor(linesCleared / 10) + 1
        if (newLevel > currentLevel) {
          currentLevel = newLevel
          setLevel(currentLevel)
          // Increase speed with level
          dropInterval = Math.max(100, 1000 - (currentLevel - 1) * 100)
        }
      }
    }

    function resetPiece() {
      // Get a random piece
      const pieceType = Math.floor(Math.random() * SHAPES.length)
      currentPiece = createPiece(pieceType)
      currentShape = pieceType

      // Position the piece at the top center
      currentX = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece[0].length / 2)
      currentY = 0

      // Check if the new piece immediately collides (game over)
      if (collide()) {
        setGameOver(true)

        // Update high score
        if (currentScore > highScore) {
          setHighScore(currentScore)
          localStorage.setItem("tetrisHighScore", currentScore.toString())
        }
      }
    }

    function update(time = 0) {
      if (gameOver || !gameStarted || gamePaused) {
        return
      }

      const deltaTime = time - lastTime
      lastTime = time

      dropCounter += deltaTime
      if (dropCounter > dropInterval) {
        moveDown()
      }

      draw()
      animationFrameId = requestAnimationFrame(update)
    }

    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw board and current piece
      drawBoard()
      drawPiece()

      // Draw game state overlays
      if (gameOver) {
        drawGameOver()
      } else if (gamePaused) {
        drawPaused()
      } else if (!gameStarted) {
        drawGetReady()
      }
    }

    function startGame() {
      if (gameOver) {
        resetGame()
      }

      setGameStarted(true)
      setGamePaused(false)
      resetPiece()
      lastTime = 0
      update()
    }

    function pauseGame() {
      setGamePaused(!gamePaused)

      if (!gamePaused) {
        update()
      } else {
        draw()
      }
    }

    function resetGame() {
      // Reset game state
      board = Array(BOARD_HEIGHT)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(0))
      currentScore = 0
      currentLevel = 1
      linesCleared = 0
      dropInterval = 1000

      setScore(0)
      setLevel(1)
      setGameOver(false)

      draw()
    }

    // Event listeners
    function handleKeyDown(e: KeyboardEvent) {
      if (!gameStarted) {
        if (e.code === "Space") {
          startGame()
        }
        return
      }

      if (gameOver) {
        return
      }

      if (e.code === "KeyP") {
        pauseGame()
        return
      }

      if (gamePaused) {
        return
      }

      switch (e.code) {
        case "ArrowLeft":
          moveLeft()
          break
        case "ArrowRight":
          moveRight()
          break
        case "ArrowDown":
          moveDown()
          break
        case "ArrowUp":
          rotate()
          break
        case "Space":
          hardDrop()
          break
      }

      draw()
    }

    // Mobile controls
    function handleTouchStart(e: TouchEvent) {
      if (!gameStarted) {
        startGame()
        return
      }

      if (gameOver || gamePaused) {
        return
      }

      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left

      if (x < canvas.width / 3) {
        moveLeft()
      } else if (x > (canvas.width / 3) * 2) {
        moveRight()
      } else {
        rotate()
      }

      draw()
    }

    function handleTouchEnd() {
      if (!gameStarted || gameOver || gamePaused) {
        return
      }

      hardDrop()
      draw()
    }

    window.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

    // Initial draw
    draw()

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [gameStarted, gamePaused, gameOver, highScore])

  const handleStart = () => {
    if (gameOver) {
      setGameOver(false)
    }
    setGameStarted(true)
    setGamePaused(false)
  }

  const handlePause = () => {
    setGamePaused(!gamePaused)
  }

  const handleRestart = () => {
    setGameStarted(false)
    setGamePaused(false)
    setGameOver(false)
    setScore(0)
    setLevel(1)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <canvas ref={canvasRef} className="border rounded-lg bg-gray-900 w-full max-w-full h-auto" />
        <div className="absolute top-4 right-4 flex gap-2">
          {!gameStarted ? (
            <Button onClick={handleStart} size="sm" variant="outline" className="bg-white/80">
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          ) : gameOver ? (
            <Button onClick={handleRestart} size="sm" variant="outline" className="bg-white/80">
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} size="sm" variant="outline" className="bg-white/80">
                {gamePaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button onClick={handleRestart} size="sm" variant="outline" className="bg-white/80">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between w-full max-w-md">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Level</p>
          <p className="text-2xl font-bold">{level}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">High Score</p>
          <p className="text-2xl font-bold">{highScore}</p>
        </div>
      </div>
    </div>
  )
}

