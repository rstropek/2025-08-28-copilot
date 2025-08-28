'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ThreeScene from "@/components/arm";

export default function Home() {
  return (
    <>
      <ThreeScene className="scene" />
    </>
  );
}
