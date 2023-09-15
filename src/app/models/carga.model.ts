import { Movimientos } from "./movimientos.model";

export class Carga{
    IdControlCarga: number;
    Nroviaje: string;
    Fecha: string;
    Estado: number;
    Fotos: string;
    Calificacion: number;
    movimientos:Movimientos[];
}

