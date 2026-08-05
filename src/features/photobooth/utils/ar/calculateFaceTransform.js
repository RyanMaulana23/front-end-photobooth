/**
 * Calculate smooth face landmarks, bounding box, rotation angle, and feature ratios.
 * Supports both MediaPipe landmarks array and procedural camera center detection.
 *
 * @param {Array|null} landmarks - Normalized 3D/2D landmarks from MediaPipe (468 points)
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @param {number} timestamp - Current frame timestamp in ms
 * @returns {object} Calculated face transform parameters
 */
export function calculateFaceTransform(landmarks, width, height, timestamp = 0) {
  if (landmarks && landmarks.length >= 468) {
    // 1. MediaPipe FaceMesh Index Map:
    // Forehead / Hairline: 10
    // Nose Tip: 1
    // Chin: 152
    // Left Eye: 33, Right Eye: 263
    // Left Temple / Ear: 234, Right Temple / Ear: 454
    // Upper Lip: 13, Lower Lip: 14
    // Left Lip Corner: 61, Right Lip Corner: 291
    // Left Eye Upper: 159, Left Eye Lower: 145
    // Right Eye Upper: 386, Right Eye Lower: 374

    const pForehead = landmarks[10];
    const pNose = landmarks[1];
    const pChin = landmarks[152];
    const pLeftEye = landmarks[33];
    const pRightEye = landmarks[263];
    const pLeftEar = landmarks[234];
    const pRightEar = landmarks[454];
    const pUpperLip = landmarks[13];
    const pLowerLip = landmarks[14];
    const pLeftCorner = landmarks[61];
    const pRightCorner = landmarks[291];

    const noseX = pNose.x * width;
    const noseY = pNose.y * height;

    const foreheadX = pForehead.x * width;
    const foreheadY = pForehead.y * height;

    const leftEyeX = pLeftEye.x * width;
    const leftEyeY = pLeftEye.y * height;
    const rightEyeX = pRightEye.x * width;
    const rightEyeY = pRightEye.y * height;

    // Calculate rotation angle relative to eye line
    const dx = rightEyeX - leftEyeX;
    const dy = rightEyeY - leftEyeY;
    const angle = Math.atan2(dy, dx);

    // Face dimensions
    const earDistance = Math.hypot(pRightEar.x - pLeftEar.x, pRightEar.y - pLeftEar.y) * width;
    const faceWidth = Math.max(earDistance, 100);
    const faceHeight = Math.hypot(pChin.x - pForehead.x, pChin.y - pForehead.y) * height;

    // Mouth openness
    const lipDistance = Math.hypot(pLowerLip.x - pUpperLip.x, pLowerLip.y - pUpperLip.y) * height;
    const mouthOpenRatio = Math.min(Math.max(lipDistance / (faceHeight * 0.22 || 1), 0), 1);

    // Smile confidence ratio (lip corner distance vs eye distance)
    const mouthWidth = Math.hypot(pRightCorner.x - pLeftCorner.x, pRightCorner.y - pLeftCorner.y) * width;
    const eyeDistance = Math.hypot(dx, dy);
    const smileRatio = Math.min(Math.max((mouthWidth / (eyeDistance || 1) - 0.7) * 2.5, 0), 1);

    // Eye wink detection
    const leftEyeHeight = Math.hypot(landmarks[159].x - landmarks[145].x, landmarks[159].y - landmarks[145].y) * height;
    const rightEyeHeight = Math.hypot(landmarks[386].x - landmarks[374].x, landmarks[386].y - landmarks[374].y) * height;
    const leftWink = leftEyeHeight < 4 && rightEyeHeight > 8;
    const rightWink = rightEyeHeight < 4 && leftEyeHeight > 8;

    return {
      isValid: true,
      centerX: (leftEyeX + rightEyeX) / 2,
      centerY: (leftEyeY + rightEyeY) / 2,
      foreheadX,
      foreheadY,
      noseX,
      noseY,
      faceWidth,
      faceHeight,
      angle,
      mouthOpenRatio,
      smileRatio,
      leftWink,
      rightWink,
    };
  }

  // 2. Procedural Fallback Transform (when face mesh is loading or simulated)
  const time = timestamp * 0.002;
  const centerX = width * 0.5 + Math.sin(time) * 15;
  const centerY = height * 0.42 + Math.cos(time * 0.7) * 10;
  const faceWidth = Math.min(width, height) * 0.45;
  const faceHeight = faceWidth * 1.3;

  return {
    isValid: false,
    centerX,
    centerY,
    foreheadX: centerX,
    foreheadY: centerY - faceHeight * 0.38,
    noseX: centerX,
    noseY: centerY + faceHeight * 0.05,
    faceWidth,
    faceHeight,
    angle: Math.sin(time * 0.5) * 0.04,
    mouthOpenRatio: (Math.sin(time * 2) + 1) * 0.3,
    smileRatio: (Math.cos(time) + 1) * 0.4,
    leftWink: false,
    rightWink: false,
  };
}
