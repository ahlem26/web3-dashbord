"use client"

import { useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"
import emailjs from "emailjs-com"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    emailjs
      .send(
        "service_08aarkq", // Remplace par ton Service ID
        "template_jdjcxke", // Remplace par ton Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "cDiVI15RmrDYrrQv2" // Remplace par ta Public Key
      )
      .then(() => {
        setStatus("success")
        setFormData({ name: "", email: "", message: "" })
      })
      .catch(() => {
        setStatus("error")
      })
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* Header */}
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Have questions? We'd love to hear from you. Get in touch with us!
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
          <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Address</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">123 Web Street, Paris, France</p>
        </div>

        <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
          <Mail className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">contact@example.com</p>
        </div>

        <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
          <Phone className="h-6 w-6 text-red-600 dark:text-red-400 mb-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Phone</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">+33 1 23 45 67 89</p>
        </div>
      </div>

      {/* Contact form */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
              Your Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="message">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-green-600 mt-2">Your message has been sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-2">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </main>
  )
}
