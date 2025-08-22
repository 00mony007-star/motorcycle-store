import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ThemeSwitcher } from '../ThemeSwitcher'

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ThemeSwitcher />
    </div>
  )
}
