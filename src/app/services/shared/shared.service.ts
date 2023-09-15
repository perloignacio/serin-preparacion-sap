import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  cargando:boolean = false;
  constructor() { }
}
