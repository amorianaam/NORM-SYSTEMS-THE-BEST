import React from "react";
import { motion } from "motion/react";
import { Search, Filter, Download, Activity, Network, Zap } from "lucide-react";

interface PaperVisualProps {
  category: string;
  insightId?: number; // Used for consistent random selection
  title?: string;
}

export default function PaperVisual({
  category,
  insightId = 0,
  title = "",
}: PaperVisualProps) {
  // Convert category to lowercase for exact match checks
  const cat = (category || "").toLowerCase();

  const isLogic = cat === "logic" || cat === "المنهجية";
  const isGovernance = cat === "governance" || cat === "الحوكمة";
  const isInvestment = cat === "investment" || cat === "الاستثمار";

  // If not one of the main 3, pick a generative shape based on ID or Title length
  const isCustom = !isLogic && !isGovernance && !isInvestment;

  // Create a simple deterministic number based on id or title string
  let seed = insightId;
  if (!seed && title) {
    seed = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }

  // Pick one of 6 abstract shapes (0 to 5)
  const shapeIndex = isCustom ? seed % 6 : -1;

  return (
    <div className="relative w-full h-48 mb-8 overflow-hidden rounded-2xl bg-void/[0.02] border border-void/5">
      <div className="absolute inset-0 bg-gradient-to-br from-magenta/5 to-transparent opacity-50" />

      {/* 1. Logic Shape */}
      {isLogic && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <svg className="w-full h-full opacity-20" viewBox="0 0 200 100">
            <motion.path
              d="M10 50 L190 50"
              stroke="var(--color-magenta)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {[20, 50, 80, 110, 140, 170].map((x, i) => (
              <motion.rect
                key={i}
                x={x}
                y={40}
                width="10"
                height="20"
                fill="none"
                stroke="var(--color-magenta)"
                strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </svg>
          <Search className="absolute w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}

      {/* 2. Governance Shape */}
      {isGovernance && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-magenta/10 rounded-full"
              style={{ width: 40 + i * 30, height: 40 + i * 30 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
          <Filter className="w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}

      {/* 3. Investment Shape */}
      {isInvestment && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <svg className="w-full h-full opacity-20" viewBox="0 0 200 100">
            <motion.path
              d="M0 80 Q 50 20 100 80 T 200 80"
              fill="none"
              stroke="var(--color-magenta)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path
              d="M0 90 Q 50 30 100 90 T 200 90"
              fill="none"
              stroke="var(--color-magenta)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, delay: 0.5, repeat: Infinity }}
            />
          </svg>
          <Download className="w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}

      {/* --- GENERATIVE SHAPES FOR CUSTOM CATEGORIES --- */}

      {/* Gen 0: Orbits / Rings */}
      {shapeIndex === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-magenta/10 rounded-full"
              style={{ width: 30 + i * 40, height: 20 + i * 20 }}
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
          <Activity className="w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}

      {/* Gen 1: Network / Nodes */}
      {shapeIndex === 1 && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <svg className="w-full h-full opacity-20" viewBox="0 0 200 100">
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={40 + i * 30}
                cy={50 + Math.sin(i) * 20}
                r={3}
                fill="var(--color-magenta)"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
            <motion.path
              d="M40 50 Q 70 70 100 50 T 160 50"
              fill="none"
              stroke="var(--color-magenta)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
          <Network className="absolute w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}

      {/* Gen 2: Matrix / Grid */}
      {shapeIndex === 2 && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <svg className="w-full h-full opacity-20" viewBox="0 0 200 100">
            {[...Array(4)].map((_, row) =>
              [...Array(8)].map((_, col) => (
                <motion.rect
                  key={`${row}-${col}`}
                  x={20 + col * 20}
                  y={20 + row * 15}
                  width="4"
                  height="4"
                  fill="var(--color-magenta)"
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 2,
                    delay: (row + col) * 0.1,
                    repeat: Infinity,
                  }}
                />
              )),
            )}
          </svg>
          <Zap className="absolute w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}

      {/* Gen 3: Hexagons */}
      {shapeIndex === 3 && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.svg
              key={i}
              className="absolute w-24 h-24 opacity-10"
              style={{ transform: `scale(${1 + i * 0.5})` }}
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <polygon
                points="50 0, 93 25, 93 75, 50 100, 7 75, 7 25"
                fill="none"
                stroke="var(--color-magenta)"
                strokeWidth="1"
              />
            </motion.svg>
          ))}
          <Activity className="absolute w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}

      {/* Gen 4: Expanding Waves */}
      {shapeIndex === 4 && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-magenta/20 rounded-full"
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 200, height: 200, opacity: 0 }}
              transition={{ duration: 4, delay: i * 1, repeat: Infinity }}
            />
          ))}
          <Network className="absolute w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}

      {/* Gen 5: Geometric Blocks */}
      {shapeIndex === 5 && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <svg className="w-full h-full opacity-20" viewBox="0 0 200 100">
            <motion.rect
              x="50"
              y="20"
              width="30"
              height="60"
              fill="none"
              stroke="var(--color-magenta)"
              strokeWidth="0.5"
              animate={{ y: [20, 10, 20] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.rect
              x="90"
              y="40"
              width="30"
              height="40"
              fill="none"
              stroke="var(--color-magenta)"
              strokeWidth="0.5"
              animate={{ y: [40, 30, 40] }}
              transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
            />
            <motion.rect
              x="130"
              y="30"
              width="30"
              height="50"
              fill="none"
              stroke="var(--color-magenta)"
              strokeWidth="0.5"
              animate={{ y: [30, 20, 30] }}
              transition={{ duration: 3, delay: 1, repeat: Infinity }}
            />
          </svg>
          <Filter className="absolute w-10 h-10 text-magenta/20 stroke-[1]" />
        </div>
      )}
    </div>
  );
}
