import { Component } from '@angular/core';
import { PerformanceService } from '../../../services/performance.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerformanceUpdateComponent } from '../performance-update/performance-update.component';

@Component({
  selector: 'app-performance-detail',
  templateUrl: './performance-detail.component.html',
  styleUrl: './performance-detail.component.css',
})
export class PerformanceDetailComponent {
  artistId: string = '';
  performances: any[] = []; // Array to hold the performance details

  constructor(
    private performanceService: PerformanceService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.getPerformanceDetails();
  }

  getPerformanceDetails() {
    // Retrieve artistId from localStorage
    this.artistId = localStorage.getItem('artistId') || '';
    //console.log(localStorage.getItem('artistId'));
    // Fetch performance details if artistId is available
    if (this.artistId) {
      this.performanceService.getPerformancesByArtistId().subscribe(
        (data) => {
          this.performances = data;
        },
        (error) => {
          console.error('Error fetching performances:', error);
          // Notify the artist about the error
          alert('Failed to fetch performance details. Please try again later.');
        }
      );
    }
    else {
      // Notify the artist if artistId is not available in localStorage
      alert('Artist ID not found. Please log in again.');
    }
  }

  openUpdatePerformanceModal(performance: any): void {
    this.activeModal.close(); // Close PerformanceDetails modal
    // Logic to open the "Update Performance" modal and pass the performance data
    const modalRef = this.modalService.open(PerformanceUpdateComponent, {
      backdrop: 'static',
    });
    // const modalRef = this.modalService.open(PerformanceUpdateComponent);
    modalRef.componentInstance.performance = performance;

    modalRef.result.then(
      (result: any) => {
        if (result) {
          this.getPerformanceDetails(); // Refresh the list of performances after update
        }
      },
      (reason: any) => {
        // Handle dismissal (if necessary)
      }
    );
  }
}
