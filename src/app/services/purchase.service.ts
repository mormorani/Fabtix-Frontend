import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private baseUrl =
    'https://us-central1-fabtixapp.cloudfunctions.net/api/api/purchases';

  constructor(private http: HttpClient) {}

  makePurchase(performanceId: string, email: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { performanceId, email });
  }
}
