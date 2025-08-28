/**
 * Calculate the required pipette tilt angle to keep the pipette vertical (pointing downwards)
 * 
 * The pipette should always point straight down regardless of the arm configuration.
 * This function calculates the J4 angle needed to compensate for the cumulative rotations
 * of joints J1, J2, and J3.
 * 
 * @param j1 - Shoulder pitch angle in degrees
 * @param j2 - Elbow pitch angle in degrees  
 * @param j3 - Wrist pitch angle in degrees
 * @returns The required J4 angle in degrees to keep pipette vertical
 */
export function calculateVerticalPipetteTilt(j1: number, j2: number, j3: number): number {
  // The pipette should point straight down (90 degrees from horizontal)
  // We need to compensate for the cumulative pitch rotations of J1, J2, and J3
  
  // Sum all the pitch rotations that affect the pipette orientation
  const cumulativePitch = j1 + j2 + j3;
  
  // To keep the pipette vertical (pointing down), J4 needs to counter
  // the cumulative pitch and ensure the final orientation is 90 degrees
  const requiredJ4 = 90 - cumulativePitch;
  
  return requiredJ4;
}
