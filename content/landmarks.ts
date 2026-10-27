// Pose landmark index 0–32 (Database 04.5).
// These are the standard MediaPipe Pose names, added during design; check
// them against the release's data dictionary.
// TODO: confirm against the release data dictionary.

export const landmarks = [
  "nose", "left_eye_inner", "left_eye", "left_eye_outer", "right_eye_inner",
  "right_eye", "right_eye_outer", "left_ear", "right_ear", "mouth_left",
  "mouth_right", "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
  "left_wrist", "right_wrist", "left_pinky", "right_pinky", "left_index",
  "right_index", "left_thumb", "right_thumb", "left_hip", "right_hip",
  "left_knee", "right_knee", "left_ankle", "right_ankle", "left_heel",
  "right_heel", "left_foot_index", "right_foot_index",
] as const

/** Torso landmarks, marked with an accent square in the index. */
export const torsoLandmarks: readonly number[] = [11, 12, 23, 24]
