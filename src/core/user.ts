// src/core/user.ts

// Arquitectura: guia 6 punto 2, aqui se adapta la clase Entidad con encapsulamiento estricto.
// Responsabilidad: Representar la identidad y configuración del usuario.

export class User {
    // Atributos privados para proteger la integridad del objeto
    private _id?: number;
    private _name: string;
    private _email: string;
    private _password?: string;
    
    // 👇 NUEVOS ATRIBUTOS AGREGADOS PARA REFLEJAR LA BASE DE DATOS
    private _startHour: number;
    private _totalHours: number;
    private _interval: number;
    private _hasConfigured: boolean;

    constructor(
        name: string, 
        email: string, 
        id?: number, 
        startHour: number = 6, 
        totalHours: number = 16, 
        interval: number = 1, 
        hasConfigured: boolean = false
    ) {
        this._name = name;
        this._email = email;
        this._id = id;
        this._startHour = startHour;
        this._totalHours = totalHours;
        this._interval = interval;
        this._hasConfigured = hasConfigured;
    }

    // Getters y Setters públicos
    public get id(): number | undefined { return this._id; }
    public set id(value: number | undefined) { this._id = value; }

    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }

    public get email(): string { return this._email; }
    public set email(value: string) { this._email = value; }

    public get password(): string | undefined { return this._password; }
    public set password(value: string | undefined) { this._password = value; }

    // 👇 NUEVOS GETTERS Y SETTERS
    public get startHour(): number { return this._startHour; }
    public set startHour(value: number) { this._startHour = value; }

    public get totalHours(): number { return this._totalHours; }
    public set totalHours(value: number) { this._totalHours = value; }

    public get interval(): number { return this._interval; }
    public set interval(value: number) { this._interval = value; }

    public get hasConfigured(): boolean { return this._hasConfigured; }
    public set hasConfigured(value: boolean) { this._hasConfigured = value; }
}
