'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const DOODLES = {
  star: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2c2c6e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3 L18.5 11 L27 11 L20.5 16.5 L23 24.5 L16 19.5 L9 24.5 L11.5 16.5 L5 11 L13.5 11 Z" />
    </svg>
  ),
  heart: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 24 C14 24 3 17 3 9.5 C3 6.4 5.7 4 9 4 C11 4 13 5.2 14 7 C15 5.2 17 4 19 4 C22.3 4 25 6.4 25 9.5 C25 17 14 24 14 24Z" />
    </svg>
  ),
  sun: (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#cc8800" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="17" cy="17" r="6" />
      <line x1="17" y1="2" x2="17" y2="6" />
      <line x1="17" y1="28" x2="17" y2="32" />
      <line x1="2" y1="17" x2="6" y2="17" />
      <line x1="28" y1="17" x2="32" y2="17" />
      <line x1="6.5" y1="6.5" x2="9.4" y2="9.4" />
      <line x1="24.6" y1="24.6" x2="27.5" y2="27.5" />
      <line x1="27.5" y1="6.5" x2="24.6" y2="9.4" />
      <line x1="9.4" y1="24.6" x2="6.5" y2="27.5" />
    </svg>
  ),
  lightning: (
    <svg width="22" height="30" viewBox="0 0 22 30" fill="none" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 L4 16 L10 16 L9 28 L18 14 L12 14 Z" />
    </svg>
  ),
  flower: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#a040a0" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="15" cy="15" r="4" />
      <ellipse cx="15" cy="6" rx="3" ry="5" />
      <ellipse cx="15" cy="24" rx="3" ry="5" />
      <ellipse cx="6" cy="15" rx="5" ry="3" />
      <ellipse cx="24" cy="15" rx="5" ry="3" />
    </svg>
  ),
  cloud: (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" stroke="#4a90e2" strokeWidth="1.8" strokeLinecap="round">
      <path d="M8 20 C4 20 2 17 2 14 C2 11 4 9 7 9 C7.5 5 11 2 16 2 C21 2 25 5.5 25 10 C27 10 32 11 32 16 C32 19 29 20 26 20 Z" />
    </svg>
  ),
  checkmark: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#22aa22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10 L8 16 L17 4" />
    </svg>
  ),
  trash: (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="#cc2222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 5 L17 5" />
      <path d="M6 5 L6 2 L12 2 L12 5" />
      <path d="M3 5 L3 18 C3 19 4 20 5 20 L13 20 C14 20 15 19 15 18 L15 5" />
      <line x1="7" y1="9" x2="7" y2="16" />
      <line x1="11" y1="9" x2="11" y2="16" />
    </svg>
  ),
  pencil: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16 L14 5 L18 9 L7 20 Z" />
      <path d="M3 16 L2 20 L6 19 Z" />
      <line x1="12" y1="7" x2="16" y2="11" />
    </svg>
  ),
  notebook: (
    <svg width="28" height="30" viewBox="0 0 28 30" fill="none" stroke="#2c2c6e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="20" height="26" rx="1" />
      <line x1="9" y1="2" x2="9" y2="28" />
      <line x1="12" y1="8" x2="22" y2="8" />
      <line x1="12" y1="13" x2="22" y2="13" />
      <line x1="12" y1="18" x2="22" y2="18" />
      <line x1="12" y1="23" x2="18" y2="23" />
      <circle cx="6.5" cy="9" r="1.5" fill="#2c2c6e" />
      <circle cx="6.5" cy="15" r="1.5" fill="#2c2c6e" />
      <circle cx="6.5" cy="21" r="1.5" fill="#2c2c6e" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="9" y1="2" x2="9" y2="16" />
      <line x1="2" y1="9" x2="16" y2="9" />
    </svg>
  ),
}

const PRIORITY_OPTIONS = [
  { value: 'high', label: '🔥 Alta', className: 'priority-high' },
  { value: 'med', label: '⚡ Media', className: 'priority-med' },
  { value: 'low', label: '🌱 Baja', className: 'priority-low' },
]

const CATEGORY_OPTIONS = [
  { value: 'personal', label: '👤 Personal', color: '#a8d5f0' },
  { value: 'trabajo', label: '💼 Trabajo', color: '#ffd0a8' },
  { value: 'salud', label: '❤️ Salud', color: '#ffa8c0' },
  { value: 'estudio', label: '📚 Estudio', color: '#c8a8ff' },
  { value: 'hogar', label: '🏠 Hogar', color: '#a8ffb8' },
]

