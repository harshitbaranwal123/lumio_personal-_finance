import { motion } from "framer-motion";
import { Trash2, Edit2, Calendar, Wallet } from "lucide-react";
import { useState } from "react";

const categoryColors = {
  Food: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Travel: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Shopping: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Health: "bg-green-500/20 text-green-300 border-green-500/30",
  Entertainment: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Utilities: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Salary: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Freelance: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Investment: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Bonus: "bg-red-500/20 text-red-300 border-red-500/30",
  Other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const paymentMethodIcons = {
  Cash: "💵",
  UPI: "📱",
  "Bank Transfer": "🏦",
  Card: "💳",
  Wallet: "👝",
};

const TransactionsTable = ({ transactions, onEdit, onDelete }) => {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTx = transactions.filter((tx) => {
    const typeMatch = filterType === "all" || tx.type === filterType;
    const searchMatch = 
      tx.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm);
    return typeMatch && searchMatch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div 
      className="card mt-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20"
          whileHover={{ scale: 1.1 }}
        >
          <Wallet size={24} className="text-purple-400" />
        </motion.div>
        <div>
          <h3>Transaction History</h3>
          <p className="text-tertiary text-sm">View and manage all your transactions</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-6 pb-4 border-b border-white/10">
        {["all", "income", "expense"].map((type) => (
          <motion.button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterType === type
                ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                : "bg-white/5 text-tertiary border border-white/10"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
        
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input ml-auto flex-1 max-w-xs"
        />
      </div>

      {/* TABLE */}
      {filteredTx.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Wallet size={48} className="mx-auto text-tertiary mb-4 opacity-50" />
          <p className="text-tertiary">No transactions found</p>
        </motion.div>
      ) : (
        <motion.div 
          className="table-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx) => (
                <motion.tr
                  key={tx._id}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tx.type === "income"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`font-semibold ${
                      tx.type === "income" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {tx.type === "income" ? "+" : "-"} ₹{tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      categoryColors[tx.category] || categoryColors.Other
                    }`}>
                      {tx.category}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1">
                      {paymentMethodIcons[tx.payment] || ""}
                      <span className="text-sm">{tx.payment || "Cash"}</span>
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-secondary">
                      <Calendar size={14} />
                      {new Date(tx.date).toLocaleDateString("en-IN")}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => onEdit(tx)}
                        className="btn btn-secondary btn-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit2 size={14} />
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          if (confirm("Delete this transaction?")) onDelete(tx._id);
                        }}
                        className="btn btn-danger btn-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* SUMMARY STATS */}
      {filteredTx.length > 0 && (
        <motion.div 
          className="grid grid-2 gap-3 mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-tertiary text-xs mb-1">Total Transactions</p>
            <p className="text-lg font-bold text-primary">{filteredTx.length}</p>
          </div>
          <div>
            <p className="text-tertiary text-xs mb-1">Total Amount</p>
            <p className="text-lg font-bold">₹{filteredTx.reduce((sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount), 0).toFixed(2)}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionsTable;
