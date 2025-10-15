import React, { useState, useRef } from 'react'
import TourOverview from '../components/TourOverview'
import DayPlanner from '../components/DayPlanner'
import HotelDetails from '../components/HotelDetails'
import PaymentPlan from '../components/PaymentPlan'
import InclusionsExclusions from '../components/InclusionsExclusions'
import PdfPreview from '../components/PdfPreview'
import { generatePdf } from '../utils/pdfGenerator'

export default function Home() {
  const [overview, setOverview] = useState({
    title: 'My Trip',
    duration: 3,
    travelers: 2,
    departure: '',
    arrival: '',
  })

  const [days, setDays] = useState([
    { morning: '', afternoon: '', evening: '', transport: '' },
  ])

  const [hotel, setHotel] = useState({ name: '', city: '', checkIn: '', checkOut: '', nights: 1 })
  const [payments, setPayments] = useState([])
  const [incExc, setIncExc] = useState({ inclusions: '', exclusions: '' })

  const previewRef = useRef()

  function addDay() {
    setDays([...days, { morning: '', afternoon: '', evening: '', transport: '' }])
  }

  function removeDay(index) {
    setDays(days.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-headerStart to-headerEnd text-white rounded-2xl p-10 mb-6">
          <h1 className="text-4xl font-bold">Itinerary Builder</h1>
          <p className="mt-2 text-lg">Build multi-day itineraries and export beautiful PDFs</p>
        </div>

        <div className="itinerary-page">
          <TourOverview data={overview} setData={setOverview} />

        <div className="mt-6">
          <h2 className="text-xl font-medium">Day Planner</h2>
          {days.map((d, i) => (
            <DayPlanner key={i} index={i} data={d} setData={(val) => {
              const copy = [...days]
              copy[i] = val
              setDays(copy)
            }} remove={() => removeDay(i)} />
          ))}
          <div className="mt-2 space-x-2">
            <button className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium" onClick={addDay}>Add Day</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <HotelDetails data={hotel} setData={setHotel} />
          <PaymentPlan data={payments} setData={setPayments} />
        </div>

        <div className="mt-6">
          <InclusionsExclusions data={incExc} setData={setIncExc} />
        </div>

        <div className="mt-6 flex gap-3">
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg" onClick={() => generatePdf(previewRef)}>📄 Download PDF</button>
        </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-2">PDF Preview</h2>
            <div ref={previewRef} className="bg-white p-6 border rounded">
              <PdfPreview overview={overview} days={days} hotel={hotel} payments={payments} incExc={incExc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
