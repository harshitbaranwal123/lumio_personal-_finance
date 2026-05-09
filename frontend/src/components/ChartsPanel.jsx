import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

const ChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg">
        <p className="text-white font-semibold">{payload[0].name || "Value"}</p>
        <p className="text-emerald-400">₹{payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const ChartsPanel = ({ transactions }) => {
  const income = transactions.filter((t) => t.type === "income");
  const expenses = transactions.filter((t) => t.type === "expense");

  // PREPARE DATA FOR EXPENSE BY CATEGORY
  const categories = [...new Set(expenses.map((e) => e.category || "Other"))];
  const categoryData = categories.map((c) => ({
    name: c,
    value: expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0),
  }));

  // PREPARE DATA FOR INCOME VS EXPENSES
  const incomeVsExpenseData = [
    {
      name: "Income",
      value: income.reduce((s, i) => s + i.amount, 0),
    },
    {
      name: "Expenses",
      value: expenses.reduce((s, e) => s + e.amount, 0),
    },
  ];

  // PREPARE DATA FOR MONTHLY TREND (SIMPLIFIED)
  const monthlyData = [
    { month: "Jan", income: 15000, expenses: 8000 },
    { month: "Feb", income: 18000, expenses: 9500 },
    { month: "Mar", income: 16000, expenses: 7800 },
    { month: "Apr", income: 19000, expenses: 10200 },
    { month: "May", income: income.reduce((s, i) => s + i.amount, 0), expenses: expenses.reduce((s, e) => s + e.amount, 0) },
  ];

  return (
    <div className="grid grid-2 gap-6 mt-6">
      {/* EXPENSE BY CATEGORY */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-orange-500/20"
            whileHover={{ scale: 1.1 }}
          >
            <PieChartIcon size={24} className="text-pink-400" />
          </motion.div>
          <div>
            <h3>Expense Breakdown</h3>
            <p className="text-tertiary text-sm">By category</p>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-tertiary">No expenses recorded yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={(entry) => `${entry.name}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(0)}`} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* CATEGORY BREAKDOWN TABLE */}
        {categoryData.length > 0 && (
          <div className="mt-6 space-y-2">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-secondary">{cat.name}</span>
                </div>
                <span className="text-sm font-semibold text-primary">₹{cat.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* INCOME VS EXPENSES */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20"
            whileHover={{ scale: 1.1 }}
          >
            <TrendingUp size={24} className="text-emerald-400" />
          </motion.div>
          <div>
            <h3>Income vs Expenses</h3>
            <p className="text-tertiary text-sm">Comparison chart</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-tertiary">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeVsExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* STATS */}
        <div className="grid grid-2 gap-3 mt-6">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-tertiary text-xs mb-1">Total Income</p>
            <p className="text-lg font-bold text-emerald-400">
              ₹{income.reduce((s, i) => s + i.amount, 0).toFixed(0)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-tertiary text-xs mb-1">Total Expenses</p>
            <p className="text-lg font-bold text-red-400">
              ₹{expenses.reduce((s, e) => s + e.amount, 0).toFixed(0)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* MONTHLY TREND */}
      <motion.div
        className="card col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20"
            whileHover={{ scale: 1.1 }}
          >
            <TrendingUp size={24} className="text-purple-400" />
          </motion.div>
          <div>
            <h3>Income & Expense Trend</h3>
            <p className="text-tertiary text-sm">Last 5 months overview</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 5 }}
              activeDot={{ r: 7 }}
              name="Income"
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", r: 5 }}
              activeDot={{ r: 7 }}
              name="Expenses"
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default ChartsPanel;
