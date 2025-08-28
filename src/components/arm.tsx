'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
}

// Robot arm dimensions in meters (1 cm = 0.01 m)
const DIMENSIONS = {
  base: { radius: 0.25, height: 0.20 }, // Ø=50cm, H=20cm
  segment1: { width: 0.10, height: 0.10, length: 0.60 }, // 10×10×60cm
  segment2: { width: 0.08, height: 0.08, length: 0.45 }, // 8×8×45cm
  segment3: { width: 0.06, height: 0.06, length: 0.25 }, // 6×6×25cm
  segment4: { radius: 0.01, height: 0.10 }, // Ø=2cm, H=10cm (pipette)
  joints: {
    shoulder: 0.06, // 6cm radius
    elbow: 0.05,    // 5cm radius
    wrist: 0.04,    // 4cm radius
    pipette: 0.015  // 1.5cm radius
  }
};

// Home pose angles in degrees
const HOME_POSE = {
  j0: 0,    // base yaw
  j1: -60,  // shoulder pitch (negative to lift up)
  j2: 20,  // elbow pitch (negative to fold upward)
  j3: 30,  // wrist pitch (negative to point forward)
  j4: 90     // pipette tilt (straight)
};

export default function ThreeScene({ className = '' }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mountRef.current) return;

    // Helper function to convert degrees to radians
    const degToRad = (degrees: number) => degrees * Math.PI / 180;

    const container = mountRef.current;
    const { clientWidth: width, clientHeight: height } = container;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(1.6, 1.1, 1.8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add renderer to DOM
    container.appendChild(renderer.domElement);

    // Function to create robot arm
    const createRobotArm = (scene: THREE.Scene) => {
      const armGroup = new THREE.Group();
      
      // Materials
      const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray
      const segment1Material = new THREE.MeshStandardMaterial({ color: 0x909090 }); // Light gray
      const segment2Material = new THREE.MeshStandardMaterial({ color: 0x707070 }); // Medium gray
      const segment3Material = new THREE.MeshStandardMaterial({ color: 0x606060 }); // Dark gray
      const pipetteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White
      const jointMaterial = new THREE.MeshStandardMaterial({ color: 0x404040 }); // Dark gray
      
      // Base (cylinder) - bottom rests on ground
      const baseGeometry = new THREE.CylinderGeometry(
        DIMENSIONS.base.radius, 
        DIMENSIONS.base.radius, 
        DIMENSIONS.base.height, 
        16
      );
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = DIMENSIONS.base.height / 2; // Bottom rests on ground
      base.castShadow = true;
      base.receiveShadow = true;
      armGroup.add(base);
      
      // J0 (base yaw) - rotation around Y axis
      const j0Group = new THREE.Group();
      j0Group.position.y = DIMENSIONS.base.height;
      j0Group.rotation.y = degToRad(HOME_POSE.j0);
      base.add(j0Group);
      
      // Shoulder joint sphere
      const shoulderJointGeometry = new THREE.SphereGeometry(DIMENSIONS.joints.shoulder, 12, 8);
      const shoulderJoint = new THREE.Mesh(shoulderJointGeometry, jointMaterial);
      shoulderJoint.castShadow = true;
      j0Group.add(shoulderJoint);
      
      // J1 (shoulder pitch) - rotation around X axis
      const j1Group = new THREE.Group();
      j1Group.rotation.x = degToRad(HOME_POSE.j1);
      shoulderJoint.add(j1Group);
      
      // Segment 1 (shoulder link)
      const segment1Geometry = new THREE.BoxGeometry(
        DIMENSIONS.segment1.width,
        DIMENSIONS.segment1.height,
        DIMENSIONS.segment1.length
      );
      const segment1 = new THREE.Mesh(segment1Geometry, segment1Material);
      segment1.position.z = DIMENSIONS.segment1.length / 2;
      segment1.castShadow = true;
      segment1.receiveShadow = true;
      j1Group.add(segment1);
      
      // Elbow joint sphere
      const elbowJointGeometry = new THREE.SphereGeometry(DIMENSIONS.joints.elbow, 12, 8);
      const elbowJoint = new THREE.Mesh(elbowJointGeometry, jointMaterial);
      elbowJoint.position.z = DIMENSIONS.segment1.length;
      elbowJoint.castShadow = true;
      j1Group.add(elbowJoint);
      
      // J2 (elbow pitch) - rotation around X axis
      const j2Group = new THREE.Group();
      j2Group.position.z = DIMENSIONS.segment1.length;
      j2Group.rotation.x = degToRad(HOME_POSE.j2);
      j1Group.add(j2Group);
      
      // Segment 2 (elbow link)
      const segment2Geometry = new THREE.BoxGeometry(
        DIMENSIONS.segment2.width,
        DIMENSIONS.segment2.height,
        DIMENSIONS.segment2.length
      );
      const segment2 = new THREE.Mesh(segment2Geometry, segment2Material);
      segment2.position.z = DIMENSIONS.segment2.length / 2;
      segment2.castShadow = true;
      segment2.receiveShadow = true;
      j2Group.add(segment2);
      
      // Wrist joint sphere
      const wristJointGeometry = new THREE.SphereGeometry(DIMENSIONS.joints.wrist, 12, 8);
      const wristJoint = new THREE.Mesh(wristJointGeometry, jointMaterial);
      wristJoint.position.z = DIMENSIONS.segment2.length;
      wristJoint.castShadow = true;
      j2Group.add(wristJoint);
      
      // J3 (wrist pitch) - rotation around X axis
      const j3Group = new THREE.Group();
      j3Group.position.z = DIMENSIONS.segment2.length;
      j3Group.rotation.x = degToRad(HOME_POSE.j3);
      j2Group.add(j3Group);
      
      // Segment 3 (wrist link)
      const segment3Geometry = new THREE.BoxGeometry(
        DIMENSIONS.segment3.width,
        DIMENSIONS.segment3.height,
        DIMENSIONS.segment3.length
      );
      const segment3 = new THREE.Mesh(segment3Geometry, segment3Material);
      segment3.position.z = DIMENSIONS.segment3.length / 2;
      segment3.castShadow = true;
      segment3.receiveShadow = true;
      j3Group.add(segment3);
      
      // Pipette joint sphere
      const pipetteJointGeometry = new THREE.SphereGeometry(DIMENSIONS.joints.pipette, 8, 6);
      const pipetteJoint = new THREE.Mesh(pipetteJointGeometry, jointMaterial);
      pipetteJoint.position.z = DIMENSIONS.segment3.length;
      pipetteJoint.castShadow = true;
      j3Group.add(pipetteJoint);
      
      // J4 (pipette tilt) - rotation around X axis
      const j4Group = new THREE.Group();
      j4Group.position.z = DIMENSIONS.segment3.length;
      j4Group.rotation.x = degToRad(HOME_POSE.j4);
      j3Group.add(j4Group);
      
      // Segment 4 (pipette)
      const segment4Geometry = new THREE.CylinderGeometry(
        DIMENSIONS.segment4.radius,
        DIMENSIONS.segment4.radius,
        DIMENSIONS.segment4.height,
        8
      );
      const segment4 = new THREE.Mesh(segment4Geometry, pipetteMaterial);
      segment4.position.z = DIMENSIONS.segment4.height / 2;
      segment4.rotation.x = Math.PI / 2; // Orient cylinder along Z axis
      segment4.castShadow = true;
      segment4.receiveShadow = true;
      j4Group.add(segment4);
      
      scene.add(armGroup);
      return armGroup;
    };

    // Create robot arm
    createRobotArm(scene);

    // Add lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    scene.add(directionalLight);

    // Add ground grid
    const gridHelper = new THREE.GridHelper(4, 40, 0x888888, 0xcccccc);
    scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(0.2);
    scene.add(axesHelper);

    // Render function
    const render = () => {
      renderer.render(scene, camera);
    };

    // Initial render
    render();

    // Cleanup function
    return () => {
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      renderer.dispose();
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div>
        <span>Loading 3D Scene...</span>
      </div>
    );
  }

  return <div ref={mountRef} className={className} />;
}