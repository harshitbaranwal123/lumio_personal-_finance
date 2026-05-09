import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Calendar } from "lucide-react";
import SummaryCards from "../components/SummaryCards.jsx";
import GoalCard from "../components/GoalCard.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionsTable from "../components/TransactionsTable.jsx";
import ChartsPanel from "../components/ChartsPanel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api.js";

const Dashboard = () => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [editingTx, setEditingTx] = useState(null);
  const [goalAmount, setGoalAmount] = useState(
    Number(localStorage.getItem("pfms_goal")) || 20000
  );
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState("");

  // Get current time and motivational quote
  const [currentTime, setCurrentTime] = useState(new Date());
  const quotes = [
    "Your future self will thank you for the decisions you make today. 💡",
    "Every rupee saved is a step toward financial freedom. 🚀",
    "Smart spending today leads to abundance tomorrow. 💰",
    "Track your money, transform your life. 📊",
    "Financial goals are dreams with numbers attached. ✨",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      setError("");
      const response = await api.get("/transactions");
      
      if (response.data?.transactions) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch transactions";
      setError(errorMessage);
      console.error("Fetch transactions error:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Initial fetch and setup
  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    localStorage.setItem("pfms_goal", goalAmount);
  }, [goalAmount]);

  // Handle successful transaction save
  const handleTransactionSuccess = (newTransaction) => {
    // Refetch all transactions to stay in sync with backend
    fetchTransactions();
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete transaction";
      setError(errorMessage);
      console.error("Delete transaction error:", err);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  const categoryTotals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const biggestCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
      : null;


  return (
    <div className="container">
      {/* ERROR MESSAGE */}
      {error && (
        <motion.div 
          className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-red-400 text-sm">{error}</span>
        </motion.div>
      )}

      {/* HERO SECTION */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <motion.h1 
              className="mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Welcome back, {user?.name} 👋
            </motion.h1>
            <motion.p 
              className="text-secondary text-lg mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Here's your financial overview for today
            </motion.p>
          </div>
          <motion.div 
            className="text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-tertiary mb-2">
              <Calendar size={16} />
              <span className="text-sm">{currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <span className="text-xs text-tertiary">{currentTime.toLocaleTimeString()}</span>
          </motion.div>
        </div>

        {/* MOTIVATIONAL QUOTE */}
        <motion.div 
          className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-amber-400 mt-1 flex-shrink-0" />
            <p className="text-sm text-blue-300">{randomQuote}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netSavings={netSavings}
        biggestCategory={biggestCategory}
      />

      {/* GOAL & CHARTS SECTION */}
      <motion.div 
        className="grid grid-2 gap-6 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <GoalCard
            goalAmount={goalAmount}
            netSavings={netSavings}
            onGoalChange={setGoalAmount}
          />
        </div>
        <div>
          <ChartsPanel transactions={transactions} />
        </div>
      </motion.div>

      {/* TRANSACTION FORM & TABLE */}
      <TransactionForm
        onSuccess={handleTransactionSuccess}
        editing={!!editingTx}
        initialData={editingTx}
        onCancel={() => setEditingTx(null)}
      />

      {loadingTransactions ? (
        <motion.div 
          className="card mt-6 p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-tertiary">Loading transactions...</p>
        </motion.div>
      ) : (
        <TransactionsTable
          transactions={transactions}
          onEdit={(tx) => setEditingTx(tx)}
          onDelete={handleDelete}
        />
      )}

      {/* FOOTER STATS */}
      <motion.div 
        className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-tertiary text-sm">
          💪 Keep tracking your finances to achieve your financial goals!
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
