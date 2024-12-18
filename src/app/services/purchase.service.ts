import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private baseUrl = `${environment.backendUrl}/api/purchases`; // Use environment variable

  constructor(private http: HttpClient) {}

  makePurchase(performanceId: string, email: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { performanceId, email });
  }
}
