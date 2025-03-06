"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Play, Pause } from "lucide-react"

// Direction constants
enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Game constants
    const GRID_SIZE = 20
    const GAME_WIDTH = 400
    const GAME_HEIGHT = 400

    // Resize canvas
    canvas.width = GAME_WIDTH
    canvas.height = GAME_HEIGHT

    // Game variables
    let snake = [{ x: 10, y: 10 }]
    let food = { x: 15, y: 15 }
    let direction = Direction.RIGHT
    let nextDirection = Direction.RIGHT
    let speed = 150 // ms
    let lastTime = 0
    let animationFrameId: number
    let currentScore = 0

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("snakeHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    // Game functions
    function drawSnake() {
      snake.forEach((segment, index) => {
        // Head is a different color
        if (index === 0) {
          ctx.fillStyle = "#4CAF50" // Green
        } else {
          ctx.fillStyle = "#8BC34A" // Light Green
        }

        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)

        // Draw eyes on the head
        if (index === 0) {
          ctx.fillStyle = "#000"

          // Position eyes based on direction
          if (direction === Direction.RIGHT) {
            ctx.fillRect(segment.x * GRID_SIZE + 15, segment.y * GRID_SIZE + 5, 4, 4)
            ctx.fillRect(segment.x * GRID_SIZE + 15, segment.y * GRID_SIZE + 12, 4, 4)
          } else if (direction === Direction.LEFT) {
            ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + 5, 4, 4)
            ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + 12, 4, 4)
          } else if (direction === Direction.UP) {
            ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + 2, 4, 4)
            ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + 2, 4, 4)
          } else if (direction === Direction.DOWN) {
            ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + 15, 4, 4)
            ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + 15, 4, 4)
          }
        }

        // Draw border around each segment
        ctx.strokeStyle = "#388E3C"
        ctx.strokeRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
      })
    }

    function drawFood() {
      ctx.fillStyle = "#F44336" // Red
      ctx.beginPath()
      ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2, 0, Math.PI * 2)
      ctx.fill()

      // Add a shine effect
      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2 - 3,
        food.y * GRID_SIZE + GRID_SIZE / 2 - 3,
        GRID_SIZE / 6,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }

    function drawGrid() {
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"

      // Draw vertical lines
      for (let x = 0; x <= GAME_WIDTH; x += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, GAME_HEIGHT)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y <= GAME_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(GAME_WIDTH, y)
        ctx.stroke()
      }
    }

    function drawScore() {
      ctx.fillStyle = "#fff"
      ctx.font = "bold 20px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${currentScore}`, 10, 30)
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
      ctx.fillText(`High Score: ${Math.max(currentScore, highScore)}`, canvas.width / 2, canvas.height / 2 + 40)
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
      ctx.fillText("SNAKE", canvas.width / 2, canvas.height / 2 - 40)

      ctx.font = "20px sans-serif"
      ctx.fillText("Press SPACE to start", canvas.width / 2, canvas.height / 2 + 20)

      ctx.font = "16px sans-serif"
      ctx.fillText("Use arrow keys to move", canvas.width / 2, canvas.height / 2 + 60)
    }

    function moveSnake() {
      // Update direction
      direction = nextDirection

      // Create new head based on direction
      const head = { ...snake[0] }

      switch (direction) {
        case Direction.UP:
          head.y -= 1
          break
        case Direction.DOWN:
          head.y += 1
          break
        case Direction.LEFT:
          head.x -= 1
          break
        case Direction.RIGHT:
          head.x += 1
          break
      }

      // Check for collisions
      if (
        head.x < 0 ||
        head.x >= GAME_WIDTH / GRID_SIZE ||
        head.y < 0 ||
        head.y >= GAME_HEIGHT / GRID_SIZE ||
        snake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true)

        // Update high score
        if (currentScore > highScore) {
          setHighScore(currentScore)
          localStorage.setItem("snakeHighScore", currentScore.toString())
        }

        return
      }

      // Add new head to snake
      snake.unshift(head)

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        // Generate new food
        generateFood()

        // Increase score
        currentScore += 10
        setScore(currentScore)

        // Increase speed
        speed = Math.max(50, speed - 5)
      } else {
        // Remove tail if no food was eaten
        snake.pop()
      }
    }

    function generateFood() {
      // Generate random position for food
      let newFood

      do {
        newFood = {
          x: Math.floor(Math.random() * (GAME_WIDTH / GRID_SIZE)),
          y: Math.floor(Math.random() * (GAME_HEIGHT / GRID_SIZE)),
        }
        // Make sure food doesn't spawn on snake
      } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))

      food = newFood
    }

    function update(time = 0) {
      if (gameOver || !gameStarted || gamePaused) {
        return
      }

      const deltaTime = time - lastTime

      if (deltaTime > speed) {
        lastTime = time
        moveSnake()
      }

      draw()
      animationFrameId = requestAnimationFrame(update)
    }

    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#E8F5E9" // Light green background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      drawGrid()

      // Draw game elements
      drawSnake()
      drawFood()
      drawScore()

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
      snake = [{ x: 10, y: 10 }]
      direction = Direction.RIGHT
      nextDirection = Direction.RIGHT
      speed = 150
      currentScore = 0

      setScore(0)
      setGameOver(false)

      generateFood()
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

      // Prevent reversing direction
      switch (e.code) {
        case "ArrowUp":
          if (direction !== Direction.DOWN) {
            nextDirection = Direction.UP
          }
          break
        case "ArrowDown":
          if (direction !== Direction.UP) {
            nextDirection = Direction.DOWN
          }
          break
        case "ArrowLeft":
          if (direction !== Direction.RIGHT) {
            nextDirection = Direction.LEFT
          }
          break
        case "ArrowRight":
          if (direction !== Direction.LEFT) {
            nextDirection = Direction.RIGHT
          }
          break
      }
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
      const touchX = touch.clientX - rect.left
      const touchY = touch.clientY - rect.top

      // Calculate center of canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Calculate touch position relative to center
      const relativeX = touchX - centerX
      const relativeY = touchY - centerY

      // Determine swipe direction based on the greater distance
      if (Math.abs(relativeX) > Math.abs(relativeY)) {
        // Horizontal swipe
        if (relativeX > 0 && direction !== Direction.LEFT) {
          nextDirection = Direction.RIGHT
        } else if (relativeX < 0 && direction !== Direction.RIGHT) {
          nextDirection = Direction.LEFT
        }
      } else {
        // Vertical swipe
        if (relativeY > 0 && direction !== Direction.UP) {
          nextDirection = Direction.DOWN
        } else if (relativeY < 0 && direction !== Direction.DOWN) {
          nextDirection = Direction.UP
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("touchstart", handleTouchStart)

    // Initial draw
    draw()

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("touchstart", handleTouchStart)
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
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border rounded-lg bg-green-50 w-full max-w-full h-auto"
        />
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
          <p className="text-sm text-muted-foreground">High Score</p>
          <p className="text-2xl font-bold">{highScore}</p>
        </div>
      </div>
    </div>
  )
}

