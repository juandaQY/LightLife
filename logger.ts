import * as fs from 'fs';
import * as path from 'path';

export class Logger {
    // Definimos la ruta donde se guardará el archivo audit.log
    private static logFilePath = path.join(__dirname, '../../logs/audit.log');

    public static log(tipoEvento: string, mensaje: string): void {
        // 1. Verificamos si la carpeta /logs/ existe, si no, la creamos
        const logsDir = path.dirname(this.logFilePath);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        // 2. Formateamos la fecha exacta [FECHA_HORA]
        const fechaHora = new Date().toISOString().replace(/T/, ' ').substring(0, 19);
        
        // 3. Construimos el mensaje con los campos obligatorios que pide la guía
        const logEntry = `[${fechaHora}] [${tipoEvento}] [${mensaje}]\n`;

        // 4. Escribimos la línea en el archivo (append = agregar al final sin borrar lo anterior)
        fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
    }
}
