import React from 'react'

function DayBlock({ day, idx }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="pill-left">Day {idx + 1}</div>
      <div className="flex gap-4 w-full">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 flex-shrink-0 flex items-center justify-center text-4xl">
          {idx + 1}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1">Day {idx + 1}</div>
          <div className="text-sm text-gray-600 mb-3">{day.transport || 'Activities for the day'}</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-medium text-sm mb-1">Morning</div>
              <div className="text-sm text-gray-600">{day.morning || 'No activities planned'}</div>
            </div>
            <div>
              <div className="font-medium text-sm mb-1">Afternoon</div>
              <div className="text-sm text-gray-600">{day.afternoon || 'No activities planned'}</div>
            </div>
            <div>
              <div className="font-medium text-sm mb-1">Evening</div>
              <div className="text-sm text-gray-600">{day.evening || 'No activities planned'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PdfPreview({ overview, days, hotel, payments, incExc }) {
  return (
    <div className="text-gray-800 font-poppins" style={{ width: '800px' }}>
      <header className="mb-6">
        <div className="bg-gradient-to-r from-headerStart to-headerEnd text-white p-6 rounded-2xl">
          <h1 className="text-3xl font-bold">Hi, Traveler!</h1>
          <div className="text-2xl font-semibold mt-1">{overview.title || 'Your Itinerary'}</div>
          <div className="mt-2">{overview.duration} Days {Math.max(0, overview.duration - 1)} Nights</div>
        </div>

        <div className="mt-4 border rounded-lg p-4 flex flex-wrap justify-between items-center text-sm gap-2">
          <div>Departure From: <strong>{overview.departure || '—'}</strong></div>
          <div>Destination: <strong>{overview.arrival || '—'}</strong></div>
          <div>No. Of Travellers: <strong>{overview.travelers}</strong></div>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
        {days.map((d, i) => <DayBlock key={i} day={d} idx={i} />)}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Hotel Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-softPink">
                <th className="p-3 text-left rounded-tl-lg">City</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Nights</th>
                <th className="p-3 text-left rounded-tr-lg">Hotel Name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">{hotel.city || '—'}</td>
                <td className="p-3">{hotel.checkIn || '—'}</td>
                <td className="p-3">{hotel.checkOut || '—'}</td>
                <td className="p-3">{hotel.nights || '—'}</td>
                <td className="p-3">{hotel.name || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Plan</h2>
        {payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-softPink">
                  <th className="p-3 text-left rounded-tl-lg">Installment</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left rounded-tr-lg">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3">Installment {i + 1}</td>
                    <td className="p-3">{p.amount || '—'}</td>
                    <td className="p-3">{p.dueDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500 p-4 border rounded">No payment plan added yet</div>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Inclusions</h2>
        <div className="border p-4 rounded bg-gray-50 text-sm whitespace-pre-wrap">{incExc.inclusions || 'No inclusions added yet'}</div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Exclusions</h2>
        <div className="border p-4 rounded bg-gray-50 text-sm whitespace-pre-wrap">{incExc.exclusions || 'No exclusions added yet'}</div>
      </section>

      <footer className="mt-8 pt-4 border-t text-sm text-gray-500 text-center">
        <div>Generated with Itinerary Builder</div>
      </footer>
    </div>
  )
}
