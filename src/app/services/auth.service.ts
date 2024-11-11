import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false;
  hasPerformances: boolean = false;
  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.isLoggedIn
  );
  artistId: String = '';

  constructor(private http: HttpClient) {}

  private apiUrl =
    'https://us-central1-backend-f52e5.cloudfunctions.net/api/login';
  private url =
    'https://us-central1-backend-f52e5.cloudfunctions.net/api/signup';
  private api =
    'https://us-central1-backend-f52e5.cloudfunctions.net/api/artist';

  // Handle login and store token in localStorage
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.accessToken);
        // Fetch artistId after successful login
        this.fetchArtistId();
      })
    );
  }

  // Fetch artist ID from the backend
  fetchArtistId(): void {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.http
      .get<{ artistId: string }>(this.api, {
        headers: { 'x-auth-token': token },
      })
      .subscribe(
        (response) => {
          localStorage.setItem('artistId', response.artistId);
        },
        (error) => {
          console.error('Error fetching artist ID:', error);
        }
      );
  }

  // Method to get artist ID from localStorage
  getLoggedInArtistId(): string | null {
    return localStorage.getItem('artistId');
  }

  // Method to remove token and artist ID (for logout)
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('artistId');
  }

  signupArtist(artist: {
    name: string;
    email: string;
    password: string;
    genre: string;
    image: string;
    youtubeLink: string;
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.url, artist, { headers }).pipe(
      catchError((error) => {
        console.error('Signup failed:', error.message);
        return throwError(() => new Error('Signup failed'));
      })
    );
  }
}
