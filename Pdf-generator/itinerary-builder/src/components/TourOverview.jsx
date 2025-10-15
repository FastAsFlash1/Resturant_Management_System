import React from 'react'

export default function TourOverview({ data, setData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="col-span-2">
          <label className="block text-sm font-medium">Trip Title</label>
          <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full mt-1 p-3 border rounded-lg shadow-inner" />
        </div>

        <div>
          <label className="block text-sm font-medium">Duration (days)</label>
          <input type="number" value={data.duration} onChange={(e) => setData({ ...data, duration: Number(e.target.value) })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium">Travelers</label>
          <input type="number" value={data.travelers} onChange={(e) => setData({ ...data, travelers: Number(e.target.value) })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>

        <div className="col-span-2 mt-2">
          <label className="block text-sm font-medium">Departure</label>
          <input value={data.departure} onChange={(e) => setData({ ...data, departure: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>

        <div className="col-span-2 mt-2">
          <label className="block text-sm font-medium">Arrival</label>
          <input value={data.arrival} onChange={(e) => setData({ ...data, arrival: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>
      </div>
    </div>
  )
}
