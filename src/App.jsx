import EcommerceStore from './EcommerceStore.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'

export default function App() {
  return (
    <>
      <EcommerceStore />
      <SpeedInsights />
    </>
  )
}
