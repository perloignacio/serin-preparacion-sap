import { Injectable } from '@angular/core';
import { JsonResult } from 'src/app/models/JsonResults.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  cargando:boolean = false;
  fotoModal:string;
  constructor() { }


convertToJSON(objeto: any): JsonResult {
  var resultado: JsonResult;
  try {
    var objetoJson = JSON.stringify(objeto);
    resultado = {
      resultado: true,
      objeto: objetoJson,
    };
  } catch (error) {
    resultado = {
      resultado: false,
      objeto: 'No se pudo convertir el objeto al formato JSON',
    };
  }
  return resultado;
}

}