function RingDecoration({ count = 6 }) {
  return (
    <div className="flex justify-around items-end px-6 pb-0" style={{ height: '20px', marginBottom: '-2px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '22px',
            height: '18px',
            border: '3px solid #8b8b8b',
            borderBottom: 'none',
            borderRadius: '50% 50% 0 0',
            background: 'transparent',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '8px',
            background: '#8b8b8b',
            borderRadius: '50%',
          }} />
        </div>
      ))}
    </div>
  )
}

function TaskCard({ task, onToggle, onDelete }) {
  const priorityClass = {
    high: 'priority-high',
    med: 'priority-med',
    low: 'priority-low',
  }[task.priority]

  const priorityLabel = {
    high: '🔥 Alta',
    med: '⚡ Media',
    low: '🌱 Baja',
  }[task.priority]

  const bgColors = {
    personal: '#deeeff',
    trabajo: '#fff3dd',
    salud: '#ffe8ee',
    estudio: '#eedeff',
    hogar: '#dfffea',
  }

  const catLabel = CATEGORY_OPTIONS.find(c => c.value === task.category)?.label || '👤 Personal'

  return (
    <div
      className="float-in"
      style={{
        background: bgColors[task.category] || '#deeeff',
        border: '2px solid rgba(44,44,110,0.2)',
        borderRadius: task.done
          ? '2px 12px 2px 12px'
          : `${4 + Math.random() * 8}px ${8 + Math.random() * 6}px`,
        padding: '12px 14px',
        marginBottom: '10px',
        boxShadow: '2px 3px 8px rgba(0,0,0,0.1)',
        transform: `rotate(${(Math.random() - 0.5) * 0.8}deg)`,
        transition: 'all 0.25s ease',
        opacity: task.done ? 0.65 : 1,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '20px',
        width: '50px',
        height: '16px',
        background: 'rgba(255,240,150,0.75)',
        border: '1px solid rgba(200,180,0,0.3)',
        borderRadius: '2px',
        transform: 'rotate(-1deg)',
      }} />

      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className="checkbox-drawn mt-1 flex-shrink-0"
          style={{
            background: task.done ? '#a8d5f0' : 'transparent',
          }}
        >
          {task.done && <span style={{ color: '#1a3a7a', fontSize: '13px', fontWeight: 'bold' }}>✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className="font-medium"
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '1rem',
              color: '#2c2c6e',
              textDecoration: task.done ? 'line-through' : 'none',
              textDecorationColor: '#4a90e2',
              textDecorationThickness: '2px',
              wordBreak: 'break-word',
              lineHeight: '1.4',
            }}
          >
            {task.title}
          </p>

          {task.description && (
            <p style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '0.85rem',
              color: '#555',
              marginTop: '4px',
              fontStyle: 'italic',
            }}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={priorityClass}>{priorityLabel}</span>
            <span style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '0.8rem',
              color: '#888',
              background: 'rgba(255,255,255,0.6)',
              padding: '0 6px',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}>
              {catLabel}
            </span>
            <span style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '0.75rem',
              color: '#aaa',
              marginLeft: 'auto',
            }}>
              {new Date(task.createdAt).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity mt-1"
          title="Eliminar tarea"
        >
          {DOODLES.trash}
        </button>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'med',
    category: 'personal',
  })
  const [shake, setShake] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    const task = {
      id: Date.now(),
      ...newTask,
      done: false,
      createdAt: new Date().toISOString(),
    }

    setTasks(prev => [task, ...prev])
    setNewTask({ title: '', description: '', priority: 'med', category: 'personal' })
    setShowForm(false)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2200)
  }

  const handleToggle = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const filtered = tasks.filter(t => {
    if (filter === 'done') return t.done
    if (filter === 'pending') return !t.done
    return true
  })

  const pendingCount = tasks.filter(t => !t.done).length
  const doneCount = tasks.filter(t => t.done).length

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #e8dcc8 0%, #d8cdb8 50%, #e0d5c2 100%)',
      padding: '20px 16px',
    }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '8%', left: '3%', opacity: 0.18, transform: 'rotate(-15deg)' }}>{DOODLES.star}</div>
        <div style={{ position: 'absolute', top: '15%', right: '5%', opacity: 0.15, transform: 'rotate(10deg)' }}>{DOODLES.cloud}</div>
        <div style={{ position: 'absolute', top: '40%', left: '1%', opacity: 0.13, transform: 'rotate(5deg)' }}>{DOODLES.flower}</div>
        <div style={{ position: 'absolute', top: '65%', right: '3%', opacity: 0.16, transform: 'rotate(-8deg)' }}>{DOODLES.sun}</div>
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', opacity: 0.14, transform: 'rotate(12deg)' }}>{DOODLES.heart}</div>
        <div style={{ position: 'absolute', bottom: '5%', right: '7%', opacity: 0.12, transform: 'rotate(-5deg)' }}>{DOODLES.lightning}</div>
        <div style={{ position: 'absolute', top: '55%', left: '96%', opacity: 0.12 }}>{DOODLES.star}</div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

       
        <div style={{ marginBottom: '32px', position: 'relative' }}>
          <RingDecoration count={8} />
          <div className="notebook-card" style={{ padding: '28px 32px 24px 40px' }}>
            
            <div className="ring-holes">
              {[0,1,2,3].map(i => <div key={i} className="ring-hole" />)}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="doodle-star">{DOODLES.notebook}</span>
                  <h1 className="page-title" style={{ fontSize: '3rem', lineHeight: 1 }}>
                    LightLife
                  </h1>
                </div>
                <p style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '1.15rem',
                  color: '#888',
                  marginTop: '4px',
                  marginLeft: '4px',
                }}>
                  ✏️ tu libreta de tareas personal~
                </p>
              </div>

             
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  textAlign: 'center',
                  background: '#deeeff',
                  border: '2px solid rgba(74,144,226,0.3)',
                  borderRadius: '8px 2px 8px 2px',
                  padding: '8px 16px',
                }}>
                  <div className="page-title" style={{ fontSize: '1.8rem', color: '#1a3a7a' }}>{pendingCount}</div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#4a90e2' }}>pendientes</div>
                </div>
                <div style={{
                  textAlign: 'center',
                  background: '#dfffea',
                  border: '2px solid rgba(34,170,34,0.3)',
                  borderRadius: '2px 8px 2px 8px',
                  padding: '8px 16px',
                }}>
                  <div className="page-title" style={{ fontSize: '1.8rem', color: '#116611' }}>{doneCount}</div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#22aa22' }}>listas ✓</div>
                </div>
              </div>
            </div>

            
            <div className="flex gap-3 mt-4 flex-wrap">
              <Link href="/dashboard/usuario" style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1rem',
                color: '#4a90e2',
                textDecoration: 'underline',
                textDecorationStyle: 'wavy',
                textUnderlineOffset: '3px',
              }}>
                → mi perfil
              </Link>
              <Link href="/(auth)/login" style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1rem',
                color: '#e55',
                textDecoration: 'underline',
                textDecorationStyle: 'wavy',
                textUnderlineOffset: '3px',
              }}>
                → iniciar sesión
              </Link>
            </div>
          </div>
        </div>

        
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <RingDecoration count={6} />
          <div className="notebook-card" style={{ padding: '20px 24px 20px 40px' }}>
            <div className="ring-holes">
              {[0,1,2].map(i => <div key={i} className="ring-hole" />)}
            </div>

            
            {!showForm ? (
              <div className="flex items-center gap-3">
                <span style={{ opacity: 0.5 }}>{DOODLES.pencil}</span>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 text-left"
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    fontSize: '1.05rem',
                    color: '#aaa',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px dashed #ccc',
                    padding: '6px 4px',
                    cursor: 'text',
                    width: '100%',
                  }}
                >
                  ¿Qué necesitas hacer hoy?...
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-drawn btn-drawn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                >
                  {DOODLES.plus}
                  <span>nueva tarea</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  animation: shake ? 'none' : undefined,
                }}
              >
                <h3 className="page-title" style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
                  ✏️ anotar nueva tarea
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '0.95rem',
                    color: '#888',
                    display: 'block',
                    marginBottom: '4px',
                  }}>
                    ¿Qué hay que hacer?
                  </label>
                  <input
                    type="text"
                    className="input-drawn"
                    placeholder="escribe aquí tu tarea..."
                    value={newTask.title}
                    onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                    autoFocus
                    style={{
                      fontSize: '1.1rem',
                      outline: shake ? '2px solid #e55' : undefined,
                    }}
                  />
                  {shake && (
                    <p style={{ fontFamily: "'Caveat', cursive", color: '#e55', fontSize: '0.9rem', marginTop: '4px' }}>
                      ¡escribe algo primero! 😅
                    </p>
                  )}
                </div>

                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '0.95rem',
                    color: '#888',
                    display: 'block',
                    marginBottom: '4px',
                  }}>
                    nota extra (opcional)
                  </label>
                  <textarea
                    className="input-drawn"
                    placeholder="detalles, contexto, recordatorio..."
                    value={newTask.description}
                    onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    style={{ resize: 'vertical', borderBottom: '2.5px solid #2c2c6e', lineHeight: '1.5' }}
                  />
                </div>

                
                <div className="flex flex-wrap gap-4 mb-5">
                  <div>
                    <label style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#888', display: 'block', marginBottom: '8px' }}>
                      prioridad:
                    </label>
                    <div className="flex gap-2">
                      {PRIORITY_OPTIONS.map(p => (
                        <button
                          key={p.value}
                          onClick={() => setNewTask(prev => ({ ...prev, priority: p.value }))}
                          className={p.className}
                          style={{
                            cursor: 'pointer',
                            transform: newTask.priority === p.value ? 'scale(1.12)' : 'scale(1)',
                            boxShadow: newTask.priority === p.value ? '2px 2px 0 #2c2c6e' : 'none',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#888', display: 'block', marginBottom: '8px' }}>
                      categoría:
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {CATEGORY_OPTIONS.map(c => (
                        <button
                          key={c.value}
                          onClick={() => setNewTask(prev => ({ ...prev, category: c.value }))}
                          style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: '0.85rem',
                            padding: '2px 10px',
                            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                            border: `2px solid ${newTask.category === c.value ? '#2c2c6e' : 'rgba(44,44,110,0.25)'}`,
                            background: newTask.category === c.value ? c.color : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transform: newTask.category === c.value ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.15s',
                            boxShadow: newTask.category === c.value ? '2px 2px 0 rgba(44,44,110,0.3)' : 'none',
                          }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => { setShowForm(false); setNewTask({ title: '', description: '', priority: 'med', category: 'personal' }) }}
                    className="btn-drawn"
                    style={{ background: '#f0f0f0', fontSize: '0.95rem' }}
                  >
                    cancelar
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="btn-drawn btn-drawn-primary"
                    style={{ fontSize: '1rem' }}
                  >
                    {DOODLES.plus}
                    guardar tarea ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        
        {savedMsg && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#dfffea',
            border: '2px solid #22aa22',
            borderRadius: '8px 2px 8px 2px',
            padding: '10px 20px',
            boxShadow: '3px 3px 0 #22aa22',
            fontFamily: "'Caveat', cursive",
            fontSize: '1.1rem',
            color: '#116611',
            zIndex: 100,
            animation: 'float-in 0.3s ease-out',
          }}>
            ✅ ¡Tarea guardada!
          </div>
        )}

      
        {tasks.length > 0 && (
          <div style={{ position: 'relative' }}>
            <RingDecoration count={7} />
            <div className="notebook-card" style={{ padding: '20px 20px 24px 40px' }}>
              <div className="ring-holes">
                {[0,1,2,3,4].map(i => <div key={i} className="ring-hole" />)}
              </div>

              {/* Filter tabs */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="page-title" style={{ fontSize: '1.6rem' }}>
                  📋 mis tareas
                </h2>
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'todas' },
                    { key: 'pending', label: 'pendientes' },
                    { key: 'done', label: 'listas ✓' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      style={{
                        fontFamily: "'Caveat', cursive",
                        fontSize: '0.95rem',
                        padding: '3px 12px',
                        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                        border: '2px solid',
                        borderColor: filter === f.key ? '#2c2c6e' : 'rgba(44,44,110,0.2)',
                        background: filter === f.key ? '#deeeff' : 'transparent',
                        cursor: 'pointer',
                        color: filter === f.key ? '#1a3a7a' : '#888',
                        fontWeight: filter === f.key ? '600' : '400',
                        transition: 'all 0.15s',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              
              <div>
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', opacity: 0.5 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🍃</div>
                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: '#888' }}>
                      {filter === 'done' ? 'aún no has completado ninguna~' : 'no hay tareas aquí~'}
                    </p>
                  </div>
                ) : (
                  filtered.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>

              {doneCount > 0 && filter !== 'done' && (
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button
                    onClick={() => setTasks(prev => prev.filter(t => !t.done))}
                    style={{
                      fontFamily: "'Caveat', cursive",
                      fontSize: '0.9rem',
                      color: '#e55',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textDecorationStyle: 'wavy',
                    }}
                  >
                    limpiar completadas 🗑
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 24px',
            opacity: 0.6,
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '12px', lineHeight: 1 }}>📓</div>
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.4rem',
              color: '#555',
              lineHeight: 1.4,
            }}>
              tu libreta está vacía...<br/>
              <span style={{ fontSize: '1rem', color: '#888' }}>¡escribe tu primera tarea arriba! ✏️</span>
            </p>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px', opacity: 0.5 }}>
              {DOODLES.star}{DOODLES.heart}{DOODLES.cloud}
            </div>
          </div>
        )}

       
        <p style={{
          textAlign: 'center',
          marginTop: '32px',
          fontFamily: "'Caveat', cursive",
          fontSize: '0.9rem',
          color: '#aaa',
        }}>
          ✏️ LightLife ~ tu cuaderno digital~
        </p>
      </div>
    </div>
  )
}
