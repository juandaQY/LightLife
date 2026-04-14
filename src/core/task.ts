// Arquitectura: guia 6 punto 2, aqui se adapta la clase Entidad con encapsulamiento estricto.
// Responsabilidad: Representar la identidad y configuración del usuario.

export class User {
    // Atributos privados para proteger la integridad del objeto
    private _id?: number;
    private _name: string;
    private _email: string;
    private _password?: string;

    constructor(name: string, email: string, id?: number) {
        this._name = name;
        this._email = email;
        this._id = id;
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
}
