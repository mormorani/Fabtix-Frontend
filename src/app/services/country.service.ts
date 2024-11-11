import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private baseUrl = 'https://countriesnow.space/api/v0.1/countries';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/positions`);
  }

  getCitiesByCountry(country: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cities`, { country });
  }
}
