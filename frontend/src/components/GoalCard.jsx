import { motion } from "framer-motion";
import { Target, Zap } from "lucide-react";

const GoalCard = ({ goalAmount, netSavings, onGoalChange }) => {
  const progress = Math.min((netSavings / goalAmount) * 100, 100);
  const isAchieved = netSavings >= goalAmount;
  const remainingAmount = Math.max(goalAmount - netSavings, 0);

  return (
    <motion.div 
      className="card mt-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20"
          whileHover={{ scale: 1.1 }}
        >
          <Target size={24} className="text-amber-400" />
        </motion.div>
        <div>
          <h3>Monthly Savings Goal</h3>
          <p className="text-tertiary text-sm">Track your progress towards your target</p>
        </div>
      </div>

      {/* GOAL INPUT */}
      <div className="flex gap-3 items-end mb-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-secondary mb-2">Goal Amount (₹)</label>
          <input
            type="number"
            className="input"
            value={goalAmount}
            onChange={(e) => onGoalChange(Number(e.target.value))}
            min="0"
            step="1000"
          />
        </div>
        <div className="text-right">
          <p className="text-tertiary text-xs mb-1">Current Savings</p>
          <p className="text-xl font-bold text-emerald-400">₹{netSavings.toFixed(0)}</p>
        </div>
      </div>

      {/* PROGRESS SECTION */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-tertiary text-sm mb-1">Progress</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {progress.toFixed(1)}%
            </p>
          </div>
          <div className="text-right">
            {isAchieved ? (
              <div className="flex items-center gap-1 text-emerald-400">
                <Zap size={20} />
                <span className="text-sm font-semibold">Goal Reached!</span>
              </div>
            ) : (
              <div>
                <p className="text-tertiary text-xs">Remaining</p>
                <p className="text-xl font-bold text-orange-400">₹{remainingAmount.toFixed(0)}</p>
              </div>
            )}
          </div>
        </div>

        {/* MODERN ANIMATED PROGRESS BAR */}
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-50 blur-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        {/* MILESTONE MARKERS */}
        <div className="flex justify-between mt-3 text-xs text-tertiary">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* STATS GRID */}
      {isAchieved && (
        <motion.div 
          className="grid grid-2 gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div>
            <p className="text-tertiary text-xs mb-1">Surplus Amount</p>
            <p className="text-lg font-bold text-emerald-400">₹{(netSavings - goalAmount).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-tertiary text-xs mb-1">Achievement Rate</p>
            <p className="text-lg font-bold text-emerald-400">{Math.min((netSavings / goalAmount * 100), 999).toFixed(0)}%</p>
          </div>
        </motion.div>
      )}

      {/* MOTIVATIONAL MESSAGE */}
      <motion.div 
        className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-blue-300">
          {isAchieved 
            ? "🎉 Congratulations! You've reached your goal!" 
            : `Save ₹${remainingAmount.toFixed(0)} more to reach your target`}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GoalCard;
