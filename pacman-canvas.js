class PacmanGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupGame();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        #gameCanvas {
          border: 1px solid #333;
          background-color: #000;
        }
      </style>
      <canvas id="gameCanvas" width="448" height="496"></canvas>
    `;
  }

  setupGame() {
    const canvas = this.shadowRoot.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const tileSize = 16;
    const mapWidth = canvas.width / tileSize;
    const mapHeight = canvas.height / tileSize;

    const map = [
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
        1, 1, 0, 1,
      ],
      [
        1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
        1, 1, 3, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
        1, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
        1, 1, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
        1, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0,
        0, 0, 0, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
        1, 1, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
        1, 1, 0, 1,
      ],
      [
        1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        0, 0, 3, 1,
      ],
      [
        1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
        0, 1, 1, 1,
      ],
      [
        1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
        0, 1, 1, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0,
        0, 0, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
      ],
    ];

    const pacman = {
      x: 13.5 * tileSize,
      y: 23 * tileSize,
      radius: tileSize / 2,
      mouth: 0,
      direction: 0,
      nextDirection: null,
      speed: 2,
      powerMode: false,
      powerModeTimer: null,
    };

    const ghostTypes = [
      {
        name: "Blinky",
        color: "red",
        x: 13.5 * tileSize,
        y: 11 * tileSize,
        strategy: "chase",
      },
      {
        name: "Pinky",
        color: "pink",
        x: 13.5 * tileSize,
        y: 14 * tileSize,
        strategy: "ambush",
      },
      {
        name: "Inky",
        color: "cyan",
        x: 11.5 * tileSize,
        y: 14 * tileSize,
        strategy: "flank",
      },
      {
        name: "Clyde",
        color: "orange",
        x: 15.5 * tileSize,
        y: 14 * tileSize,
        strategy: "random",
      },
    ];

    const ghosts = ghostTypes.map((type) => ({
      ...type,
      direction: 0,
      speed: 1.5,
      mode: "scatter",
      scared: false,
      eaten: false,
    }));

    let score = 0;
    let lives = 3;
    let level = 1;
    let gameState = "start";
    let fruit = null;

    const sounds = {
      start: new Audio("https://example.com/pacman_beginning.wav"),
      chomp: new Audio("https://example.com/pacman_chomp.wav"),
      death: new Audio("https://example.com/pacman_death.wav"),
      eatGhost: new Audio("https://example.com/pacman_eatghost.wav"),
      eatFruit: new Audio("https://example.com/pacman_eatfruit.wav"),
    };

    function drawMaze() {
      for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
          if (map[y][x] === 1) {
            ctx.fillStyle = "#0000FF";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          } else if (map[y][x] === 0) {
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(
              x * tileSize + tileSize / 2,
              y * tileSize + tileSize / 2,
              2,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          } else if (map[y][x] === 3) {
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(
              x * tileSize + tileSize / 2,
              y * tileSize + tileSize / 2,
              5,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
      }
    }

    function drawPacman() {
      ctx.save();
      ctx.translate(pacman.x, pacman.y);
      ctx.rotate(pacman.direction);
      ctx.beginPath();
      ctx.arc(0, 0, pacman.radius, pacman.mouth, 2 * Math.PI - pacman.mouth);
      ctx.lineTo(0, 0);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.restore();
    }

    function drawGhost(ghost) {
      ctx.save();
      ctx.translate(ghost.x, ghost.y);

      if (ghost.scared) {
        ctx.fillStyle = pacman.powerMode
          ? ghost.eaten
            ? "transparent"
            : "blue"
          : ghost.color;
      } else {
        ctx.fillStyle = ghost.color;
      }

      // Body
      ctx.beginPath();
      ctx.arc(0, 0, pacman.radius, Math.PI, 0, false);
      ctx.lineTo(pacman.radius, pacman.radius);
      ctx.lineTo(-pacman.radius, pacman.radius);
      ctx.closePath();
      ctx.fill();

      if (!ghost.eaten) {
        // Eyes
        const eyeRadius = pacman.radius / 5;
        const eyeOffset = pacman.radius / 2.5;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(-eyeOffset, -eyeOffset, eyeRadius, 0, Math.PI * 2);
        ctx.arc(eyeOffset, -eyeOffset, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(
          -eyeOffset + (Math.cos(ghost.direction) * eyeRadius) / 2,
          -eyeOffset + (Math.sin(ghost.direction) * eyeRadius) / 2,
          eyeRadius / 2,
          0,
          Math.PI * 2,
        );
        ctx.arc(
          eyeOffset + (Math.cos(ghost.direction) * eyeRadius) / 2,
          -eyeOffset + (Math.sin(ghost.direction) * eyeRadius) / 2,
          eyeRadius / 2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      ctx.restore();
    }

    function drawFruit() {
      if (fruit) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, tileSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawScore() {
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`Score: ${score}`, 10, 30);
      ctx.fillText(`Level: ${level}`, canvas.width - 100, 30);

      for (let i = 0; i < lives; i++) {
        ctx.beginPath();
        ctx.arc(30 + i * 25, 50, 10, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(30 + i * 25, 50);
        ctx.fillStyle = "yellow";
        ctx.fill();
      }
    }

    function movePacman() {
      if (pacman.nextDirection !== null) {
        const nextX = pacman.x + Math.cos(pacman.nextDirection) * pacman.speed;
        const nextY = pacman.y + Math.sin(pacman.nextDirection) * pacman.speed;
        const nextTileX = Math.floor(nextX / tileSize);
        const nextTileY = Math.floor(nextY / tileSize);

        if (map[nextTileY][nextTileX] !== 1) {
          pacman.direction = pacman.nextDirection;
          pacman.nextDirection = null;
        }
      }

      const newX = pacman.x + Math.cos(pacman.direction) * pacman.speed;
      const newY = pacman.y + Math.sin(pacman.direction) * pacman.speed;

      const tileX = Math.floor(newX / tileSize);
      const tileY = Math.floor(newY / tileSize);

      if (map[tileY][tileX] !== 1) {
        pacman.x = newX;
        pacman.y = newY;

        if (map[tileY][tileX] === 0) {
          map[tileY][tileX] = 2;
          score += 10;
          sounds.chomp.play();
        } else if (map[tileY][tileX] === 3) {
          map[tileY][tileX] = 2;
          score += 50;
          activatePowerMode();
        }
      }

      // Wrap around
      if (pacman.x < 0) pacman.x = canvas.width;
      if (pacman.x > canvas.width) pacman.x = 0;
    }

    function activatePowerMode() {
      pacman.powerMode = true;
      ghosts.forEach((ghost) => {
        ghost.scared = true;
        ghost.speed = 1;
      });

      if (pacman.powerModeTimer) clearTimeout(pacman.powerModeTimer);
      pacman.powerModeTimer = setTimeout(() => {
        pacman.powerMode = false;
        ghosts.forEach((ghost) => {
          ghost.scared = false;
          ghost.speed = 1.5;
        });
      }, 10000);
    }

    function moveGhost(ghost) {
      const directions = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
      let bestDirection = ghost.direction;
      let bestDistance = Infinity;

      if (ghost.eaten) {
        const homeTileX = 13.5;
        const homeTileY = 14;
        bestDistance = distanceBetween(
          ghost.x / tileSize,
          ghost.y / tileSize,
          homeTileX,
          homeTileY,
        );

        directions.forEach((direction) => {
          const newX = ghost.x + Math.cos(direction) * ghost.speed;
          const newY = ghost.y + Math.sin(direction) * ghost.speed;
          const tileX = Math.floor(newX / tileSize);
          const tileY = Math.floor(newY / tileSize);

          if (map[tileY][tileX] !== 1) {
            const distance = distanceBetween(
              tileX,
              tileY,
              homeTileX,
              homeTileY,
            );
            if (distance < bestDistance) {
              bestDistance = distance;
              bestDirection = direction;
            }
          }
        });

        if (bestDistance < 0.5) {
          ghost.eaten = false;
          ghost.scared = pacman.powerMode;
        }
      } else if (ghost.scared) {
        bestDirection =
          directions[Math.floor(Math.random() * directions.length)];
      } else {
        let targetX, targetY;

        switch (ghost.strategy) {
          case "chase":
            targetX = pacman.x / tileSize;
            targetY = pacman.y / tileSize;
            break;
          case "ambush":
            targetX = pacman.x / tileSize + 4 * Math.cos(pacman.direction);
            targetY = pacman.y / tileSize + 4 * Math.sin(pacman.direction);
            break;
          case "flank":
            const blinky = ghosts.find((g) => g.name === "Blinky");
            targetX = pacman.x / tileSize + (pacman.x - blinky.x) / tileSize;
            targetY = pacman.y / tileSize + (pacman.y - blinky.y) / tileSize;
            break;
          case "random":
            targetX = Math.random() * mapWidth;
            targetY = Math.random() * mapHeight;
            break;
        }

        directions.forEach((direction) => {
          const newX = ghost.x + Math.cos(direction) * ghost.speed;
          const newY = ghost.y + Math.sin(direction) * ghost.speed;
          const tileX = Math.floor(newX / tileSize);
          const tileY = Math.floor(newY / tileSize);

          if (map[tileY][tileX] !== 1) {
            const distance = distanceBetween(tileX, tileY, targetX, targetY);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestDirection = direction;
            }
          }
        });
      }

      ghost.direction = bestDirection;
      ghost.x += Math.cos(ghost.direction) * ghost.speed;
      ghost.y += Math.sin(ghost.direction) * ghost.speed;

      // Wrap around
      if (ghost.x < 0) ghost.x = canvas.width;
      if (ghost.x > canvas.width) ghost.x = 0;
    }

    function distanceBetween(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function checkCollisions() {
      ghosts.forEach((ghost) => {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pacman.radius + ghost.radius) {
          if (pacman.powerMode && !ghost.eaten) {
            ghost.eaten = true;
            score += 200;
            sounds.eatGhost.play();
          } else if (!ghost.eaten) {
            lives--;
            sounds.death.play();
            if (lives > 0) {
              resetPositions();
            } else {
              gameState = "gameOver";
            }
          }
        }
      });

      if (
        fruit &&
        distanceBetween(pacman.x, pacman.y, fruit.x, fruit.y) < pacman.radius
      ) {
        score += 100;
        fruit = null;
        sounds.eatFruit.play();
      }
    }

    function resetPositions() {
      pacman.x = 13.5 * tileSize;
      pacman.y = 23 * tileSize;
      pacman.direction = 0;
      pacman.nextDirection = null;

      ghosts.forEach((ghost, index) => {
        const type = ghostTypes[index];
        ghost.x = type.x;
        ghost.y = type.y;
        ghost.direction = 0;
        ghost.scared = false;
        ghost.eaten = false;
      });
    }

    function spawnFruit() {
      if (!fruit && Math.random() < 0.001) {
        const emptyTiles = [];
        for (let y = 0; y < mapHeight; y++) {
          for (let x = 0; x < mapWidth; x++) {
            if (map[y][x] === 0) {
              emptyTiles.push({ x, y });
            }
          }
        }
        if (emptyTiles.length > 0) {
          const randomTile =
            emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
          fruit = {
            x: (randomTile.x + 0.5) * tileSize,
            y: (randomTile.y + 0.5) * tileSize,
          };
        }
      }
    }

    function checkLevelComplete() {
      for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
          if (map[y][x] === 0 || map[y][x] === 3) {
            return false;
          }
        }
      }
      return true;
    }

    function nextLevel() {
      level++;
      resetPositions();
      map.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 2) {
            map[y][x] = 0;
          }
        });
      });
      ghosts.forEach((ghost) => {
        ghost.speed += 0.1;
      });
    }

    function drawStartScreen() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "yellow";
      ctx.font = "40px Arial";
      ctx.fillText("PAC-MAN", canvas.width / 2 - 80, canvas.height / 2 - 100);
      ctx.font = "20px Arial";
      ctx.fillText(
        "Press SPACE to start",
        canvas.width / 2 - 90,
        canvas.height / 2 + 50,
      );
    }

    function drawGameOverScreen() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "red";
      ctx.font = "40px Arial";
      ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2 - 50);
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(
        `Final Score: ${score}`,
        canvas.width / 2 - 60,
        canvas.height / 2 + 20,
      );
      ctx.fillText(
        "Press SPACE to restart",
        canvas.width / 2 - 90,
        canvas.height / 2 + 70,
      );
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (gameState) {
        case "start":
          drawStartScreen();
          break;
        case "playing":
          drawMaze();
          drawPacman();
          ghosts.forEach(drawGhost);
          drawFruit();
          drawScore();

          movePacman();
          ghosts.forEach(moveGhost);
          checkCollisions();
          spawnFruit();

          pacman.mouth = Math.abs(Math.sin(Date.now() * 0.1)) * 0.5 + 0.1;

          if (checkLevelComplete()) {
            nextLevel();
          }
          break;
        case "gameOver":
          drawGameOverScreen();
          break;
      }

      requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      switch (event.key) {
        case "ArrowLeft":
          pacman.nextDirection = Math.PI;
          break;
        case "ArrowRight":
          pacman.nextDirection = 0;
          break;
        case "ArrowUp":
          pacman.nextDirection = -Math.PI / 2;
          break;
        case "ArrowDown":
          pacman.nextDirection = Math.PI / 2;
          break;
        case " ":
          if (gameState === "start" || gameState === "gameOver") {
            gameState = "playing";
            resetPositions();
            score = 0;
            lives = 3;
            level = 1;
            sounds.start.play();
          }
          break;
      }
    });

    gameLoop();
  }
}

customElements.define("pacman-canvas", PacmanGame);
