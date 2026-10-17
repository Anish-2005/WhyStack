import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFound() {
  return (
    <div className="max-w-[1600px] mx-auto w-full min-h-screen flex flex-col pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-8">
      <Header />
      <main className="liquid-glass flex-1 flex flex-col items-center justify-center text-center p-8" aria-labelledby="not-found-heading">
        <h1 id="not-found-heading" className="text-4xl font-bold text-liquid-glow mb-3">Page not found</h1>
        <p className="text-slate-400 mb-6">That route does not exist. Return to the analysis workspace.</p>
        <Link className="btn btn-primary" to="/">Go to WhyStack</Link>
      </main>
    </div>
  )
}
