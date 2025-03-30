// Define interfaces to avoid circular dependencies or keep constants cleaner

export interface Theme {
  name: string;
  COLOR_BACKGROUND: string; COLOR_BACKGROUND_GRAD_STOP?: string; COLOR_BACKGROUND_GRID: string; COLOR_GROUND_BOTTOM: string; COLOR_GROUND_TOP: string;
  COLOR_PLAYER_BODY: string; COLOR_PLAYER_DETAIL: string; COLOR_PLAYER_GLOW: string;
  COLOR_OBSTACLE_SPIKE: string; COLOR_OBSTACLE_BLOCK: string; COLOR_OBSTACLE_GEAR_OUTER: string; COLOR_OBSTACLE_GEAR_INNER: string; COLOR_OBSTACLE_PLATFORM: string; COLOR_OBSTACLE_GLOW: string;
  COLOR_OBSTACLE_SAWBLADE: string; COLOR_OBSTACLE_SAWBLADE_INNER: string; COLOR_OBSTACLE_SAWBLADE_GLOW: string;
  COLOR_OBSTACLE_CRUSHER_BODY: string; COLOR_OBSTACLE_CRUSHER_DETAIL: string; COLOR_OBSTACLE_CRUSHER_GLOW: string;
  COLOR_OBSTACLE_LASER_BEAM: string; COLOR_OBSTACLE_LASER_WARNING: string; COLOR_OBSTACLE_LASER_GLOW: string;
  COLOR_ENEMY_BAT_BODY: string; COLOR_ENEMY_BAT_WING: string; COLOR_ENEMY_BAT_GLOW: string;
  COLOR_ENEMY_SHOOTER_BODY: string; COLOR_ENEMY_SHOOTER_EYE: string; COLOR_ENEMY_SHOOTER_GLOW: string;
  COLOR_ENV_FIRE1: string; COLOR_ENV_FIRE2: string;
  COLOR_ENV_WATERFALL1: string; COLOR_ENV_WATERFALL2: string; COLOR_ENV_WATERFALL_SPRAY: string;
  COLOR_ENV_LAVA1: string; COLOR_ENV_LAVA2: string; COLOR_ENV_LAVA_GLOW: string;
  COLOR_ENV_RAIN: string; COLOR_ENV_CLOUD: string;
  COLOR_ENEMY_COW_BODY: string; COLOR_ENEMY_COW_SPOTS: string; COLOR_ENEMY_COW_GLOW: string;
  COLOR_GROUND_GRASS?: string;
  COLOR_LETTER_BG: string; COLOR_LETTER_BORDER: string; COLOR_LETTER_TEXT: string; COLOR_LETTER_SENDER: string; COLOR_LETTER_X: string;
  COLOR_UI_SCORE_TEXT: string; COLOR_UI_SCORE_SHADOW: string; COLOR_UI_MESSAGE_TEXT: string; COLOR_UI_GAMEOVER_TEXT: string; COLOR_UI_GAMEOVER_BORDER: string; COLOR_UI_GAMEOVER_SHADOW: string;
  // <<< Add Bonus UI Colors >>>
  COLOR_UI_BONUS_BG: string; COLOR_UI_BONUS_BORDER: string; COLOR_UI_BONUS_TEXT: string; COLOR_UI_BONUS_NAME: string; COLOR_UI_BONUS_DESC: string; COLOR_UI_BONUS_SELECTED_BG: string;
}

export interface Entity {
  type: any; // Use specific EntityType enum where possible
  x: number;
  y: number;
  width: number;
  height: number;
  toBeRemoved: boolean;
  update(gameSpeed: number, frameCount: number, player?: any, entities?: Entity[], difficultyLevel?: number): void; // Add difficultyLevel
  draw(ctx: CanvasRenderingContext2D, frameCount: number, theme: Theme): void;
  isOffScreen(): boolean;
}

// Specific type for obstacles used in collision/landing checks
export interface Obstacle extends Entity {
  // Obstacles might have specific properties, but Entity covers the basics
}

// Structure for player hitbox passed to checkCollision
export interface PlayerHitbox {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Structure for bonus choice hit areas
export interface BonusChoiceArea {
    x: number;
    y: number;
    width: number;
    height: number;
    bonus: any; // Use BonusOption type
}
