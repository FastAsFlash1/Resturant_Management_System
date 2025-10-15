import React from 'react'

export default function InclusionsExclusions({ data, setData }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-medium mb-3">Inclusions & Exclusions</h3>
      <label className="block text-sm font-medium">Inclusions</label>
      <textarea value={data.inclusions} onChange={(e) => setData({ ...data, inclusions: e.target.value })} className="w-full mt-1 p-3 border rounded-lg mb-3" rows={4} placeholder="List what's included in the package..." />

      <label className="block text-sm font-medium">Exclusions</label>
      <textarea value={data.exclusions} onChange={(e) => setData({ ...data, exclusions: e.target.value })} className="w-full mt-1 p-3 border rounded-lg" rows={4} placeholder="List what's not included..." />
    </div>
  )
}
