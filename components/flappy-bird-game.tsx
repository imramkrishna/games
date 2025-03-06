"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Game variables
    let animationFrameId: number
    const bird = {
      x: canvas.width / 4,
      y: canvas.height / 2,
      radius: 12,
      velocity: 0,
      gravity: 0.5,
      jump: -8,
    }

    let pipes: { x: number; y: number; width: number; height: number; passed: boolean }[] = []
    const pipeWidth = 50
    const pipeGap = 150
    const pipeSpacing = 200

    let currentScore = 0
    let frameCount = 0

    // Colors
    const skyColor = "#70c5ce"
    const groundColor = "#ded895"
    const birdColor = "#f8e71c"
    const pipeColor = "#73bf2e"

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("flappyBirdHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    // Game functions
    function drawBird() {
      ctx.fillStyle = birdColor
      ctx.beginPath()
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw eye
      ctx.fillStyle = "#fff"
      ctx.beginPath()
      ctx.arc(bird.x + 4, bird.y - 4, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(bird.x + 5, bird.y - 4, 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw beak
      ctx.fillStyle = "#ff8a00"
      ctx.beginPath()
      ctx.moveTo(bird.x + 12, bird.y)
      ctx.lineTo(bird.x + 20, bird.y - 3)
      ctx.lineTo(bird.x + 20, bird.y + 3)
      ctx.closePath()
      ctx.fill()
    }

    function drawPipes() {
      for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i]
        ctx.fillStyle = pipeColor

        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y)

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - (pipe.y + pipeGap))

        // Pipe caps
        ctx.fillStyle = "#5a9e24"
        // Top pipe cap
        ctx.fillRect(pipe.x - 3, pipe.y - 20, pipe.width + 6, 20)
        // Bottom pipe cap
        ctx.fillRect(pipe.x - 3, pipe.y + pipeGap, pipe.width + 6, 20)
      }
    }

    function drawGround() {
      ctx.fillStyle = groundColor
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50)

      // Draw grass
      ctx.fillStyle = "#8ed026"
      ctx.fillRect(0, canvas.height - 50, canvas.width, 5)
    }

    function drawSky() {
      ctx.fillStyle = skyColor
      ctx.fillRect(0, 0, canvas.width, canvas.height - 50)

      // Draw clouds
      ctx.fillStyle = "#fff"
      ctx.beginPath()
      ctx.arc(100, 80, 30, 0, Math.PI * 2)
      ctx.arc(130, 90, 25, 0, Math.PI * 2)
      ctx.arc(160, 80, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(canvas.width - 100, 120, 20, 0, Math.PI * 2)
      ctx.arc(canvas.width - 130, 130, 25, 0, Math.PI * 2)
      ctx.arc(canvas.width - 160, 120, 30, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawScore() {
      ctx.fillStyle = "#fff"
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.font = "bold 35px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(currentScore.toString(), canvas.width / 2, 50)
      ctx.strokeText(currentScore.toString(), canvas.width / 2, 50)
    }

    function drawGameOver() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 40px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50)

      ctx.font = "25px sans-serif"
      ctx.fillText(`Score: ${currentScore}`, canvas.width / 2, canvas.height / 2)
      ctx.fillText(`High Score: ${Math.max(currentScore, highScore)}`, canvas.width / 2, canvas.height / 2 + 40)
    }

    function drawGetReady() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 40px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Tap to Start", canvas.width / 2, canvas.height / 2)
    }

    function createPipe() {
      const minHeight = 50
      const maxHeight = canvas.height - pipeGap - minHeight - 50 // 50 for ground
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)

      pipes.push({
        x: canvas.width,
        y: height,
        width: pipeWidth,
        height: height,
        passed: false,
      })
    }

    function updatePipes() {
      for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i]
        pipe.x -= 2

        // Check if bird passed the pipe
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
          pipe.passed = true
          currentScore++
          setScore(currentScore)
        }

        // Remove pipes that are off screen
        if (pipe.x + pipe.width < 0) {
          pipes.shift()
        }
      }

      // Add new pipe
      frameCount++
      if (frameCount % pipeSpacing === 0) {
        createPipe()
      }
    }

    function checkCollision() {
      // Check ground collision
      if (bird.y + bird.radius > canvas.height - 50) {
        return true
      }

      // Check ceiling collision
      if (bird.y - bird.radius < 0) {
        return true
      }

      // Check pipe collision
      for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i]

        // Check collision with top pipe
        if (
          bird.x + bird.radius > pipe.x &&
          bird.x - bird.radius < pipe.x + pipe.width &&
          bird.y - bird.radius < pipe.y
        ) {
          return true
        }

        // Check collision with bottom pipe
        if (
          bird.x + bird.radius > pipe.x &&
          bird.x - bird.radius < pipe.x + pipe.width &&
          bird.y + bird.radius > pipe.y + pipeGap
        ) {
          return true
        }
      }

      return false
    }

    function updateBird() {
      bird.velocity += bird.gravity
      bird.y += bird.velocity
    }

    function jump() {
      if (!gameStarted) {
        setGameStarted(true)
        return
      }

      if (gameOver) {
        resetGame()
        return
      }

      bird.velocity = bird.jump
    }

    function resetGame() {
      bird.y = canvas.height / 2
      bird.velocity = 0
      pipes = []
      frameCount = 0
      currentScore = 0
      setScore(0)
      setGameOver(false)
    }

    function gameLoop() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      drawSky()
      drawGround()

      if (!gameStarted) {
        drawBird()
        drawGetReady()
      } else if (!gameOver) {
        // Update game state
        updateBird()
        updatePipes()

        // Draw game elements
        drawPipes()
        drawBird()
        drawScore()

        // Check for collisions
        if (checkCollision()) {
          setGameOver(true)

          // Update high score
          if (currentScore > highScore) {
            setHighScore(currentScore)
            localStorage.setItem("flappyBirdHighScore", currentScore.toString())
          }
        }
      } else {
        // Draw game over screen
        drawPipes()
        drawBird()
        drawGameOver()
      }

      // Continue animation
      if (!gameOver || !gameStarted) {
        animationFrameId = requestAnimationFrame(gameLoop)
      }
    }

    // Event listeners
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        jump()
      }
    }

    function handleTouch() {
      jump()
    }

    window.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("click", handleTouch)
    canvas.addEventListener("touchstart", handleTouch)

    // Start game loop
    gameLoop()

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("click", handleTouch)
      canvas.removeEventListener("touchstart", handleTouch)
      cancelAnimationFrame(animationFrameId)
    }
  }, [highScore, gameOver, gameStarted])

  const handleRestart = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          className="border rounded-lg bg-sky-200 w-full max-w-full h-auto"
        />
        {gameOver && (
          <div className="absolute top-4 right-4">
            <Button onClick={handleRestart} size="sm" variant="outline" className="bg-white/80">
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </div>
        )}
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

