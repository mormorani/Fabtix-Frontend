import { Component, OnInit } from '@angular/core';
import { PerformanceService } from '../../services/performance.service';

/**
 * @Component
 * AllPerformancesComponent
 * -------------------------
 * Displays a list of all performances with options to search, filter, and sort the data.
 *
 * Responsibilities:
 * - Fetch and display performances.
 * - Provide search functionality.
 * - Allow sorting by specified columns.
 */
@Component({
  selector: 'app-all-performances',
  templateUrl: './all-performances.component.html',
  styleUrl: './all-performances.component.css',
})
export class AllPerformancesComponent implements OnInit {

  /**
   * @property performances - Holds the list of performances fetched from the backend.
   * Default: An empty array.
   */
  performances: any[] = [];

    /**
   * @property currentSortColumn - Specifies the column by which performances are currently sorted.
   */
  currentSortColumn!: string;

    /**
   * @property isSortAscending - Indicates whether the sorting is in ascending order.
   */
  isSortAscending!: boolean;

 /**
   * @property searchQuery - Stores the search query entered by the user.
   * Default: An empty string.
   */
  searchQuery: string = '';

    /**
   * @property filteredShows - Stores the filtered list of performances based on search criteria.
   * Default: An empty array.
   */
  filteredShows: any[] = [];

  /**
   * Initializes the AllPerformancesComponent.
   *
   * @constructor
   * @param performanceService - The service for fetching performance data.
   */
  constructor(private performanceService: PerformanceService) {}

  /**
   * Angular lifecycle hook that runs after the component is initialized.
   * Fetches and initializes the list of performances.
   *
   * @returns This function does not return any value.
   */
  ngOnInit() {
    this.getShowsDeatils();
  }

  /**
   * Fetches and initializes the list of performances from the backend.
   *
   * @returns This function does not return any value.
   */
  getShowsDeatils() {
    this.performanceService.getPerformances().subscribe(
      (data: any[]) => {
        this.performances = data;
        this.filteredShows = data;
      },
      (error: any) => {
        console.error('Failed to fetch shows:', error);
        // Notify the user about the error
        alert('Failed to fetch shows. Please try again later.');
      }
    );
  }

  /**
   * Sorts the list of performances based on the specified column.
   * If the column is already sorted, toggles the sorting order.
   *
   * @param column - The column name to sort by.
   *
   * @returns This function does not return any value.
   */
  sortShows(column: string) {
    // Check if the same column is being sorted; toggle the sort direction if true.
    if (this.currentSortColumn === column) {
      this.isSortAscending = !this.isSortAscending;
    } else {
      // Set the new sorting column and default the sort direction to ascending.
      this.currentSortColumn = column;
      this.isSortAscending = true;
    }

    // Perform the sort on the `filteredShows` array.
    this.filteredShows.sort((a, b) => {
      // Retrieve the values for the specified column from both items.
      const aValue = this.getValueForSorting(this.getNestedValue(a, column));
      const bValue = this.getValueForSorting(this.getNestedValue(b, column));

      // Compare the values and determine sort order.
      if (aValue < bValue) return this.isSortAscending ? -1 : 1;
      if (aValue > bValue) return this.isSortAscending ? 1 : -1;
      return 0; // If values are equal, maintain their relative order.
    });
  }


  /**
 * Extracts the value of a property, including nested properties, from the show object for sorting purposes.
 * Handles cases where certain properties (e.g., artist name) are nested, meaning they are part of another object within the main object.
 * 
 * @param {any} show - The show object from which the value is to be extracted.
 * @param {string} column - The column name or key for which the value is needed.
 * @returns {any} The value extracted from the `show` object based on the specified column.
 */
  getNestedValue(show: any, column: string): any {
    // Handle nested properties based on the column name
    switch (column) {
      case 'artistName':
          // Access the nested `name` property inside the `artist` object.
      // If `artist` is undefined or null, safely return undefined using optional chaining (`?.`).
        return show.artist?.name; 
      case 'location':
        return show.location; // Access show location directly
      case 'price':
        return show.price;
      case 'date':
        return show.date;
      default:
        return '';
    }
  }

  /**
 * @param {any} value - The value to normalize for sorting.
 * @returns {any} The normalized value suitable for sorting.
 * @description Normalizes the input value to ensure consistent sorting.
 * - Converts strings to lowercase for case-insensitive sorting.
 * - Passes through numbers as-is.
 * - Defaults to an empty string for unsupported data types.
 */
  getValueForSorting(value: any): any {
    if (typeof value === 'string') {
      return value.toLowerCase(); // Convert strings to lowercase for consistent sorting
    } else if (typeof value === 'number') {
      return value;
    } else {
      return '';
    }
  }

  /**
 * A function to generate a unique key for each show item in a list for efficient DOM manipulation.
 *
 * @param index - The index of the show item in the list.
 * @param show - The show object for which the unique key is being generated.
 *
 * @returns A unique string key for the show item, based on its `_id` property.
 *
 * @remarks
 * This function is used in conjunction with Angular's `*ngFor` directive to provide a unique identifier
 * for each show item in a list. By using the `_id` property of the show object, we ensure that Angular
 * can efficiently track and update the corresponding DOM elements when the list changes.
 */
  trackByShowId(index: number, show: any): string {
    return show._id;
  }


  /**
   * Filters the list of performances based on the search query.
   *
   * @remarks
   * This function checks if the search query is not empty. If it's not, it filters the performances array
   * based on the artist name, location, price, and date. The search is case-insensitive and includes partial matches.
   * If the search query is empty, it resets the filteredShows array to the original performances array.
   *
   * @returns This function does not return any value.
   */
  filterShows() {
    if (this.searchQuery.trim() !== '') {
      this.filteredShows = this.performances.filter(
        (show) =>
          show.artist?.name
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          show.location
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          show.price
            ?.toString()
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          show.date?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredShows = this.performances;
    }
  }

/**
 * Handles the search functionality by calling the `filterShows` method.
 *
 * @remarks
 * This function is triggered when the user performs a search. It updates the
 * `filteredShows` array based on the search query entered by the user.
 *
 * @returns This function does not return any value.
 */
  onSearch() {
    this.filterShows();
  }

}
