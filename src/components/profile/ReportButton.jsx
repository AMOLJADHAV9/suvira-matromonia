import React, { useState } from 'react'
import { createReport } from '../../services/admin/adminReports'
import { REPORT_SEVERITY } from '../../utils/adminConstants'
import Button from '../ui/Button'

const REPORT_REASONS = [
  'Fake profile',
  'Inappropriate content',
  'Harassment',
  'Spam',
  'Misleading information',
  'Other',
]

const ReportButton = ({ reportedUserId, reportedByName, currentUserId, onReported }) => {
  const [showModal, setShowModal] = useState(false)
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState(REPORT_SEVERITY.MEDIUM)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason) return
    setLoading(true)
    const res = await createReport(reportedUserId, currentUserId, reason, message, severity)
    setLoading(false)
    if (res.success) {
      setSuccess(true)
      onReported?.()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="text-sm text-gray-500 hover:text-red-600"
      >
        Report
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-primary-maroon mb-4">Report Profile</h3>
            {success ? (
              <p className="text-green-600">Report submitted. Our team will review it.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-600 text-sm mb-4">Reporting: {reportedByName}</p>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl mb-4"
                  required
                >
                  <option value="">Select reason</option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl mb-4"
                >
                  <option value={REPORT_SEVERITY.LOW}>Low</option>
                  <option value={REPORT_SEVERITY.MEDIUM}>Medium</option>
                  <option value={REPORT_SEVERITY.HIGH}>High</option>
                </select>
                <label className="block text-sm font-medium mb-2">Additional details (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl mb-4"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading} disabled={!reason}>
                    Submit Report
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ReportButton
