import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

// Punto 1 guia 5: Solución al acoplamiento. Se importa el módulo centralizado en lugar de inicializar la BD aquí.
import DatabaseSingleton from './database';

dotenv.config();

const app = express();

// Punto 3 guia 5: Uso del patrón Singleton. Obtenemos la instancia única de la base de datos.
const prisma = DatabaseSingleton.getInstance().getClient();

app.use(cors());
app.use(express.json());

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    if (typeof decoded.userId !== 'number') {
      return res.status(401).json({ error: 'Invalid token' }); 
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/auth/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Punto 1 guia 5: Se utiliza el cliente instanciado por el Singleton, mejorando la cohesión.
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
    // Punto 1 guia 5: Uso de la variable `prisma` centralizada.
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

app.get('/api/calendar', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { tasks: true }
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
    console.error("\n❌ ERROR FATAL EN BASE DE DATOS:");
    console.error(error);
    console.error("----------------------------------\n");
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

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

app.post('/api/tasks', authenticate, async (req: Request, res: Response) => {
  const { title, colIndex, rowIndex } = req.body;
  try {
    const task = await prisma.task.create({
      data: { title, colIndex, rowIndex, userId: req.userId as number }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

app.put('/api/tasks/positions', authenticate, async (req: Request, res: Response) => {
  const { updates } = req.body;
  try {
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
