import React from 'react'

export default function HotelDetails({ data, setData }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-medium mb-2">Hotel Details</h3>
      <label className="block text-sm">Hotel Name</label>
      <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="w-full mt-1 p-3 border rounded-lg mb-2" />

      <label className="block text-sm">City</label>
      <input value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} className="w-full mt-1 p-3 border rounded-lg mb-2" />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Check In</label>
          <input type="date" value={data.checkIn} onChange={(e) => setData({ ...data, checkIn: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm">Check Out</label>
          <input type="date" value={data.checkOut} onChange={(e) => setData({ ...data, checkOut: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" />
        </div>
      </div>

      <label className="block text-sm mt-2">Nights</label>
      <input type="number" value={data.nights} onChange={(e) => setData({ ...data, nights: Number(e.target.value) })} className="w-24 mt-1 p-3 border rounded-lg" />
    </div>
  )
}
