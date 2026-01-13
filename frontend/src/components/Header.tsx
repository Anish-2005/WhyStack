import React from 'react'

export default function Header() {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">whystack</h1>
        <p className="text-sm text-gray-600">Explain My System Like I'm 5 — deterministic, explainable root-cause reasoning</p>
      </div>
      <nav className="text-sm text-gray-500">
        <a className="mr-4 hover:text-gray-900" href="#">Docs</a>
        <a className="mr-4 hover:text-gray-900" href="#">Rules</a>
        <a className="hover:text-gray-900" href="#">About</a>
      </nav>
    </header>
  )
}
