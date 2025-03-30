import * as C from './constants';
import { Theme, EntityType } from './constants';
import { randomInt } from './utils';
import { Entity, Bat, Shooter, LavaPit, RainCloud, Cow, TripleSpike, BlockStack, FloatingGear, MovingPlatform, SawBlade, Crusher, LaserBeam } from './entities';
import { Player } from './player';
import { Obstacle } from './interfaces'; // Import interface

// --- Obstacle/Enemy Classes (Copied from entities.ts - Unchanged) ---
// Basic Obstacles
class SpikeObstacle implements Obstacle { type = EntityType.SPIKE; x: number; y: number; width: number; height: number; toBeRemoved = false; constructor() { this.width = C.SPIKE_BASE_WIDTH; this.height = C.SPIKE_HEIGHT; this.x = C.GAME_WIDTH; this.y = C.GROUND_Y - this.height; } update(gameSpeed: number) { this.x -= gameSpeed; if(this.isOffScreen()) this.toBeRemoved = true; } draw(ctx: CanvasRenderingContext2D, frameCount: number, theme: Theme) { ctx.shadowColor = theme.COLOR_OBSTACLE_GLOW; ctx.shadowBlur = 10; ctx.fillStyle = theme.COLOR_OBSTACLE_SPIKE; ctx.beginPath(); ctx.moveTo(this.x, this.y + this.height); ctx.lineTo(this.x + this.width / 2, this.y); ctx.lineTo(this.x + this.width, this.y + this.height); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.moveTo(this.x + this.width * 0.15, this.y + this.height); ctx.lineTo(this.x + this.width / 2, this.y + this.height * 0.3); ctx.lineTo(this.x + this.width * 0.85, this.y + this.height); ctx.closePath(); ctx.fill(); } isOffScreen(): boolean { return this.x + this.width < 0; } }
class BlockObstacle implements Obstacle { type = EntityType.BLOCK; x: number; y: number; width: number; height: number; toBeRemoved = false; constructor() { this.width = randomInt(C.BLOCK_SIZE_MIN, C.BLOCK_SIZE_MAX); this.height = this.width; this.x = C.GAME_WIDTH; this.y = C.GROUND_Y - this.height; } update(gameSpeed: number) { this.x -= gameSpeed; if(this.isOffScreen()) this.toBeRemoved = true; } draw(ctx: CanvasRenderingContext2D, frameCount: number, theme: Theme) { ctx.shadowColor = theme.COLOR_OBSTACLE_GLOW; ctx.shadowBlur = 10; ctx.fillStyle = theme.COLOR_OBSTACLE_BLOCK; ctx.fillRect(this.x, this.y, this.width, this.height); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6); ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 2; ctx.strokeRect(this.x, this.y, this.width, this.height); } isOffScreen(): boolean { return this.x + this.width < 0; } }
class GearObstacle implements Obstacle { type = EntityType.GEAR; x: number; y: number; width: number; height: number; radius: number; rotation: number = 0; numTeeth: number = 12; toBeRemoved = false; constructor() { this.radius = C.GEAR_RADIUS; this.width = this.radius * 2; this.height = this.radius * 2; this.x = C.GAME_WIDTH; const onGround = Math.random() > 0.5; this.y = onGround ? C.GROUND_Y - this.height : C.GROUND_Y - this.height - randomInt(10, 40); } update(gameSpeed: number) { this.x -= gameSpeed; this.rotation += C.GEAR_ROTATION_SPEED; if(this.isOffScreen()) this.toBeRemoved = true; } draw(ctx: CanvasRenderingContext2D, frameCount: number, theme: Theme) { const centerX = this.x + this.radius; const centerY = this.y + this.radius; ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(this.rotation); ctx.shadowColor = theme.COLOR_OBSTACLE_GLOW; ctx.shadowBlur = 15; ctx.fillStyle = theme.COLOR_OBSTACLE_GEAR_OUTER; ctx.beginPath(); for (let i = 0; i < this.numTeeth; i++) { const angle = (i / this.numTeeth) * Math.PI * 2; const nextAngle = ((i + 0.5) / this.numTeeth) * Math.PI * 2; const outerX = Math.cos(angle) * this.radius; const outerY = Math.sin(angle) * this.radius; const innerX = Math.cos(nextAngle) * this.radius * 0.75; const innerY = Math.sin(nextAngle) * this.radius * 0.75; if (i === 0) { ctx.moveTo(outerX, outerY); } else { ctx.lineTo(outerX, outerY); } ctx.lineTo(innerX, innerY); } ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.fillStyle = theme.COLOR_OBSTACLE_GEAR_INNER; ctx.beginPath(); ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = theme.COLOR_OBSTACLE_GEAR_OUTER; ctx.beginPath(); ctx.arc(0, 0, this.radius * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } isOffScreen(): boolean { return this.x + this.width < 0; } }
class PlatformObstacle implements Obstacle { type = EntityType.PLATFORM; x: number; y: number; width: number; height: number; toBeRemoved = false; constructor() { this.width = randomInt(C.PLATFORM_MIN_WIDTH, C.PLATFORM_MAX_WIDTH); this.height = C.PLATFORM_HEIGHT; this.x = C.GAME_WIDTH; const yOffset = randomInt(C.PLATFORM_MIN_Y_OFFSET, C.PLATFORM_MAX_Y_OFFSET); this.y = C.GROUND_Y - yOffset - this.height; } update(gameSpeed: number) { this.x -= gameSpeed; if(this.isOffScreen()) this.toBeRemoved = true; } draw(ctx: CanvasRenderingContext2D, frameCount: number, theme: Theme) { ctx.shadowColor = theme.COLOR_OBSTACLE_GLOW; ctx.shadowBlur = 10; ctx.fillStyle = theme.COLOR_OBSTACLE_PLATFORM; ctx.fillRect(this.x, this.y, this.width, this.height); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6); ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 2; ctx.strokeRect(this.x, this.y, this.width, this.height); ctx.fillStyle = theme.COLOR_GROUND_TOP; ctx.fillRect(this.x, this.y, this.width, C.GROUND_LINE_THICKNESS); } isOffScreen(): boolean { return this.x + this.width < 0; } }
// More Complex Obstacles (Using imported classes now)
// class TripleSpike ... (now imported from entities)
// class BlockStack ... (now imported from entities)
// class FloatingGear ... (now imported from entities)
// class MovingPlatform ... (now imported from entities)
// class SawBlade ... (now imported from entities)
// class Crusher ... (now imported from entities)
// class LaserBeam ... (now imported from entities)
// Enemies/Environment (Using imported classes now)
// class Bat ... (now imported from entities)
// class Shooter ... (now imported from entities)
// class LavaPit ... (now imported from entities)
// class RainCloud ... (now imported from entities)
// class Cow ... (now imported from entities)


