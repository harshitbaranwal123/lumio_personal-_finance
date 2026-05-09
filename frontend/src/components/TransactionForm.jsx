import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Save, X, AlertCircle, CheckCircle } from "lucide-react";
import api from "../api.js";

const TransactionForm = ({ onSuccess, editing, initialData, onCancel }) => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    date: "",
    category: "Food",
    payment: "Cash",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editing && initialData) {
      // Format date from ISO to input date format
      const formattedDate = initialData.date 
        ? new Date(initialData.date).toISOString().split('T')[0]
        : "";
      
      setForm({
        type: initialData.type || "expense",
        amount: initialData.amount || "",
        date: formattedDate,
        category: initialData.category || "Food",
        payment: initialData.payment || "Cash",
        notes: initialData.notes || "",
      });
    }
  }, [editing, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.type) newErrors.type = "Type is required";
    if (!form.amount) newErrors.amount = "Amount is required";
    if (form.amount && form.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLoading(true);
    setServerError("");
    setSuccess(false);

    try {
      const payload = {
        type: form.type,
        amount: parseFloat(form.amount),
        date: form.date,
        category: form.category,
        payment: form.payment,
        notes: form.notes,
      };

      if (editing && initialData?._id) {
        // Update transaction
        const response = await api.put(`/transactions/${initialData._id}`, payload);
        
        if (response.data?.transaction) {
          setSuccess(true);
          
          // Reset form and show success feedback
          setTimeout(() => {
            setForm({
              type: "expense",
              amount: "",
              date: "",
              category: "Food",
              payment: "Cash",
              notes: "",
            });
            setSuccess(false);
            onSuccess?.(response.data.transaction);
            onCancel?.();
          }, 1500);
        }
      } else {
        // Create new transaction
        const response = await api.post("/transactions", payload);
        
        if (response.data?.transaction) {
          setSuccess(true);
          
          // Reset form and show success feedback
          setTimeout(() => {
            setForm({
              type: "expense",
              amount: "",
              date: "",
              category: "Food",
              payment: "Cash",
              notes: "",
            });
            setSuccess(false);
            onSuccess?.(response.data.transaction);
          }, 1500);
        }
      }
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error ||
        "Failed to save transaction. Please try again.";
      
      setServerError(errorMessage);
      console.error("Transaction error:", err);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const expenseCategories = ["Food", "Travel", "Shopping", "Health", "Entertainment", "Utilities", "Other"];
  const incomeCategories = ["Salary", "Freelance", "Investment", "Bonus", "Other"];
  const categories = form.type === "expense" ? expenseCategories : incomeCategories;

  return (
    <motion.div 
      className="card transaction-form mt-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          whileHover={{ scale: 1.1 }}
        >
          {editing ? (
            <Save size={24} className="text-blue-400" />
          ) : (
            <Plus size={24} className="text-blue-400" />
          )}
        </motion.div>
        <div>
          <h3>{editing ? "Edit Transaction" : "Add Transaction"}</h3>
          <p className="text-tertiary text-sm">Record a new {form.type === "expense" ? "expense" : "income"}</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div 
          className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle size={20} className="text-green-400" />
          <p className="text-green-300 text-sm">
            {editing ? "Transaction updated successfully!" : "Transaction added successfully!"}
          </p>
        </motion.div>
      )}

      {/* Error Message */}
      {serverError && (
        <motion.div 
          className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-300 text-sm">{serverError}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="transaction-grid">
          {/* TYPE SELECTOR */}
          <div className="form-group">
            <label>Type *</label>
            <select 
              name="type" 
              className={`input ${errors.type ? "border-red-500" : ""}`}
              value={form.type} 
              onChange={handleChange}
              disabled={loading}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            {errors.type && (
              <p className="text-red-400 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          {/* AMOUNT */}
          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              className={`input ${errors.amount ? "border-red-500" : ""}`}
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={loading}
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* DATE */}
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              className={`input ${errors.date ? "border-red-500" : ""}`}
              value={form.date}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* CATEGORY */}
          <div className="form-group">
            <label>Category *</label>
            <select 
              name="category" 
              className={`input ${errors.category ? "border-red-500" : ""}`}
              value={form.category} 
              onChange={handleChange}
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* PAYMENT METHOD */}
          <div className="form-group">
            <label>Payment Method</label>
            <select 
              name="payment" 
              className="input" 
              value={form.payment} 
              onChange={handleChange}
              disabled={loading}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Card</option>
              <option>Wallet</option>
            </select>
          </div>

          {/* NOTES - FULL WIDTH */}
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              className="input"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any additional details..."
              rows="3"
              disabled={loading}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6">
          <motion.button 
            type="submit" 
            className="btn btn-primary"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading || isSubmitting}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block"
                >
                  <Save size={18} />
                </motion.div>
                {" Saving..."}
              </>
            ) : (
              <>
                <Save size={18} />
                {editing ? "Update" : "Add Transaction"}
              </>
            )}
          </motion.button>

          {editing && (
            <motion.button 
              type="button" 
              className="btn btn-outline"
              onClick={onCancel}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              <X size={18} />
              Cancel
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default TransactionForm;
