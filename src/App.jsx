import EcommerceStore from './EcommerceStore.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <EcommerceStore />
      <SpeedInsights />
      <Analytics />
    </>
  )
}
