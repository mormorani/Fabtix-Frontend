import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private apiUrl =
    'https://us-central1-backend-f52e5.cloudfunctions.net/api/api/artists'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAllArtists(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getArtistByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email?email=${email}`);
  }

  getArtistNames(): Observable<string[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map((artists) => artists.map((artist) => artist.artistName)) // Extract only artistName
    );
  }
}
