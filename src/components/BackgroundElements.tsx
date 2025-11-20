// src/components/BackgroundElements.tsx

import { motion } from "framer-motion";

const LEAF_TYPES = ["🌿", "🍃", "☘️", "🌱"];

// --- GENERATE DATA OUTSIDE THE COMPONENT ---
// This runs once when the page loads.
// It creates a stable, static array of random leaves.
// This satisfies React's strict "Purity" rules completely.
const leaves = Array.from({ length: 20 }).map((_, i) => {
  const initialX = Math.random() * 100;
  return {
    id: i,
    emoji: LEAF_TYPES[Math.floor(Math.random() * LEAF_TYPES.length)],
    initialX: initialX,
    targetX: initialX + (Math.random() * 20 - 10), // Sway range
    initialY: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    scale: Math.random() * 0.5 + 0.5,
  };
});

export default function BackgroundElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* The component just maps the pre-calculated array. Zero calculation during render. */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-4xl"
          initial={{
            opacity: 0,
            x: `${leaf.initialX}vw`,
            y: "110vh",
            rotate: 0,
          }}
          animate={{
            opacity: [0, 0.4, 0],
            y: "-10vh",
            x: [`${leaf.initialX}vw`, `${leaf.targetX}vw`],
            rotate: 360,
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            scale: leaf.scale,
          }}
        >
          {leaf.emoji}
        </motion.div>
      ))}

      {/* Static Background Elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-5 text-green-800 select-none">
        🌿
      </div>
      <div className="absolute top-20 right-20 text-7xl opacity-5 text-green-700 rotate-45 select-none">
        🍃
      </div>
      <div className="absolute bottom-40 left-20 text-8xl opacity-5 text-emerald-800 -rotate-12 select-none">
        ☘️
      </div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-5 text-green-900 rotate-90 select-none">
        🌱
      </div>
      <div className="absolute top-1/2 left-1/3 text-9xl opacity-[0.03] text-green-600 rotate-12 blur-sm select-none">
        🌿
      </div>
    </div>
  );
}
