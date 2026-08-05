# DSC Photobooth
# AR Filter Visual Specification

Version: 1.0

---

# Purpose

This document defines the visual behavior, animation rules, tracking quality, and user experience for the AR Face Filter system used in DSC Photobooth.

This document complements `filter-implementation.md`.

If any conflict exists, implementation details should follow `filter-implementation.md`, while visual behavior should follow this specification.

---

# Design Goal

The AR Filter experience should feel premium and comparable to commercial mobile applications.

Visual quality should resemble:

- Instagram Story AR Filters
- Snapchat Premium Lenses
- TikTok Face Effects
- Snow Camera
- B612 Camera
- Meitu

The objective is NOT to place static PNG images over the face.

The objective is to create a natural real-time AR experience.

---

# General Requirements

Every AR filter must:

- Follow the user's face smoothly.
- Scale automatically according to face size.
- Rotate naturally with head movement.
- Stay attached to facial landmarks.
- Work during preview, countdown, capture, preview result, and export.
- Produce identical visual results across every stage.

---

# Face Tracking

Use MediaPipe Face Landmarker.

Track the following facial landmarks:

- Forehead
- Left Eye
- Right Eye
- Nose Tip
- Nose Bridge
- Left Cheek
- Right Cheek
- Mouth
- Chin
- Face Contour

Tracking quality must remain stable even while the user moves.

Avoid:

- Flickering
- Shaking
- Sudden jumps
- Incorrect scaling
- Incorrect rotation

Use temporal smoothing to stabilize landmark positions.

---

# Hearts Filter

## Reference

Instagram Hearts Filter

Snapchat Love Crown

Snow Hearts Effect

---

## Appearance

Display a floating heart crown above the user's forehead.

The crown consists of:

- 9–12 pink hearts
- Various sizes
- Slight random rotation
- Soft glow
- Soft shadow
- High-resolution transparent PNG

The heart crown must never overlap the user's forehead or hair.

---

## Position

The heart crown should be positioned:

- Above the forehead
- Centered horizontally
- Approximately 12–18% above the face

Automatically reposition when:

- User moves
- User rotates head
- User tilts head
- User changes distance from camera

---

## Animation

Every heart should animate independently.

Supported animations:

- Floating
- Scale breathing
- Fade in
- Fade out
- Slight rotation
- Smooth easing

Animation should loop infinitely.

---

## Smile Interaction

When smile confidence exceeds the configured threshold:

Increase:

- Heart glow
- Floating intensity
- Sparkle amount

Do not overreact to small smiles.

---

## Capture Animation

When the capture button is pressed:

Generate a burst of heart particles.

The burst should:

- Expand outward
- Fade naturally
- Rotate slightly
- Disappear smoothly

The animation must not delay photo capture.

---

# Dog Filter

## Reference

Snapchat Dog Lens

Instagram Puppy Filter

TikTok Dog Effect

---

## Components

- Left Ear
- Right Ear
- Dog Nose
- Tongue
- Optional Freckles

---

## Dog Ears

Dog ears must:

- Attach above the forehead
- Rotate with head movement
- Scale with face size
- Bounce gently while moving

They should feel soft and natural.

---

## Dog Nose

The dog nose should:

Attach directly to the nose tip.

Requirements:

- Perfect alignment
- Correct rotation
- Correct scaling
- No visible gap

---

## Tongue

Only appears when the mouth opens.

When the mouth closes:

Hide smoothly.

Animation:

- Bounce
- Elastic easing
- Natural movement

---

# Smile Detection

Detect smile confidence continuously.

When smiling:

- Increase sparkle intensity
- Slightly brighten the face
- Optional beauty enhancement

Avoid false positives.

---

# Wink Detection

Track each eye independently.

Left wink

↓

Spawn hearts.

Right wink

↓

Spawn sparkles.

Ignore normal blinking.

---

# Mouth Open Detection

Continuously monitor mouth openness.

When mouth opens:

Dog Filter

↓

Show tongue.

Hearts Filter

↓

Increase floating animation.

---

# Sakura Filter

Optional filter.

Display:

- Falling sakura petals
- Bloom effect
- Slow rotation
- Soft transparency

Particles should continuously respawn.

---

# Glitter Filter

Optional filter.

Display:

- White sparkles
- Gold sparkles
- Glow particles

Animation:

- Fade
- Float
- Rotate

---

# Beauty Enhancement

Optional.

Very lightweight.

Effects:

- Smooth skin
- Slight brightness
- Slight contrast
- Natural skin tone

Avoid making the face appear artificial.

---

# Particle System

The AR engine should provide a reusable particle engine.

Each particle contains:

- Position
- Velocity
- Rotation
- Scale
- Opacity
- Lifetime

Supported particles:

- Hearts
- Sparkles
- Glitter
- Sakura
- Confetti

Future filters should reuse this system.

---

# Animation Quality

Use requestAnimationFrame().

Avoid CSS-only animations.

Support:

- Floating
- Fade
- Bounce
- Rotation
- Scale
- Elastic easing

Animations must remain smooth at:

Desktop

60 FPS

Mobile

30 FPS

---

# Capture Consistency

The exported photo must look exactly the same as the live preview.

No differences are allowed between:

Camera Preview

↓

Countdown

↓

Captured Image

↓

Preview

↓

Photo Strip

↓

Downloaded Image

---

# Asset Quality

All overlay assets must satisfy:

PNG

Transparent Background

Minimum Resolution

2048 x 2048

No white edges

Anti-aliased

Professional quality artwork

---

# Device Compatibility

Support:

Desktop

Laptop

Android

iPhone

Tablet

iPad

Portrait and Landscape orientation must both work correctly.

---

# Future AR Filters

The rendering engine should be extensible.

Future filters may include:

🐰 Bunny

🐱 Cat

👑 Princess Crown

🕶 Sunglasses

🎅 Santa

👻 Halloween

🎄 Christmas

💍 Wedding

🪽 Angel Wings

🌈 Rainbow

Adding a new filter should only require creating a new module.

The rendering engine must not require modification.

---

# Acceptance Criteria

Implementation is complete only if:

✔ Hearts remain attached above the forehead.

✔ Dog ears stay aligned during movement.

✔ Dog nose perfectly follows the nose.

✔ Tongue appears only when the mouth opens.

✔ Smile increases sparkle intensity.

✔ Left wink spawns hearts.

✔ Right wink spawns sparkles.

✔ Heart burst plays during capture.

✔ Sakura and glitter animate naturally.

✔ Preview and exported image are visually identical.

✔ No flickering.

✔ No lag.

✔ No jitter.

✔ Stable head tracking.

✔ Existing image filters continue working.

✔ Existing photobooth workflow remains unchanged.

✔ New AR filters can be added without changing the rendering engine.

---

# Final Objective

Deliver a production-ready AR Face Filter system that provides users with a premium, responsive, smooth, and modern photobooth experience comparable to leading social media camera applications.