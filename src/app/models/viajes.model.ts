import { Carga } from "./carga.model";
import { Cargadores } from "./cargadores.model";
import { Remitos } from "./remitos.model";

export class Viajes{
    nroviaje:number;
    viaje:string;
    codtransporte:number;
    transporte:string;
    clientes:number;
    remitos: number;
    peso:number;
    fecha:string;
    detalle:Remitos[];
    cargadores:Cargadores[];
    carga:Carga;
    remitosCargados: any[]; //  "IdControlCargaRemito": 2, "Remito": "R0007", "NroViaje": "0000000574"
    segundos: number //385446.6252665
}

