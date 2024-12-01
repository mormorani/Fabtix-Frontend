import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';

/**
 * @Component
 * ArtistComponent
 * -------------------------
 * Displays a list of artists with randomly assigned card styles.
 *
 * Responsibilities:
 * - Fetch artist data from the backend.
 * - Assign random card styles to each artist.
 * - Provide functionality to toggle active card states for user interaction.
 * - Indicate loading status while data is being fetched.
 */
@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css',
})
export class ArtistComponent implements OnInit {
  /**
   * @property artists - Stores the list of artists fetched from the backend.
   */
  artists: any[] = [];

  /**
   * @property cardStyles - Defines the possible card styles for artist cards.
   */
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

  /**
   * @property activeCardIndex - Stores the index of the active card.
   * Used to toggle the state of individual cards.
   */
  activeCardIndex: number | null = null;

  /**
   * @property isLoading - Indicates whether the component is currently loading data.
   * Default: `true`.
   */
  isLoading: boolean = true;

  /**
   * Initializes the ArtistComponent and fetches artist data from the API.
   *
   * @constructor
   * @param artistService - The service for fetching artist data.
   */
  constructor(private artistService: ArtistService) {}

  /**
   * Angular lifecycle hook that runs after the component is initialized.
   * Fetches artist data from the backend and assigns random card styles to each artist.
   *
   * @returns {void} This function does not return any value.
   */
  ngOnInit(): void {
    this.getRandomCardStyles();
    this.artistService.getAllArtists().subscribe(
      (data: any[]) => {
        // Assign random styles to each artist
        this.artists = data.map((artist) => ({
          ...artist,
          cardStyle: this.getRandomCardStyles(),
        }));

        // Data fetched
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Failed to fetch artists:', error);
        // Notify the user about the error
        alert('Failed to fetch artists. Please try again later.');
        this.isLoading = false; // Stop loading on error
      }
    );
  }

  /**
   * Generates a random card style from the available `cardStyles` array.
   *
   * @remarks
   * This function is used to assign random styles to artist cards.
   *
   * @returns A randomly selected card style.
   */
  getRandomCardStyles(): string {
    const randomIndex = Math.floor(Math.random() * this.cardStyles.length);
    return this.cardStyles[randomIndex];
  }

  /**
   * Toggles the active state of a card by its index.
   * If the same card is clicked twice, it deactivates.
   *
   * @param index - The index of the artist card to toggle.
   *
   * @returns {void} This function does not return any value.
   */
  toggleCard(index: number): void {
    this.activeCardIndex = this.activeCardIndex === index ? null : index; // Toggle active card
  }

  /**
   * Checks whether a card is currently active.
   *
   * @param index - The index of the card to check.
   *
   * @returns `true` if the card is active, otherwise `false`.
   */
  isActive(index: number): boolean {
    return this.activeCardIndex === index;
  }
}
