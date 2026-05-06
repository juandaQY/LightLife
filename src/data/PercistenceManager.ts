import Database from '../../config/database';
import { User } from '../Core/User';
import { Task } from '../Core/Task';
import * as bcrypt from 'bcrypt'; // Importante: npm install bcrypt y npm install -D @types/bcrypt

// Arquitectura: guia 6 punto 3, aquí se adapta el componente de gestión de datos (DAO).
// Responsabilidad: Separar la lógica de base de datos de los controladores de la API.

export class PersistenceManager {
    private prisma = Database.getInstance().prisma;

    // ==========================================
    //         OPERACIONES DE USUARIO
    // ==========================================

    // CREATE
    async saveUser(user: User) {
        if (!user.password || user.password.trim() === '') {
            throw new Error('La contraseña es un campo obligatorio.');
        }

        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);

            const newUser = await this.prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: hashedPassword
                }
            });

            const { password, ...userWithoutPassword } = newUser;
            return userWithoutPassword;

        } catch (error) {
            console.error('[PersistenceManager] - Error en saveUser:', error);
            throw new Error('Ocurrió un error al registrar el usuario.');
        }
    }

    // READ (Por ID)
    async getUserById(id: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
            });
            
            if (!user) return null;

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.error('[PersistenceManager] - Error en getUserById:', error);
            throw new Error('Ocurrió un error al buscar el usuario.');
        }
    }

    // READ (Por Email - Útil para el Login)
    async getUserByEmail(email: string) {
        try {
            // Nota: Aquí SÍ devolvemos la contraseña porque la capa de servicio 
            // la necesitará para compararla con bcrypt.compare() durante el login.
            return await this.prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            console.error('[PersistenceManager] - Error en getUserByEmail:', error);
            throw new Error('Ocurrió un error al buscar el usuario por email.');
        }
    }

    // ==========================================
    //         OPERACIONES DE TAREAS
    // ==========================================

    // CREATE
    async saveTask(task: Task) {
        try {
            return await this.prisma.task.create({
                data: {
                    title: task.title,
                    description: task.description,
                    userId: task.userId,
                    // Añade aquí cualquier otro campo que tenga tu modelo Task (ej. status, dueDate)
                }
            });
        } catch (error) {
            console.error('[PersistenceManager] - Error en saveTask:', error);
            throw new Error('Ocurrió un error al crear la tarea.');
        }
    }

    // READ (Por Usuario)
    async getTasksByUser(userId: number) {
        try {
            return await this.prisma.task.findMany({
                where: { userId }
            });
        } catch (error) {
            console.error('[PersistenceManager] - Error en getTasksByUser:', error);
            throw new Error('Ocurrió un error al obtener las tareas del usuario.');
        }
    }

    // UPDATE
    async updateTask(taskId: number, taskData: Partial<Task>) {
        try {
            return await this.prisma.task.update({
                where: { id: taskId },
                data: {
                    title: taskData.title,
                    description: taskData.description,
                    // Añade los demás campos que permitas actualizar
                }
            });
        } catch (error) {
            console.error('[PersistenceManager] - Error en updateTask:', error);
            throw new Error('Ocurrió un error al actualizar la tarea.');
        }
    }

    // DELETE
    async deleteTask(taskId: number) {
        try {
            return await this.prisma.task.delete({
                where: { id: taskId }
            });
        } catch (error) {
            console.error('[PersistenceManager] - Error en deleteTask:', error);
            throw new Error('Ocurrió un error al eliminar la tarea.');
        }
    }
}
