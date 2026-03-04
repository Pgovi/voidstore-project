import EcommerceStore from './EcommerceStore.jsx'
import SEOHead from './components/SEOHead.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <SEOHead />
      <EcommerceStore />
      <SpeedInsights />
      <Analytics />
    </>
  )
}