// --- Entity Factory Function ---
// <<< Add difficultyLevel parameter >>>
export function createEntity(
    existingEntities: Entity[],
    lastGroundEntityEndX: number,
    currentTheme: Theme,
    difficultyLevel: number // 0 = base, 1 = 1000+, 2 = 2000+, etc.
): Entity | null {

  // Gap / Lava Pit Generation Logic (Unchanged)
  const GAP_PROBABILITY = 0.20; const LAVA_PIT_PROBABILITY = 0.15; const MIN_GROUND_SEQUENCE_LENGTH = 120; const MIN_GAP_WIDTH = C.PLAYER_SIZE * 2; const MAX_GAP_WIDTH = C.PLAYER_SIZE * 4; const MIN_LAVA_WIDTH = C.LAVA_PIT_MIN_WIDTH; const MAX_LAVA_WIDTH = C.LAVA_PIT_MAX_WIDTH; const distanceSinceLastGround = C.GAME_WIDTH - lastGroundEntityEndX; let createHazard = false;
  if (distanceSinceLastGround > MIN_GROUND_SEQUENCE_LENGTH && distanceSinceLastGround < MAX_GAP_WIDTH * 1.5) { if (currentTheme.name === "Fiery Red" && Math.random() < LAVA_PIT_PROBABILITY) { const lavaWidth = randomInt(MIN_LAVA_WIDTH, MAX_LAVA_WIDTH); return new LavaPit(lavaWidth); } else if (Math.random() < GAP_PROBABILITY) { createHazard = true; } }
  if (createHazard) { return null; }

  // --- Entity Type Selection Based on Theme and Difficulty ---
  const baseGroundTypes = [EntityType.SPIKE, EntityType.BLOCK, EntityType.GEAR];
  const baseAirTypes = [EntityType.BAT, EntityType.PLATFORM];
  const mediumGroundTypes = [EntityType.TRIPLE_SPIKE, EntityType.BLOCK_STACK, EntityType.SAW_BLADE];
  const mediumAirTypes = [EntityType.FLOATING_GEAR, EntityType.MOVING_PLATFORM];
  const hardGroundTypes = [EntityType.CRUSHER];
  const hardAirTypes = [EntityType.LASER_BEAM]; // Laser is special, handled later

  let possibleTypes: EntityType[] = [...baseGroundTypes, ...baseAirTypes];

  // Add medium types based on difficulty
  if (difficultyLevel >= 1) {
      possibleTypes.push(...mediumGroundTypes, ...mediumAirTypes);
      // Increase probability of medium types slightly
      possibleTypes.push(...mediumGroundTypes); // Add them again
  }
  // Add hard types based on difficulty
  if (difficultyLevel >= 2) {
      possibleTypes.push(...hardGroundTypes, ...hardAirTypes);
      // Increase probability of hard types
      possibleTypes.push(...hardGroundTypes); // Add them again
      possibleTypes.push(...mediumGroundTypes); // Add medium again too
  }
   if (difficultyLevel >= 3) {
      // Further increase hard/medium probability
      possibleTypes.push(...hardGroundTypes, ...mediumAirTypes);
   }


  // Theme-specific additions/weighting (Can still apply on top)
  switch (currentTheme.name) {
      case "Lush Green":
          possibleTypes.push(EntityType.COW, EntityType.COW, EntityType.BLOCK_STACK); // More cows/stacks
          possibleTypes.push(EntityType.MOVING_PLATFORM);
          break;
      case "Blue/Orange":
          possibleTypes.push(EntityType.TRIPLE_SPIKE, EntityType.SAW_BLADE);
          possibleTypes.push(EntityType.RAIN_CLOUD, EntityType.FLOATING_GEAR);
          if (difficultyLevel >= 1) possibleTypes.push(EntityType.LASER_BEAM); // Laser in blue theme later
          break;
      case "Fiery Red":
          possibleTypes.push(EntityType.GEAR, EntityType.BLOCK_STACK, EntityType.CRUSHER, EntityType.SAW_BLADE); // More hazards
          possibleTypes.push(EntityType.BAT);
          if (difficultyLevel >= 2) possibleTypes.push(EntityType.LASER_BEAM); // Laser in red theme later
          break;
      // Default/Purple/RedCyan themes - rely more on difficulty scaling
  }

  // Add Shooter possibility (if a platform exists)
  let lastPlatform: Obstacle | null = null;
  for (let i = existingEntities.length - 1; i >= 0; i--) {
      if (existingEntities[i].type === EntityType.PLATFORM || existingEntities[i].type === EntityType.MOVING_PLATFORM) {
          lastPlatform = existingEntities[i] as Obstacle;
          break;
      }
  }
  // Add shooter more often at higher difficulty
  if (lastPlatform && lastPlatform.x + lastPlatform.width > C.SHOOTER_SIZE + 20) {
      if (difficultyLevel >= 1 && Math.random() < 0.3 + difficultyLevel * 0.1) { // Increase chance with difficulty
        possibleTypes.push(EntityType.SHOOTER);
      }
  }

  // Select final type
  if (possibleTypes.length === 0) return null; // Should not happen with base types
  let randomType = possibleTypes[randomInt(0, possibleTypes.length - 1)];

  // Prevent Immediate Overlap & Special Rules
  const lastEntity = existingEntities[existingEntities.length - 1];
  let minSpawnDistance = 80; // Default

  // Adjust min distance based on type
  if ([EntityType.GEAR, EntityType.BLOCK, EntityType.COW, EntityType.BLOCK_STACK, EntityType.SAW_BLADE].includes(randomType)) minSpawnDistance = 50;
  if ([EntityType.PLATFORM, EntityType.MOVING_PLATFORM].includes(randomType)) minSpawnDistance = 120;
  if ([EntityType.BAT, EntityType.RAIN_CLOUD, EntityType.FLOATING_GEAR].includes(randomType)) minSpawnDistance = 150;
  if (randomType === EntityType.TRIPLE_SPIKE) minSpawnDistance = 60;
  if (randomType === EntityType.CRUSHER) minSpawnDistance = C.CRUSHER_WIDTH + 60; // More space after crusher

  // Laser Beam specific rules
  if (randomType === EntityType.LASER_BEAM) {
      const existingLaser = existingEntities.find(e => e.type === EntityType.LASER_BEAM);
      if (existingLaser) return null; // Only one laser at a time
      minSpawnDistance = 0; // Laser doesn't need spacing from previous entity
  }

  // Check distance from last entity
  if (lastEntity && (C.GAME_WIDTH - (lastEntity.x + lastEntity.width)) < minSpawnDistance) {
      return null; // Too close, skip spawn this frame
  }

  // --- Create Selected Entity ---
  switch (randomType) {
    // Basic Obstacles
    case EntityType.SPIKE: return new SpikeObstacle();
    case EntityType.BLOCK: return new BlockObstacle();
    case EntityType.GEAR: return new GearObstacle();
    case EntityType.PLATFORM: return new PlatformObstacle();
    // Medium Obstacles
    case EntityType.TRIPLE_SPIKE: return new TripleSpike();
    case EntityType.BLOCK_STACK: return new BlockStack();
    case EntityType.FLOATING_GEAR: return new FloatingGear();
    case EntityType.MOVING_PLATFORM: return new MovingPlatform();
    case EntityType.SAW_BLADE: return new SawBlade();
    // Hard Obstacles
    case EntityType.CRUSHER: return new Crusher();
    case EntityType.LASER_BEAM: return new LaserBeam();
    // Enemies / Environment
    case EntityType.BAT: return new Bat();
    case EntityType.RAIN_CLOUD: return new RainCloud();
    case EntityType.COW: return new Cow();
    case EntityType.SHOOTER:
        // Spawn shooter on ground or last platform
        const spawnSurfaceY = (lastPlatform && Math.random() > 0.3) ? lastPlatform.y : C.GROUND_Y;
        const shooter = new Shooter(spawnSurfaceY);
        // If spawning on platform, ensure it's not right at the edge
        if (spawnSurfaceY !== C.GROUND_Y && lastPlatform) {
            shooter.x = Math.min(C.GAME_WIDTH, lastPlatform.x + lastPlatform.width - shooter.width - 10);
            shooter.x = Math.max(shooter.x, lastPlatform.x + 10); // Don't spawn hanging off left edge
        }
        return shooter;
    default:
        console.warn("Unknown entity type selected:", randomType);
        return null;
  }
}
