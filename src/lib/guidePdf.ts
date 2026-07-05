"use client"

// Renders /admin/guide/print in a hidden iframe and exports it as a real,
// downloadable PDF file (not just the browser's print-to-PDF dialog).
export async function downloadAdminGuidePdf(): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ])

  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.left = "-10000px"
  iframe.style.top = "0"
  iframe.style.width = "900px"
  iframe.style.height = "1px"
  iframe.setAttribute("aria-hidden", "true")
  document.body.appendChild(iframe)

  try {
    await new Promise<void>((resolve, reject) => {
      iframe.onload = () => resolve()
      iframe.onerror = () => reject(new Error("تعذر تحميل محتوى الدليل"))
      iframe.src = "/admin/guide/print"
    })

    const doc = iframe.contentDocument
    if (!doc) throw new Error("تعذر الوصول لمحتوى الدليل")

    // Give the print page's own effects (fonts, useEffect) a moment to settle.
    await new Promise((r) => setTimeout(r, 300))

    const hideStyle = doc.createElement("style")
    hideStyle.textContent = ".no-print { display: none !important; }"
    doc.head.appendChild(hideStyle)

    const body = doc.body
    iframe.style.height = `${body.scrollHeight}px`

    const canvas = await html2canvas(body, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 900,
    })

    const pdf = new jsPDF({ unit: "px", format: [canvas.width, canvas.height] })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgData = canvas.toDataURL("image/jpeg", 0.95)

    let heightLeft = canvas.height
    let position = 0
    pdf.addImage(imgData, "JPEG", 0, position, pageWidth, canvas.height)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position -= pageHeight
      pdf.addPage([canvas.width, canvas.height])
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, canvas.height)
      heightLeft -= pageHeight
    }

    pdf.save("elfady-admin-guide.pdf")
  } finally {
    document.body.removeChild(iframe)
  }
}
