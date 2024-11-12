import { Component, OnInit } from '@angular/core';
import { PerformanceService } from '../../services/performance.service';

@Component({
  selector: 'app-all-performances',
  templateUrl: './all-performances.component.html',
  styleUrl: './all-performances.component.css'
})
export class AllPerformancesComponent implements OnInit {
  performances: any[] = [];
  currentSortColumn!: string;
  isSortAscending!: boolean;
  searchQuery: string = '';

  filteredShows: any[] = [];

  constructor(private performanceService: PerformanceService) {}

  ngOnInit() {
    this.getShowsDeatils();
  }

  getShowsDeatils() {
    this.performanceService.getPerformances().subscribe(
      (data: any[]) => {
        this.performances = data;
        this.filteredShows = data;
      },
      (error: any) => {
        console.error('Failed to fetch shows:', error);
      }
    );
  }

  sortShows(column: string) {
    if (this.currentSortColumn === column) {
      this.isSortAscending = !this.isSortAscending;
    } else {
      this.currentSortColumn = column;
      this.isSortAscending = true;
    }

    this.filteredShows.sort((a, b) => {
      const aValue = this.getValueForSorting(this.getNestedValue(a, column));
      const bValue = this.getValueForSorting(this.getNestedValue(b, column));

      if (aValue < bValue) return this.isSortAscending ? -1 : 1;
      if (aValue > bValue) return this.isSortAscending ? 1 : -1;
      return 0;
    });
  }

  getNestedValue(show: any, column: string): any {
    // Handle nested properties based on the column name
    switch (column) {
      case 'artistName':
        return show.artist?.name; // Access artist name
      case 'showName':
        return show.name;
      case 'location':
        return show.location;
      case 'price':
        return show.price;
      case 'date':
        return show.date;
      default:
        return '';
    }
  }

  getValueForSorting(value: any): any {
    if (typeof value === 'string') {
      return value.toLowerCase();
    } else if (typeof value === 'number') {
      return value;
    } else {
      return '';
    }
  }

  trackByShowId(index: number, show: any): string {
    return show._id;
  }

  filterShows() {
    if (this.searchQuery.trim() !== '') {
      this.filteredShows = this.performances.filter(
        (show) =>
          show.artist?.name
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          show.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
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

  onSearch() {
    this.filterShows();
  }

}
