import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl =
    'https://us-central1-backend-f52e5.cloudfunctions.net/api/api/reviews';

  constructor(private http: HttpClient) {}

  getReviews(performanceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${performanceId}`);
  }

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createReview(review: {
    performance: string;
    email: string;
    reviewerName: string;
    review: string;
  }): Observable<any> {
    return this.http.post<any>(this.baseUrl, review);
  }
}
