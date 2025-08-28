'use client';

import { useState } from "react";
import ThreeScene from "@/components/arm";
import { ArmControl } from "@/components/slider";

type JointAngles = {
  j0: number;  // yaw
  j1: number;  // pitch
  j2: number;  // pitch
  j3: number;  // pitch
  // j4 is calculated automatically to keep pipette vertical
};

export default function Home() {
  const [jointAngles, setJointAngles] = useState<JointAngles>({
    j0: 0,
    j1: -60,
    j2: 20,
    j3: 30
  });

  return (
    <>
      <ArmControl onJointChange={setJointAngles} />
      <ThreeScene className="scene" jointAngles={jointAngles} />
    </>
  );
}
