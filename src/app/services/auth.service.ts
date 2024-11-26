import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.backendUrl}/login`; // Use environment variable
  private url = `${environment.backendUrl}/signup`; // Use environment variable
  private api = `${environment.backendUrl}/artist`; // Use environment variable

  isLoggedIn: boolean = false;
  hasPerformances: boolean = false;
  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.isLoggedIn
  );
  artistId: String = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Handle login and store token in localStorage
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.accessToken);
        this.artistId = response.artist._id; // Set artist ID
        this.isLoggedIn = true; // Update login status
        this.loginStatus.next(true); // Notify observers about login status
        // Fetch artistId after successful login
        this.fetchArtistId();
      }),
      catchError((error) => {
        console.error('Login failed:', error.message);
        return throwError(() => new Error('Login failed. Please try again.'));
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
      tap((response) => {
        // Store the token in localStorage
        localStorage.setItem('authToken', response.token);
        // Set the token and artistId in the AuthService
        this.artistId = response.savedArtist._id;
        // Optionally fetch the artist ID and store it
        this.fetchArtistId();
      }),
      catchError((error) => {
        console.error('Signup failed:', error.message);
        return throwError(() => new Error('Signup failed. Please try again.'));
      })
    );
  }

  // Method to remove token and artist ID (for logout)
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('artistId');
    this.isLoggedIn = false; // Update login status
    this.loginStatus.next(false); // Update login status
    // Navigate to the main page
    this.router.navigate(['/']);
  }
}
