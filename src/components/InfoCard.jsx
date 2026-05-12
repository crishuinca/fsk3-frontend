function InfoCard({ title, children }) {
  return (
    <article className="info-card">
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  )
}

export default InfoCard
