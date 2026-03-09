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

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [done, setDone] = useState(false)

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) return
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #e8dcc8 0%, #d8cdb8 50%, #e0d5c2 100%)',
        padding: '20px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🎉</div>
          <h2 className="page-title" style={{ fontSize: '2rem', color: '#2c2c6e', marginBottom: '8px' }}>
            ¡Bienvenid@, {form.name}!
          </h2>
          <p style={{ fontFamily: "'Caveat', cursive", color: '#888', fontSize: '1.1rem', marginBottom: '24px' }}>
            tu libreta está lista ✏️
          </p>
          <Link href="/" className="btn-drawn btn-drawn-primary" style={{ display: 'inline-flex' }}>
            → abrir mi libreta
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #e8dcc8 0%, #d8cdb8 50%, #e0d5c2 100%)',
      padding: '20px',
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '8%', right: '5%', opacity: 0.15, fontSize: '3rem', transform: 'rotate(12deg)' }}>🌟</div>
        <div style={{ position: 'absolute', bottom: '18%', left: '5%', opacity: 0.13, fontSize: '2.5rem' }}>🎨</div>
        <div style={{ position: 'absolute', top: '60%', right: '4%', opacity: 0.12, fontSize: '2rem' }}>✨</div>
      </div>

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        <RingDecoration count={6} />
        <div className="notebook-card" style={{ padding: '36px 32px 32px 48px' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '16px',
            background: 'linear-gradient(135deg, #c0c0c0 25%, #a0a0a0 50%, #c0c0c0 75%)',
            borderRadius: '4px 0 0 4px',
          }} />
          <div style={{
            position: 'absolute', left: '-8px', top: 0, bottom: 0, width: '16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center',
          }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                width: '14px', height: '14px', borderRadius: '50%',
                background: '#d0c8b8', border: '2.5px solid #9a9a9a',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
              }} />
            ))}
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>📒</div>
            <h1 className="page-title" style={{ fontSize: '2rem' }}>Nueva libreta</h1>
            <p style={{ fontFamily: "'Caveat', cursive", color: '#888', fontSize: '1rem', marginTop: '4px' }}>
              crea tu cuenta y empieza ✏️
            </p>
          </div>

          {[
            { key: 'name', label: '👤 tu nombre', type: 'text', placeholder: '¿cómo te llamas?' },
            { key: 'email', label: '📧 correo', type: 'email', placeholder: 'tu@correo.com' },
            { key: 'password', label: '🔒 contraseña', type: 'password', placeholder: '••••••••' },
            { key: 'confirm', label: '🔒 confirmar', type: 'password', placeholder: 'repite tu contraseña' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '18px' }}>
              <label style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#888', display: 'block', marginBottom: '6px' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                className="input-drawn"
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="btn-drawn btn-drawn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '10px 20px', marginTop: '8px' }}
          >
            🎉 crear mi libreta
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#888' }}>
              ¿ya tienes cuenta?{' '}
              <Link href="/login" style={{ color: '#4a90e2', textDecoration: 'underline', textDecorationStyle: 'wavy' }}>
                inicia sesión →
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
