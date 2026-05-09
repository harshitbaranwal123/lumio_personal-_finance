import { motion } from "framer-motion";

const AnimatedLogo = ({ size = 40, showText = true, className = "" }) => {
  const containerVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: { scale: 1.08 },
  };

  const orbVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.5 }
    },
    float: {
      y: [0, -5, 0],
      x: [0, 3, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const glowVariants = {
    pulse: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.4)",
        "0 0 40px rgba(59, 130, 246, 0.6)",
        "0 0 20px rgba(59, 130, 246, 0.4)",
      ],
      transition: { duration: 3, repeat: Infinity }
    }
  };

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* ANIMATED LOGO SVG */}
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        variants={glowVariants}
        animate="pulse"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* BACKGROUND GRADIENT CIRCLE */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* OUTER RING */}
          <motion.circle
            cx="24"
            cy="24"
            r="22"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.1 }}
            filter="url(#glow)"
          />

          {/* CENTER CIRCLE */}
          <motion.circle
            cx="24"
            cy="24"
            r="14"
            fill="rgba(59, 130, 246, 0.15)"
            filter="url(#glow)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* GLOWING DOTS */}
          <motion.g filter="url(#glow)">
            {[0, 120, 240].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 24 + 12 * Math.cos(rad);
              const y = 24 + 12 * Math.sin(rad);
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="url(#logoGradient)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                />
              );
            })}
          </motion.g>

          {/* ROTATING INNER CIRCLE */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "24px 24px" }}
          >
            <circle
              cx="24"
              cy="10"
              r="1.5"
              fill="url(#logoGradient)"
              filter="url(#glow)"
            />
          </motion.g>
        </svg>

        {/* FLOATING ORBS */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={orbVariants}
          initial="initial"
          animate={["animate", "float"]}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{
              boxShadow: [
                "0 0 10px rgba(6, 182, 212, 0.5)",
                "0 0 20px rgba(6, 182, 212, 0.8)",
                "0 0 10px rgba(6, 182, 212, 0.5)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* TEXT */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col">
            <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              LUMIO
            </span>
            <span className="text-xs text-tertiary">Finance</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedLogo;
