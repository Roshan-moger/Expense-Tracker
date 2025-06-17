"use client"

import { useDispatch, useSelector } from "react-redux"
import { useState, useMemo } from "react"
import { updateEmailNoteAsync } from "../features/Email/EmailSlice"
import { updateManualNoteAsync, deleteManualTransactionAsync } from "../features/manual/manualSlice"
import toast from "react-hot-toast"

// Utility function to get five weeks of a given month
const getWeeksInMonth = (monthStr) => {
  if (!monthStr) return []
  const [year, month] = monthStr.split("-").map(Number)
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const weeks = []
  const currentDate = new Date(firstDay)

  while (currentDate <= lastDay) {
    const weekStart = new Date(currentDate)
    const weekEnd = new Date(currentDate)
    weekEnd.setDate(weekStart.getDate() + 6)
    if (weekEnd > lastDay) weekEnd.setDate(lastDay.getDate())

    weeks.push({
      label: `Week ${weeks.length + 1} (${weekStart.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })} - ${weekEnd.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })})`,
      start: new Date(weekStart),
      end: new Date(weekEnd),
    })

    currentDate.setDate(currentDate.getDate() + 7)
    if (weeks.length >= 5) break // Limit to 5 weeks
  }

  return weeks
}

const extractAmountFromSubject = (subject) => {
  const match = subject.match(/(?:INR|₹)\s?([\d,]+\.\d{2}|\d+)/i)
  return match ? Number.parseFloat(match[1].replace(/,/g, "")) : 0
}

const getTypeFromSubject = (subject) => {
  if (/credit/i.test(subject)) return "credited"
  if (/debit/i.test(subject)) return "debited"
  return "unknown"
}

