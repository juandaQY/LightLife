import Database from '../../config/database';
import { User } from '../Core/User';
import { Task } from '../Core/Task';

// Arquitectura: guia 6 punto 3, aqui se adapta el componente de gestión de datos (DAO).
// Responsabilidad: Separar la lógica de base de datos de los controladores de la API.

export class PersistenceManager {
    private prisma = Database.getInstance().prisma;

    // Operación CREATE para Usuario
    async saveUser(user: User): Promise<any> {
        try {
            return await this.prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password || 'default_pass'
                }
            });
        } catch (error) {
            throw new Error(`Error en persistencia: ${error}`);
        }
    }

    // Operación READ para Tareas
    async getTasksByUser(userId: number) {
        return await this.prisma.task.findMany({
            where: { userId }
        });
    }

    // Arquitectura: Aqui se podrían añadir el resto de operaciones CRUD (Update, Delete)
}
