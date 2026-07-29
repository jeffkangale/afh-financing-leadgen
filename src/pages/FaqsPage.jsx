const faqs = [
  ['What types of financing can I enquire about?', 'You can enquire about purchase or acquisition financing, project, renovation, or expansion financing, and payroll funding.'],
  ['Is CareBearBooks the lender?', 'CareBearBooks is not the lender. We help clients understand available options and connect them with applicable financing processes or partners.'],
  ['Is financing guaranteed?', 'No. Financing is subject to the provider’s application, eligibility, underwriting, approval, pricing, and final terms.'],
  ['What is Payro Finance?', 'Payro Finance provides payroll-focused business financing for approved businesses experiencing temporary payroll cash-flow gaps.'],
  ['Can Payro Finance fund an AFH property purchase or renovation?', 'The Payro programme shown on this website is specifically for payroll funding. Purchase, acquisition, renovation, and project-financing enquiries should be submitted through the CareBearBooks enquiry form.'],
  ['How long does the Payro application take?', 'The Payro Finance application typically takes approximately 5–7 minutes.'],
]

export default function FaqsPage() {
  return (
    <section className="faqs section" id="faqs">
      <div className="section-heading">
        <p className="eyebrow">FAQS</p>
        <h2>Common questions.</h2>
      </div>
      <div className="faq-list">
        {faqs.map(([question, answer]) => (
          <details className="faq-item" key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
