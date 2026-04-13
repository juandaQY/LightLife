# 📓 LiteLife — Tu agenda de papel

LiteLife es una app de gestión de horario con estética **skeuomorphic** (papel, tinta, washi tape).  
Construida con **Next.js 14 · Tailwind CSS · Prisma · NextAuth · dnd-kit**.

---

## 🚀 Setup rápido

### 1. Instala dependencias

```bash
npm install
```

### 2. Configura variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con:
- `DATABASE_URL` — tu PostgreSQL (puedes usar [Railway](https://railway.app) o local)
- `NEXTAUTH_SECRET` — genera con `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — desde [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### 3. Configura Google OAuth

En Google Cloud Console:
1. Crea un proyecto → APIs & Services → Credentials → OAuth 2.0 Client ID
2. Tipo: **Web application**
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### 4. Base de datos

```bash
npx prisma db push        # crea tablas
npx prisma studio         # opcional: UI visual
```

### 5. Corre el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) →  `/login`

---

## 📁 Estructura del proyecto

```
litelife/
├── prisma/
│   └── schema.prisma          # Modelos: User, Task, Schedule
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth + Register
│   │   │   ├── tasks/         # CRUD tareas
│   │   │   └── schedules/     # CRUD + conflictos + drag
│   │   ├── login/             # Página login
│   │   ├── register/          # Página registro
│   │   └── dashboard/         # Calendario + panel tareas
│   ├── components/
│   │   ├── auth/              # SessionProvider
│   │   ├── calendar/          # WeekCalendar, CalendarCell
│   │   ├── tasks/             # TaskPanel, TaskCard, Modales
│   │   └── ui/                # Sidebar
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   └── prisma.ts          # Cliente Prisma singleton
│   ├── types/                 # TypeScript interfaces
│   └── styles/
│       └── globals.css        # Sistema de diseño skeuomorphic
└── tailwind.config.js         # Tokens: paper, ink, washi, cork
```

---

## ✨ Features (v0.1)

- [x] Login con Google OAuth
- [x] Login/Registro con email + contraseña
- [x] Crear tareas con color washi, duración y descripción
- [x] Calendario semanal (Lun–Dom) por horas
- [x] Programar tareas en fecha/hora específica
- [x] Tareas recurrentes (días de la semana)
- [x] Drag & Drop para mover tareas en el calendario
- [x] Resolución automática de conflictos (desplaza 1h)
- [x] Diseño skeuomorphic: papel, tape, tinta, corcho

## 🗺️ Roadmap

- [ ] React Native app (compartir lógica de tipos y API)
- [ ] Vista mensual del calendario
- [ ] Notificaciones / recordatorios
- [ ] Colores y etiquetas personalizadas
- [ ] Exportar a PDF (como hoja de papel impresa)
- [ ] Modo oscuro (pizarra)

---

## 🎨 Sistema de diseño

| Token | Valor | Uso |
|---|---|---|
| `paper-card` | Clase CSS | Tarjetas con textura de papel |
| `btn-sketch` | Clase CSS | Botones con borde dibujado |
| `input-sketch` | Clase CSS | Inputs con línea discontinua |
| `sticky-note` | Clase CSS | Nota adhesiva amarilla |
| `washi-h` | Clase CSS | Tira washi tape horizontal |
| `font-handwriting` | Caveat | Texto estilo letra a mano |
| `cork` | `#c9a87c` | Fondo tablón de corcho |
| `washi-sage/rose/sky...` | Colores | Paleta washi tape |
