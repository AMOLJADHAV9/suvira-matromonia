import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import RegisterForm from '../components/auth/RegisterForm'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [registerModalOpen, setRegisterModalOpen] = useState(true)

  const handleClose = () => {
    navigate('/', { replace: true })
  }

  const handleRegistrationSuccess = () => {
    // Close modal and redirect to email verification page
    setRegisterModalOpen(false)
    navigate('/verify-email', { replace: true })
  }

  return (
    <Modal
      isOpen={registerModalOpen}
      onClose={handleClose}
      title="Create Your Profile"
      size="lg"
    >
      <RegisterForm onSuccess={handleRegistrationSuccess} />
    </Modal>
  )
}

export default RegisterPage
