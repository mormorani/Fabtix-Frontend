import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css'
})
export class ArtistComponent implements OnInit {
  artists: any[] = [];
  cardStyles: string[] = [
    'Pink',
    'Purple',
    'Deep-Purple',
    'Indigo',
    'Blue',
    'Light-Blue',
    'Cyan',
    'Teal',
  ];
  activeCardIndex: number | null = null; // Track the active card index

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.getRandomCardStyles(); // Corrected to include parentheses
    this.artistService.getAllArtists().subscribe(
      (data: any[]) => {
        this.artists = data.map((artist) => ({
          ...artist,
          cardStyle: this.getRandomCardStyles(),
        }));
      },
      (error: any) => {
        console.error('Failed to fetch artists:', error);
      }
    );
  }

  getRandomCardStyles(): string {
    const randomIndex = Math.floor(Math.random() * this.cardStyles.length);
    return this.cardStyles[randomIndex];
  }

  toggleCard(index: number): void {
    console.log('Toggling card at index:', index); // Debugging
    this.activeCardIndex = this.activeCardIndex === index ? null : index; // Toggle active card
  }

  isActive(index: number): boolean {
    return this.activeCardIndex === index;
  }

}
