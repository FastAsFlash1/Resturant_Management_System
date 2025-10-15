import React from 'react'

export default function PaymentPlan({ data, setData }) {
  function addInstallment() {
    setData([...(data || []), { amount: '', dueDate: '' }])
  }

  function update(idx, key, value) {
    const copy = [...(data || [])]
    copy[idx] = { ...copy[idx], [key]: value }
    setData(copy)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-medium mb-2">Payment Plan</h3>
      <div>
        {(data || []).map((inst, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <input placeholder="Amount" value={inst.amount} onChange={(e) => update(i, 'amount', e.target.value)} className="p-3 border rounded-lg w-32" />
            <input type="date" value={inst.dueDate} onChange={(e) => update(i, 'dueDate', e.target.value)} className="p-3 border rounded-lg" />
          </div>
        ))}
        <button onClick={addInstallment} className="px-3 py-2 bg-green-600 text-white rounded">Add Installment</button>
      </div>
    </div>
  )
}
