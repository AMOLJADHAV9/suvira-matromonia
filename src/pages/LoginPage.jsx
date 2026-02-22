import React from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import LoginForm from '../components/auth/LoginForm'

const LoginPage = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    // When modal closes, go back to home (or previous page if desired)
    navigate('/', { replace: true })
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title="Login to Your Account"
      size="md"
    >
      <LoginForm />
    </Modal>
  )
}

export default LoginPage