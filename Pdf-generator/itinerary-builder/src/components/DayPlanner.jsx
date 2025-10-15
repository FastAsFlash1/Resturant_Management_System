import React from 'react'

export default function DayPlanner({ index, data, setData, remove }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm my-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Day {index + 1}</h3>
        <button className="text-sm text-red-600" onClick={remove}>Remove</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <div>
          <label className="block text-sm">Morning</label>
          <input value={data.morning} onChange={(e) => setData({ ...data, morning: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm">Afternoon</label>
          <input value={data.afternoon} onChange={(e) => setData({ ...data, afternoon: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm">Evening</label>
          <input value={data.evening} onChange={(e) => setData({ ...data, evening: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-sm">Transport / Flights (optional)</label>
        <input value={data.transport} onChange={(e) => setData({ ...data, transport: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" />
      </div>
    </div>
  )
}
