import { Task } from '../Core/Task';
import { PersistenceManager } from '../Data/PersistenceManager';

// Arquitectura: guia 7 punto 1, Componente de integración con Web Services (Equivalente a cURL en PHP).
export class ServiceConnector {
    // Usamos una API REST pública para simular la importación de tareas sugeridas
    private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

    // Realiza la petición GET y mapea los datos JSON
    private async fetchExternalTasks(limit: number = 3): Promise<any[]> {
        try {
            const response = await fetch(`${this.apiUrl}?_limit=${limit}`);
            
            // Arquitectura: guia 7 punto 1, Documentación de manejo de errores (404/500).
            if (!response.ok) {
                throw new Error(`Error de conexión WS. Código de estado: ${response.status}`);
            }
            
            // Gestión de la respuesta (Body)
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("❌ Fallo en la comunicación con el proveedor externo (Timeout/Error):", error);
            throw error;
        }
    }

    // Arquitectura: guia 7 punto 2, Refinamiento de la persistencia externa.
    // Mapea el JSON recibido a Objetos de Negocio (Task) y realiza la inserción.
    public async syncTasksForUser(userId: number): Promise<Task[]> {
        const externalData = await this.fetchExternalTasks();
        const manager = new PersistenceManager();

        // Mapeo: Del esquema externo (JSON) a nuestro Objeto de Negocio (Task)
        const tasksToSave: Task[] = externalData.map(item => 
            // Constructor: title, colIndex, rowIndex, rowSpan, userId
            new Task(item.title, 0, 0, 1, userId) 
        );

        // Inserción masiva para optimizar rendimiento de la BD
        await manager.saveMultipleTasks(tasksToSave);
        return tasksToSave;
    }
}
