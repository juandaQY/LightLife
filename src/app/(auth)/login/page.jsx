'use client'

import { useState } from 'react'
import Link from 'next/link'

function RingDecoration({ count = 7 }) {
  return (
    <div className="flex justify-around items-end px-6" style={{ height: '20px', marginBottom: '-2px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: '22px', height: '18px',
          border: '3px solid #8b8b8b', borderBottom: 'none',
          borderRadius: '50% 50% 0 0', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
            width: '8px', height: '8px', background: '#8b8b8b', borderRadius: '50%',
          }} />
        </div>
      ))}
    </div>
  )
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #e8dcc8 0%, #d8cdb8 50%, #e0d5c2 100%)',
      padding: '20px',
    }}>
      {/* BG doodles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.15, transform: 'rotate(-10deg)', fontSize: '3rem' }}>⭐</div>
        <div style={{ position: 'absolute', top: '20%', right: '8%', opacity: 0.13, transform: 'rotate(8deg)', fontSize: '2.5rem' }}>☁️</div>
        <div style={{ position: 'absolute', bottom: '20%', left: '8%', opacity: 0.13, fontSize: '2rem' }}>✏️</div>
        <div style={{ position: 'absolute', bottom: '15%', right: '6%', opacity: 0.15, transform: 'rotate(-5deg)', fontSize: '2.5rem' }}>🌸</div>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        <RingDecoration count={6} />
        <div className="notebook-card" style={{ padding: '36px 32px 32px 48px' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '16px',
            background: 'linear-gradient(135deg, #c0c0c0 25%, #a0a0a0 50%, #c0c0c0 75%)',
            borderRadius: '4px 0 0 4px',
          }} />

          {/* Rings */}
          <div style={{
            position: 'absolute', left: '-8px', top: 0, bottom: 0, width: '16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: '14px', height: '14px', borderRadius: '50%',
                background: '#d0c8b8', border: '2.5px solid #9a9a9a',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
              }} />
            ))}
          </div>

          {/* Header */}
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>📓</div>
            <h1 className="page-title" style={{ fontSize: '2.2rem' }}>¡Hola de nuevo!</h1>
            <p style={{ fontFamily: "'Caveat', cursive", color: '#888', fontSize: '1rem', marginTop: '4px' }}>
              abre tu libreta ✏️
            </p>
          </div>

          {/* Fields */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#888', display: 'block', marginBottom: '6px' }}>
              📧 correo electrónico
            </label>
            <input
              type="email"
              className="input-drawn"
              placeholder="tu@correo.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#888', display: 'block', marginBottom: '6px' }}>
              🔒 contraseña
            </label>
            <input
              type="password"
              className="input-drawn"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="btn-drawn btn-drawn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '10px 20px' }}
            disabled={loading}
          >
            {loading ? '⏳ entrando...' : '→ entrar a mi libreta'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#888' }}>
              ¿primera vez aquí?{' '}
              <Link href="/registro" style={{ color: '#4a90e2', textDecoration: 'underline', textDecorationStyle: 'wavy' }}>
                crea tu cuenta →
              </Link>
            </p>
            <Link href="/" style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#aaa', marginTop: '8px', display: 'block' }}>
              ← volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
