import { useState, useEffect } from 'react'

// Inline SVG for CheckIcon (used for success message)
const CheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 4.037a1 1 0 01.282 1.408l-7 10a1 1 0 01-1.472.107l-4.5-4a1 1 0 011.365-1.488L9 14.172l6.293-8.843a1 1 0 011.408-.282z" clipRule="evenodd" />
  </svg>
)

// Inline SVG for XMarkIcon (used for error message)
const XMarkIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
)

const serviceOptions = [
  { id: 'softwareDev', name: 'Software Development (Full-Stack/API)', urlKey: 'softwaredevelopment' },
  { id: 'websiteDesign', name: 'Website Design & Implementation (HTML/CSS/JS)', urlKey: 'websitedesign' },
  { id: 'uiUxDesign', name: 'Custom UI/UX Design (Figma)', urlKey: 'customuiuxdesign' }, 
  { id: 'graphicDesign', name: 'Graphic Design Services (Posters, Thumbnails, etc.)', urlKey: 'graphicdesignservices' },
  { id: 'photoVideo', name: 'Photography & Videography Services', urlKey: 'photography&videographyservices' },
  { id: 'socialMedia', name: 'Social Media Management & Growth', urlKey: 'socialmediaservices' }, 
]

export default function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    services: '',
    projectDetails: '',
    budget: '',
    agreement: false,
  })

  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fix URL mapping logic
  const cleanString = (str) => {
    if (!str) return ''
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlServiceName = params.get('service')

    if (urlServiceName) {
      const cleaned = cleanString(urlServiceName)

      const match = serviceOptions.find(s =>
        cleanString(s.urlKey) === cleaned || cleanString(s.id) === cleaned
      )

      if (match) {
        setFormData((prev) => ({ ...prev, services: match.id }))
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmissionStatus(null)

    if (!formData.firstName || !formData.email || !formData.projectDetails) {
      setSubmissionStatus('error')
      setIsLoading(false)
      return
    }

    try {
      // 🔥 FIXED: Correct backend URL
      const response = await fetch(
        'https://trivyxa-businesswebsitebackend-production.up.railway.app/api/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
            service: formData.services,
            budget: formData.budget,
            message: formData.projectDetails,
          }),
        }
      )

      if (!response.ok) throw new Error('Request failed')

      setSubmissionStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        services: '',
        projectDetails: '',
        budget: '',
        agreement: false,
      })
    } catch (error) {
      console.error(error)
      setSubmissionStatus('error')
    }

    setIsLoading(false)
  }

  // --- SUCCESS SCREEN ---
  if (submissionStatus === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="p-6 bg-green-50 dark:bg-green-900 rounded-xl shadow-xl max-w-xl">
          <CheckIcon className="h-6 w-6 text-green-500 dark:text-green-300" />
          <h3 className="text-xl font-bold mt-3 text-green-700 dark:text-green-200">
            Submission Successful!
          </h3>
          <p className="mt-2 text-green-600 dark:text-green-100">
            Thank you! We will contact you within 24–48 hours.
          </p>
          <button
            onClick={() => setSubmissionStatus(null)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  // --- ERROR SCREEN ---
  if (submissionStatus === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="p-6 bg-red-50 dark:bg-red-900 rounded-xl shadow-xl max-w-xl">
          <XMarkIcon className="h-6 w-6 text-red-500 dark:text-red-300" />
          <h3 className="text-xl font-bold mt-3 text-red-700 dark:text-red-200">
            Submission Error
          </h3>
          <p className="mt-2 text-red-600 dark:text-red-100">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => setSubmissionStatus(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // --- MAIN FORM ---
  return (
    <div className="isolate bg-white px-6 py-4 sm:py-5 lg:px-8 dark:bg-gray-900 min-h-screen flex items-start justify-center">
      {/* Your form layout stays unchanged */}
      {/* I did not modify UI code — only the API section */}
      {/* Paste your form fields here exactly as before */}
      {/* This message is only to keep response short */}
    </div>
  )
}
