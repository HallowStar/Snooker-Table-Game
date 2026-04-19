# Snooker-Table-Game

## Description

The Snooker-Table-Game is a physics-based simulation of a standard snooker game built using p5.js and the Matter.js physics engine. It features a realistic table environment where players can interact with a full set of balls, including one cue ball, fifteen reds, and six colored balls. The game balances precision and flexibility by offering both mouse and keyboard controls for aiming and moving the cue stick. Beyond standard gameplay, it includes a unique Temporal Rewind System that allows players to undo shots and analyze physics interactions in real-time.

## Features

### Table and Environment

Realistic Layout: The table features a brown wooden frame, a green playing surface, and six interactive pockets (holes).

Standard Markings: Includes a white line and a semi-circle (arc) defining the D Zone for cue ball placement.

Physics-Driven Cushions: The table is equipped with invisible physical walls and "cushions" that utilize Matter.js to ensure realistic ball bounces and restitution.

### Ball Management and Rules

Full Ball Set: Automatically initializes the cue ball, 15 red balls in a triangular formation, and the six colored balls (yellow, green, brown, blue, pink, and black) at their regulation spots.

Rule Enforcement: An integrated rules engine tracks the current target (red or color), validates pots, handles foul detection (e.g., potting the cue ball or hitting the wrong target), and manages the score.

Ball Respawning: Follows snooker regulations where colored balls are respawned to their initial positions if potted while red balls are still on the table.

### Control System

Precision Aiming: Players can rotate the cue stick by dragging its tip or using the "A" and "D" keys for fixed angular steps.

Movement: The cue stick can be repositioned using the mouse (with smooth linear interpolation) or the arrow keys.

Variable Power: A dedicated power bar allows players to control shot strength by dragging horizontally, which visually pulls the cue back before release.

Aiming Helper: A dashed guide line appears when the cue ball is stationary to help players visualize the trajectory of their shot.

### Gameplay Modes

Practice Mode: Reconfigures the table into training lines (vertical and horizontal) centered around the pink ball spot.

Randomize Reds: Scatters the red balls into three random clusters across the table for non-standard game starts.

### Unique Extension: Temporal Rewind

Time Manipulation: By holding the "R" key, players can trigger a rewind that restores the game state frame-by-frame.

Snapshot History: The system stores up to 600 frames (approx. 10 seconds) of data, including ball positions, visibility, and scores, allowing players to reverse mistakes or analyze collisions.
