export function downloadReport(title: string, columns: string[], rows: (string | number)[][], format: 'csv' | 'pdf') {
  const lines = [columns, ...rows]
  let blob: Blob
  if (format === 'csv') {
    const cell = (value: string | number) => { const text = String(value); return `"${(/^[=+@\-\t\r]/.test(text) ? `'${text}` : text).replaceAll('"', '""')}"` }
    blob = new Blob(['\uFEFF' + lines.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
  } else {
    const text = [title, 'PG OS sample report | Currency: INR', ...lines.map(row => row.join(' | '))].flatMap(line => line.replaceAll('₹', 'INR ').replace(/[^\x20-\x7E]/g, '-').match(/.{1,105}/g) || [''])
    const pages: string[][] = []
    for (let i = 0; i < text.length; i += 48) pages.push(text.slice(i, i + 48))
    const objects = ['<< /Type /Catalog /Pages 2 0 R >>', `<< /Type /Pages /Kids [${pages.map((_, i) => `${4 + i * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`, '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>']
    pages.forEach((page, i) => {
      const stream = `BT /F1 9 Tf 36 800 Td 15 TL ${page.map(line => `(${line.replace(/([\\()])/g, '\\$1')}) Tj T*`).join('\n')} ET`
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 650 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + i * 2} 0 R >>`, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
    })
    let pdf = '%PDF-1.4\n'
    const offsets = [0]
    objects.forEach((object, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${object}\nendobj\n` })
    const xref = pdf.length
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
    blob = new Blob([pdf], { type: 'application/pdf' })
  }
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.${format}`
  document.body.append(anchor); anchor.click(); anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
