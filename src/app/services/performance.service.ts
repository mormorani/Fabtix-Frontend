import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private baseUrl = `${environment.backendUrl}/api/performances`; // Use environment variable

  constructor(private http: HttpClient) {}

  getPerformances(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getPerformance(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getPerformancesByArtistId(): Observable<any> {
    //const token = localStorage.getItem('accessToken'); // Retrieve token from storage
    const token = localStorage.getItem('authToken'); // Retrieve token from storage

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the JWT token in the request header
    });

    return this.http.get<any>(`${this.baseUrl}/performances`, { headers });
  }
  
  updatePerformance(performance: any): Observable<any> {
    //const token = localStorage.getItem('accessToken'); // Retrieve token from storage
    const token = localStorage.getItem('authToken'); // Retrieve token from storage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    console.log(JSON.stringify(performance));
    return this.http.put<any>(
      `${this.baseUrl}/${performance._id}`,
      performance,
      { headers }
    );
  }

  createPerformance(performanceData: any): Observable<any> {
    //const token = localStorage.getItem('accessToken'); // Retrieve token from storage
    const token = localStorage.getItem('authToken'); // Retrieve token from storage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.baseUrl}/create`, performanceData, {
      headers,
    });
  }
}
