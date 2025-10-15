# Itinerary Builder – PDF Generator

A beautiful React + Vite app for building multi-day itineraries and exporting them as PDFs with real-time preview.

## ✨ Features

- **Real-time PDF Preview** - See your itinerary update instantly as you type
- **Dynamic Day Planning** - Add/remove days with morning, afternoon, and evening activities
- **Hotel & Payment Management** - Track hotel bookings and payment installments
- **Professional PDF Export** - Generate beautiful multi-page PDFs matching your design
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Beautiful UI** - Gradient hero, card-based forms, and Figma-inspired styling

## 🚀 Quick Start

### Installation

```powershell
cd c:\Users\soura\Pdf-generator\itinerary-builder
npm install
```

### Run Development Server

```powershell
npm run dev
```

The app will open at `http://localhost:5173` (or the port shown in terminal).

### Build for Production

```powershell
npm run build
```

## 📝 How to Use

1. **Fill the form** - Enter trip details, add days, hotels, and payment plans
2. **Watch the preview** - The PDF preview updates instantly as you type
3. **Download PDF** - Click "📄 Download PDF" to export your itinerary

## 🎨 Styling

- **Font**: Poppins (Google Fonts)
- **Colors**: Purple gradient theme with soft pink accents
- **Layout**: Card-based with shadows and rounded corners

## 🛠️ Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3.4
- jsPDF + html2canvas for PDF generation

## 📦 Dependencies

```json
{
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.1",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.4.8"
}
```

---

**Note**: The PDF preview updates in real-time as you type. No need to click any button to see changes - just start typing and watch the preview update instantly!
