import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import FaqsPage from './pages/FaqsPage'
import GetStartedPage from './pages/GetStartedPage'
import HomePage from './pages/HomePage'
import HowItWorksPage from './pages/HowItWorksPage'
import PayrollFundingPage from './pages/PayrollFundingPage'
import ProjectFinancingPage from './pages/ProjectFinancingPage'
import PurchaseFinancingPage from './pages/PurchaseFinancingPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="purchase-financing" element={<PurchaseFinancingPage />} />
          <Route path="project-financing" element={<ProjectFinancingPage />} />
          <Route path="payroll-funding" element={<PayrollFundingPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="faqs" element={<FaqsPage />} />
          <Route path="get-started" element={<GetStartedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