const AllTransactions = () => {
  const emails = useSelector((state) => state.emails.data || [])
  const manual = useSelector((state) => state.manualTransaction.data || [])
  const selectedMonth = useSelector((state) => state.emails.selectedMonth)
  const dispatch = useDispatch()

  const [selectedWeek, setSelectedWeek] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [currentTxn, setCurrentTxn] = useState(null)
  const [noteInput, setNoteInput] = useState("")

  const weeks = useMemo(() => getWeeksInMonth(selectedMonth), [selectedMonth])

  const handleEditClick = (txn) => {
    setCurrentTxn(txn)
    setNoteInput(txn.note || "")
    setModalOpen(true)
  }

  const handleDeleteClick = (txn) => {
    setCurrentTxn(txn)
    setDeleteModalOpen(true)
  }

  const handleNoteSubmit = async () => {
    if (!currentTxn) return

    try {
      if (currentTxn.source === "manual") {
        await dispatch(
          updateManualNoteAsync({
            manualId: currentTxn._id,
            note: noteInput,
          }),
        ).unwrap()
      } else {
        await dispatch(
          updateEmailNoteAsync({
            emailId: currentTxn._id,
            note: noteInput,
          }),
        ).unwrap()
      }

      currentTxn.note = noteInput
      toast.success("Note updated successfully!", {
        style: { background: "#1F2937", color: "#F3F4F6", fontWeight: "600" },
      })
      setModalOpen(false)
    } catch (err) {
      console.error("Error updating note:", err)
      toast.error("Failed to update note. Please try again.", {
        style: { background: "#1F2937", color: "#F3F4F6", fontWeight: "600" },
      })
    }
  }

  const handleDeleteSubmit = async () => {
    if (!currentTxn || currentTxn.source !== "manual") return

    try {
      await dispatch(deleteManualTransactionAsync(currentTxn._id)).unwrap()
      toast.success("Transaction deleted successfully!", {
        style: { background: "#1F2937", color: "#F3F4F6", fontWeight: "600" },
      })
      setDeleteModalOpen(false)
      setCurrentTxn(null)
    } catch (err) {
      console.error("Error deleting transaction:", err)
      toast.error("Failed to delete transaction. Please try again.", {
        style: { background: "#1F2937", color: "#F3F4F6", fontWeight: "600" },
      })
    }
  }

  const formattedEmails = emails.map((email, idx) => ({
    _id: email._id || `email-${idx}`,
    date: email.date,
    amount: extractAmountFromSubject(email.subject),
    note: email.note || "",
    type: getTypeFromSubject(email.subject),
    source: "email",
  }))

  const formattedManual = manual.map((txn, idx) => ({
    _id: txn._id || `manual-${idx}`,
    ...txn,
    source: "manual",
  }))

  const allTransactions = [...formattedEmails, ...formattedManual].sort((a, b) => new Date(b.date) - new Date(a.date))

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      if (selectedMonth) {
        const date = new Date(txn.date)
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        if (monthStr !== selectedMonth) return false
      }

      if (selectedWeek) {
        const date = new Date(txn.date)
        const weekRange = weeks.find((w) => w.label === selectedWeek)
        if (!weekRange || date < weekRange.start || date > weekRange.end) return false
      }

      if (selectedType && txn.type !== selectedType) return false

      return true
    })
  }, [allTransactions, selectedMonth, selectedWeek, selectedType, weeks])

  const creditTotal = filteredTransactions
    .filter((txn) => txn.type === "credited")
    .reduce((sum, txn) => sum + txn.amount, 0)

  const debitTotal = filteredTransactions
    .filter((txn) => txn.type === "debited")
    .reduce((sum, txn) => sum + txn.amount, 0)

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 overflow-x-auto">
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
          All Transactions
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mb-8">
          <select
            value={selectedMonth}
            onChange={(e) => {
              dispatch({ type: "emails/setSelectedMonth", payload: e.target.value })
              setSelectedWeek("")
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="">All Months</option>
            {[...new Set(allTransactions.map((t) => t.date.slice(0, 7)))].map((m) => {
              const [year, month] = m.split("-")
              const label = `${new Date(year, month - 1).toLocaleString("default", { month: "long" })} ${year}`
              return (
                <option key={m} value={m}>
                  {label}
                </option>
              )
            })}
          </select>

          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedMonth}
          >
            <option value="">All Weeks</option>
            {weeks.map((w) => (
              <option key={w.label} value={w.label}>
                {w.label}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="">All Types</option>
            <option value="credited">Credit</option>
            <option value="debited">Debit</option>
          </select>

          <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base font-semibold text-gray-700">
            <span className="flex items-center">
              💰 <span className="ml-1 text-green-600">Credit: ₹{creditTotal.toFixed(2)}</span>
            </span>
            <span className="flex items-center">
              💸 <span className="ml-1 text-red-600">Debit: ₹{debitTotal.toFixed(2)}</span>
            </span>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <p className="text-lg text-gray-500 text-center sm:text-base py-6 bg-white rounded-2xl shadow-md">
            No transactions available.
          </p>
        ) : (
          <ul className="space-y-4">
            {filteredTransactions.map((txn) => (
              <li
                key={txn._id}
                className={`bg-white p-4 sm:p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform sm:hover:-translate-y-1 border-l-4 ${
                  txn.type === "credited"
                    ? "border-l-green-500"
                    : txn.type === "debited"
                      ? "border-l-red-500"
                      : "border-l-gray-500"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(txn.date).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour12: true,
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p
                      className={`text-sm sm:text-base font-semibold capitalize ${
                        txn.type === "credited"
                          ? "text-green-600"
                          : txn.type === "debited"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {txn.type}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800">₹{txn.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col sm:flex-col-reverse sm:items-end gap-2 sm:gap-3">
                    <div className="text-xs sm:text-sm text-gray-600 italic max-w-xs sm:max-w-md truncate">
                      {txn.note || "No note added"}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-lg sm:text-xl transition-colors duration-200"
                        onClick={() => handleEditClick(txn)}
                        title="Edit Note"
                      >
                        ✏️
                      </button>
                      {txn.source === "manual" && (
                        <button
                          className="text-red-600 hover:text-red-800 text-lg sm:text-xl transition-colors duration-200"
                          onClick={() => handleDeleteClick(txn)}
                          title="Delete Transaction"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Edit Note Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg max-w-md w-full transform transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Add/Edit Note</h2>
              <textarea
                className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                rows="4"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Enter note"
              />
              <div className="flex justify-end gap-2 sm:gap-3 mt-4">
                <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                  onClick={handleNoteSubmit}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-md transform transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Delete Transaction</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Are you sure you want to delete this transaction for ₹{currentTxn?.amount?.toFixed(2)} (
                {currentTxn?.type})?
              </p>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                  onClick={handleDeleteSubmit}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllTransactions
