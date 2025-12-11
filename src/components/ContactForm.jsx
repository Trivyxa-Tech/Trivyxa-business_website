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

// List of services for the select dropdown, now including a 'urlKey' for reliable matching
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
    services: '', // Holds a single selected service ID
    projectDetails: '',
    budget: '',
    agreement: false,
  })
  const [submissionStatus, setSubmissionStatus] = useState(null) // 'success', 'error', or null
  const [isLoading, setIsLoading] = useState(false)

  // Helper function to normalize strings for comparison (removes all non-alphanumeric chars)
  const cleanString = (str) => {
    if (!str) return ''
    // Removes spaces, slashes, dashes, parentheses, percent encoding, and converts to lowercase
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  }

  // --- URL Parsing and Initial State Setup ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlServiceName = params.get('service')

    if (urlServiceName) {
      // Clean the service name coming from the URL
      const cleanedUrlName = cleanString(urlServiceName)

      // Find the service that matches the cleaned URL name or the cleaned ID
      const matchedService = serviceOptions.find(option => {
        const cleanedUrlKey = cleanString(option.urlKey)
        const cleanedId = cleanString(option.id)
        
        // Check if the cleaned URL input matches the predefined URL Key OR the internal ID
        return cleanedUrlKey === cleanedUrlName || cleanedId === cleanedUrlName
      })

      if (matchedService) {
        // Set the initial state with the matched service ID
        setFormData(prev => ({
          ...prev,
          services: matchedService.id,
        }))
      }
    }
  }, []) // Empty dependency array ensures this runs once on mount
  // ------------------------------------------

  // Generic handler for all inputs: text, select (services, budget), and the main checkbox (agreement)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ✅ UPDATED: real API call to backend instead of simulated delay
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmissionStatus(null)

    // Basic form validation (check required fields)
    if (!formData.firstName || !formData.email || !formData.projectDetails) {
      setSubmissionStatus('error')
      setIsLoading(false)
      return
    }

    try {
      // Call backend API (Vite proxy → http://localhost:8080/api/contact)
      const response = await fetch('https://trivyxa-businesswebsitebackend-production.up.railway.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // This must match ContactRequest DTO in backend
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          service: formData.services,
          budget: formData.budget,
          message: formData.projectDetails,
        }),
      })

      if (response.ok) {
        console.log('Contact form sent successfully')
        setSubmissionStatus('success')
        // Clear the form after success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          services: '', // Reset
          projectDetails: '',
          budget: '',
          agreement: false,
        })
      } else {
        console.error('Backend returned non-OK status:', response.status)
        setSubmissionStatus('error')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmissionStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Success/Error Message Display ---
  if (submissionStatus === 'success') {
    return (
      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 w-full">
          <div className="rounded-xl bg-green-50 p-6 shadow-xl dark:bg-green-900/50">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckIcon className="h-6 w-6 text-green-500 dark:text-green-300" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                  Submission Successful!
                </h3>
                <div className="mt-3 text-base text-green-700 dark:text-green-100">
                  <p>Thank you for reaching out! We have received your request and will get back to you within 24-48 hours to discuss your project.</p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setSubmissionStatus(null)}
                    className="px-4 py-2 bg-green-200 text-green-900 text-sm font-semibold rounded-lg hover:bg-green-300 dark:bg-green-700 dark:text-white dark:hover:bg-green-600 transition-colors"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (submissionStatus === 'error') {
    return (
      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 w-full">
          <div className="rounded-xl bg-red-50 p-6 shadow-xl dark:bg-red-900/50">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-6 w-6 text-red-500 dark:text-red-300" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                  Submission Error
                </h3>
                <div className="mt-3 text-base text-red-700 dark:text-red-100">
                  <p>
                    We were unable to send your message. Please check your network connection or ensure all required
                    fields (<span className="text-red-600 font-medium">*</span>) are filled out correctly.
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setSubmissionStatus(null)}
                    className="px-4 py-2 bg-red-200 text-red-900 text-sm font-semibold rounded-lg hover:bg-red-300 dark:bg-red-700 dark:text-white dark:hover:bg-red-600 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Main Form Display ---
  return (
    <div id="contact" className="isolate bg-white px-6 py-4 sm:py-5 lg:px-8 dark:bg-gray-900 min-h-screen flex items-start justify-center">
      <div className="mx-auto max-w-4xl w-full">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            Contact Us
          </h2>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Tell Us About Your Project
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Get a personalized quote for your development needs. Fill out the form below, and we'll get back to you with a tailored solution.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-3xl sm:mt-20 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                First name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Last name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Phone number
              </label>
              <div className="relative mt-2.5">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* SERVICES DROPDOWN */}
            <div className="sm:col-span-2">
              <label htmlFor="services" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                What service are you primarily interested in?
              </label>
              <div className="mt-2.5">
                <select
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 transition-colors appearance-none pr-8"
                >
                  <option value="">Select a primary service (Optional)</option>
                  {serviceOptions.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Project Details */}
            <div className="sm:col-span-2">
              <label htmlFor="projectDetails" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Project Details <span className="text-red-500">*</span>
              </label>
              <div className="mt-2.5">
                <textarea
                  name="projectDetails"
                  id="projectDetails"
                  rows={4}
                  required
                  value={formData.projectDetails}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Budget Selection (Dropdown) */}
            <div className="sm:col-span-2">
              <label htmlFor="budget" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Estimated Budget
              </label>
              <div className="mt-2.5">
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 transition-colors appearance-none pr-8"
                >
                  <option value="">Select a range (Optional)</option>
                  <option value="4500-15000">₹4,500 - ₹15,000 (Static Site)</option>
                  <option value="15000-40000">₹15,000 - ₹40,000 (Frontend App)</option>
                  <option value="40000+">₹40,000+ (Full-Stack/Complex App)</option>
                </select>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="sm:col-span-2">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="agreement"
                    name="agreement"
                    type="checkbox"
                    checked={formData.agreement}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm/6 leading-6">
                  <label htmlFor="agreement" className="font-medium text-gray-900 dark:text-white cursor-pointer">
                    I agree to the
                  </label>{' '}
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                    privacy policy
                  </a>
                  .
                </div>
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={isLoading || !formData.agreement}
              className="group flex items-center justify-center w-full rounded-xl bg-indigo-600 px-6 py-3 text-lg font-bold text-white shadow-xl hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : "Let's Talk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
