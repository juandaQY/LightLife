import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const app = express();
const prisma = new PrismaClient({ adapter });
app.use(cors());
app.use(express.json());

// Ampliar la interfaz de Express para incluir userId en las peticiones
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// 🛡️ MIDDLEWARE: Verificar si el usuario está logueado
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    // 👇 NUEVO ESCUDO: Si el ID es de la versión vieja (texto), rechazamos el token
    if (typeof decoded.userId !== 'number') {
      return res.status(401).json({ error: 'Invalid token' }); 
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ==========================================
// 🔐 RUTAS DE AUTENTICACIÓN
// ==========================================
app.post('/auth/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: 'El correo ya existe o faltan datos' });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ==========================================
// 📅 RUTAS DEL CALENDARIO Y TAREAS
// ==========================================

// 1. Obtener la configuración y todas las tareas del usuario al iniciar
app.get('/api/calendar', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { tasks: true } // Trae todas las tareas del usuario
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    res.json({
      config: {
        startHour: user.startHour,
        totalHours: user.totalHours,
        interval: user.interval,
        hasConfigured: user.hasConfigured
      },
      tasks: user.tasks
    });
  } catch (error) {
    // 👇 ESTO ES LO NUEVO: Imprimirá el error real en tu consola 👇
    console.error("\n❌ ERROR FATAL EN BASE DE DATOS:");
    console.error(error);
    console.error("----------------------------------\n");
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});
// 2. Guardar la configuración inicial (Onboarding)
app.post('/api/config', authenticate, async (req: Request, res: Response) => {
  const { startHour, totalHours, interval } = req.body;
  try {
    await prisma.user.update({
      where: { id: req.userId },
      data: { startHour, totalHours, interval, hasConfigured: true }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
});

// 3. Crear una nueva tarea
app.post('/api/tasks', authenticate, async (req: Request, res: Response) => {
  const { title, colIndex, rowIndex, rowSpan } = req.body; // <-- Añade rowSpan aquí
  try {
    const task = await prisma.task.create({
      data: { title, colIndex, rowIndex, rowSpan, userId: req.userId as number } // <-- Añade rowSpan aquí
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// 4. Actualizar posiciones de tareas (soporta múltiples tareas a la vez)
app.put('/api/tasks/positions', authenticate, async (req: Request, res: Response) => {
  const { updates } = req.body; // updates es un arreglo: [{ id: 1, colIndex: 2, rowIndex: 3 }]
  try {
    // Actualizamos todas las tareas de golpe usando una transacción
    const updatePromises = updates.map((t: any) => 
      prisma.task.update({
        where: { id: t.id },
        data: { colIndex: t.colIndex, rowIndex: t.rowIndex }
      })
    );
    await prisma.$transaction(updatePromises);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar posiciones' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
