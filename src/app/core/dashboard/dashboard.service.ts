import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Dashboard } from './dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  // Devuelve los parametros para el dashboard

  getDashboardCounts(): Observable<Dashboard[]> {
    return this._http.get<Dashboard[]>(`${this.url}/dashboard`);
  }

}
