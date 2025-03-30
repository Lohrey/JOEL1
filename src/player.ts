import * as C from './constants';
import { Obstacle, PlayerHitbox } from './interfaces'; // Import interfaces
import { Theme, EntityType } from './constants'; // Import Theme and CORRECT Enum type

export class Player {
  x: number; y: number; width: number; height: number; velocityY: number;
  isJumping: boolean; onGround: boolean; rotation: number; jumpsLeft: number;

  // <<< Add properties for bonuses >>>
  originalWidth: number;
  originalHeight: number;
  originalMaxJumps: number;
  isInvincible: boolean = false;
  maxJumps: number; // Use this instead of C.MAX_JUMPS directly

  constructor() {
    this.originalWidth = C.PLAYER_SIZE;
    this.originalHeight = C.PLAYER_SIZE;
    this.width = this.originalWidth;
    this.height = this.originalHeight;
    this.x = C.PLAYER_INITIAL_X;
    this.y = C.GROUND_Y - this.height;
    this.velocityY = 0;
    this.isJumping = false;
    this.onGround = true;
    this.rotation = 0;
    this.originalMaxJumps = C.MAX_JUMPS;
    this.maxJumps = this.originalMaxJumps; // Initialize maxJumps
    this.jumpsLeft = this.maxJumps;
  }

  jump() {
    // <<< Use this.maxJumps >>>
    if (this.jumpsLeft > 0) {
      this.velocityY = -C.JUMP_VELOCITY;
      this.isJumping = true;
      this.onGround = false;
      this.jumpsLeft--;
    }
  }

  land(surfaceY: number) {
    if (this.y + this.height > surfaceY) {
      this.y = surfaceY - this.height;
    }
    this.velocityY = 0;
    this.isJumping = false;
    this.onGround = true;
    this.jumpsLeft = this.maxJumps; // <<< Reset jumps based on current maxJumps >>>
    this.rotation = Math.round(this.rotation / (Math.PI / 2)) * (Math.PI / 2);
  }

  update(obstacles: Obstacle[]) {
    this.velocityY += C.GRAVITY;
    const nextY = this.y + this.velocityY;
    let landedOnPlatform = false;

    // Platform collision check (only when moving down)
    if (this.velocityY > 0) {
      for (const obstacle of obstacles) {
        // Check if it's a platform type
        if (obstacle.type === EntityType.PLATFORM || obstacle.type === EntityType.MOVING_PLATFORM) {
          const horizontalOverlap = this.x < obstacle.x + obstacle.width && this.x + this.width > obstacle.x;
          const verticalLanding = this.y + this.height <= obstacle.y + 1 && // Allow landing slightly inside
                                nextY + this.height >= obstacle.y;

          if (horizontalOverlap && verticalLanding) {
            this.land(obstacle.y);
            landedOnPlatform = true;
            break;
          }
        }
      }
    }

    // Apply gravity if not landed on a platform
    if (!landedOnPlatform) {
      this.y = nextY;
      const groundSurfaceY = C.GROUND_Y;
      if (this.y + this.height >= groundSurfaceY) {
        this.land(groundSurfaceY);
      } else {
        this.onGround = false;
      }
    }

    // Rotation logic
    if (!this.onGround) {
      this.rotation += C.PLAYER_ROTATION_SPEED;
    } else {
      // Snap rotation to nearest 90 degrees when on ground
      this.rotation = Math.round(this.rotation / (Math.PI / 2)) * (Math.PI / 2);
    }
  }

  draw(ctx: CanvasRenderingContext2D, theme: Theme) {
    ctx.save();
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);

    // <<< Add invincibility visual >>>
    if (this.isInvincible) {
      ctx.globalAlpha = C.PLAYER_INVINCIBILITY_ALPHA;
      ctx.shadowColor = '#FFFFFF'; // White glow for invincibility
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowColor = theme.COLOR_PLAYER_GLOW;
      ctx.shadowBlur = 15;
    }

    ctx.fillStyle = theme.COLOR_PLAYER_BODY;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Reset shadow and alpha for details
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0; // Reset alpha

    // Draw details (eyes, border)
    ctx.fillStyle = theme.COLOR_PLAYER_DETAIL;
    const eyeSize = this.width * 0.15;
    const eyeOffsetX = this.width * 0.18;
    const eyeOffsetY = -this.height * 0.1;
    ctx.fillRect(-eyeOffsetX - eyeSize / 2, eyeOffsetY - eyeSize / 2, eyeSize, eyeSize);
    ctx.fillRect(eyeOffsetX - eyeSize / 2, eyeOffsetY - eyeSize / 2, eyeSize, eyeSize);

    ctx.strokeStyle = theme.COLOR_PLAYER_DETAIL;
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();
  }

  // --- Bonus Methods ---
  setTiny(isTiny: boolean) {
    if (isTiny) {
      this.width = this.originalWidth * C.PLAYER_TINY_SCALE;
      this.height = this.originalHeight * C.PLAYER_TINY_SCALE;
      // Adjust position slightly to prevent falling through floor on shrink
      this.y += this.originalHeight * (1 - C.PLAYER_TINY_SCALE);
    } else {
      // Check if resizing would push player below ground/platform before resizing
      const potentialY = this.y - (this.originalHeight - this.height);
       if (potentialY + this.originalHeight < C.GROUND_Y) { // Basic check, platform check is complex here
           this.y = potentialY;
       }
      this.width = this.originalWidth;
      this.height = this.originalHeight;
    }
  }

  setInvincible(invincible: boolean) {
    this.isInvincible = invincible;
  }

  setMaxJumps(count: number) {
    this.maxJumps = count;
    // If player has more jumps left than the new max, cap it
    this.jumpsLeft = Math.min(this.jumpsLeft, this.maxJumps);
  }

  resetMaxJumps() {
    this.setMaxJumps(this.originalMaxJumps);
  }

  // Getter for hitbox generation
  getHitbox(): PlayerHitbox {
    const hitboxPadding = this.width * 0.1; // Padding based on current size
    return {
      x: this.x + hitboxPadding,
      y: this.y + hitboxPadding,
      width: this.width - hitboxPadding * 2,
      height: this.height - hitboxPadding * 2,
    };
  }

  get size(): number { return this.width; } // Keep getter if used elsewhere
}
