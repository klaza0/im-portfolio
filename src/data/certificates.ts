import { systemIcons } from './icons'

export type CertificateFileType = 'pdf' | 'image' | 'document'

export interface CertificateFile {
  id: string
  name: string
  fileName: string
  type: CertificateFileType
  icon: string
}

export const CERTIFICATES_FOLDER = 'certificates'

const pdfIcon = systemIcons.pdf
const imageIcon = systemIcons.image
const documentIcon = systemIcons.document

export const certificateFiles: CertificateFile[] = [
  { id: 'cert-computer-essentials', name: 'Computer Essentials', fileName: 'Computer Essentials.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-pandas', name: 'Data Manipulation with pandas', fileName: 'Data Manipulation with pandas.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-intermediate-python', name: 'Intermediate Python', fileName: 'Intermediate Python.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-intermediate-sql', name: 'Intermediate SQL', fileName: 'Intermediate SQL.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-seaborn', name: 'Introduction to Data Visualization with Seaborn', fileName: 'Introduction to Data Visualization with Seaborn.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-intro-python', name: 'Introduction to Python', fileName: 'Introduction to Python.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-intro-sql', name: 'Introduction to SQL', fileName: 'Introduction to SQL.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-stats-python', name: 'Introduction to Statistics in Python', fileName: 'Introduction to Statistics in Python.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-joining-pandas', name: 'Joining Data with pandas', fileName: 'JOINING DATA WITH PANDAS.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-python-fundamentals', name: 'Python Data Fundamentals', fileName: 'Python Data Fundamentals.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-sprints-jpg', name: 'Sprints x Microsoft Summer Camp', fileName: 'sprints x microsoft summer camp web development.jpg', type: 'image', icon: imageIcon },
  { id: 'cert-sprints-pdf', name: 'Sprints x Microsoft Summer Camp (PDF)', fileName: 'sprints x microsoft summer camp web development.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-sales-pdf', name: 'Sales Specialist CV (PDF)', fileName: 'Ibrahim_Montaser_-_Sales_Specialist__Retail_Sales__Online_Sales_&_Marketing.pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-sales-pdf-2', name: 'Sales Specialist CV (PDF 2)', fileName: 'Ibrahim_Montaser_-_Sales_Specialist__Retail_Sales__Online_Sales_&_Marketing (1).pdf', type: 'pdf', icon: pdfIcon },
  { id: 'cert-sales-docx', name: 'Sales Specialist CV (Word)', fileName: 'Ibrahim_Montaser_-_Sales_Specialist__Retail_Sales__Online_Sales_%26_Marketing.docx', type: 'document', icon: documentIcon },
  { id: 'cert-ar', name: 'شهادة', fileName: 'شهادة (2).pdf', type: 'pdf', icon: pdfIcon },
]

export function certificateUrl(fileName: string): string {
  return `/certificates/${fileName.split('/').map(encodeURIComponent).join('/')}`
}
