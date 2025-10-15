import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePdf(ref) {
  if (!ref || !ref.current) return

  const element = ref.current
  const canvas = await html2canvas(element, { scale: 2 })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'pt', 'a4')

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = canvas.width
  const imgHeight = canvas.height

  const ratio = pdfWidth / imgWidth
  const renderedHeight = imgHeight * ratio

  if (renderedHeight <= pdfHeight - 40) {
    pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, renderedHeight)
  } else {
    let position = 0
    const pageHeightPx = (pdfHeight - 40) / ratio
    while (position < imgHeight) {
      const canvasPage = document.createElement('canvas')
      canvasPage.width = imgWidth
      canvasPage.height = Math.min(pageHeightPx, imgHeight - position)
      const ctx = canvasPage.getContext('2d')
      ctx.drawImage(
        await createImage(imgData),
        0,
        position,
        imgWidth,
        canvasPage.height,
        0,
        0,
        imgWidth,
        canvasPage.height
      )
      const pageData = canvasPage.toDataURL('image/png')
      if (position > 0) pdf.addPage()
      pdf.addImage(pageData, 'PNG', 0, 20, pdfWidth, (canvasPage.height * ratio))
      position += canvasPage.height
    }
  }

  pdf.save('itinerary.pdf')
}

function createImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = dataUrl
  })
}
