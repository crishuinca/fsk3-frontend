function Field({ label, value }) {
  return (
    <p className="field">
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </p>
  )
}

export default Field
