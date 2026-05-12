function ErrorMessage({ message }) {
  if (!message) return null

  return <p className="state state-error">{message}</p>
}

export default ErrorMessage
