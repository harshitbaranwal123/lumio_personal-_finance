import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useState, useEffect } from "react";

const AnimatedNumber = ({ value, prefix = "₹" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = value / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.floor(stepValue * currentStep));
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  return `${prefix}${displayValue.toFixed(2)}`;
};

const SummaryCards = ({ totalIncome, totalExpenses, netSavings, biggestCategory }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cards = [
    {
      key: "income",
      title: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      accent: "emerald",
      textColor: "text-emerald-400",
      trend: "+12.5%",
      gradientClass: "summary-card--income",
    },
    {
      key: "expense",
      title: "Total Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      accent: "red",
      textColor: "text-red-400",
      trend: "-8.2%",
      gradientClass: "summary-card--expense",
    },
    {
      key: "savings",
      title: "Net Savings",
      value: netSavings,
      icon: PiggyBank,
      accent: netSavings >= 0 ? "emerald" : "red",
      textColor: netSavings >= 0 ? "text-emerald-400" : "text-red-400",
      trend: netSavings >= 0 ? "↑ Positive" : "↓ Negative",
      gradientClass: "summary-card--savings",
    },
  ];

  return (
    <motion.div
      className="summary-grid mt-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isSavings = card.key === "savings";

        return (
          <motion.div
            key={card.key}
            className={`summary-card card card-interactive ${card.gradientClass}`}
            variants={cardVariants}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="summary-card__top">
              <div className="summary-card__left">
                <p className="summary-card__title">{card.title}</p>
                <h3 className="summary-card__value text-primary">
                  <AnimatedNumber value={card.value} />
                </h3>
              </div>

              <motion.div
                className={`summary-card__icon ${card.textColor}`}
                whileHover={{ scale: 1.08, rotate: 4 }}
                transition={{ duration: 0.25 }}
              >
                <Icon size={22} />
              </motion.div>
            </div>

            <div className="summary-card__bottom">
              <span className={`summary-card__trend ${card.textColor}`}>{card.trend}</span>
              <span className="summary-card__meta">vs last month</span>
            </div>

            {isSavings && biggestCategory && (
              <div className="summary-card__bonus">
                <span className="summary-card__bonusLabel">Biggest Expense:</span>
                <span className="summary-card__bonusValue">{biggestCategory}</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SummaryCards;
