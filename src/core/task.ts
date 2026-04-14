// Arquitectura: guia 6 punto 2, aqui se adapta el modelado de la entidad Task.
// Responsabilidad: Gestionar los datos de las tareas/notas adhesivas.

export class Task {
    private _id?: number;
    private _title: string;
    private _colIndex: number;
    private _rowIndex: number;
    private _rowSpan: number;
    private _userId: number;

    constructor(title: string, col: number, row: number, span: number, userId: number) {
        this._title = title;
        this._colIndex = col;
        this._rowIndex = row;
        this._rowSpan = span;
        this._userId = userId;
    }

    // Encapsulamiento mediante métodos de acceso
    public get title(): string { return this._title; }
    public set title(v: string) { this._title = v; }

    public get colIndex(): number { return this._colIndex; }
    public get rowIndex(): number { return this._rowIndex; }
    public get rowSpan(): number { return this._rowSpan; }
    public get userId(): number { return this._userId; }
}
