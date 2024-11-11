import { Component } from '@angular/core';
import { PerformanceDetailComponent } from '../modals/performance-detail/performance-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { PerformanceService } from '../../services/performance.service';
import { PerformanceUpdateComponent } from '../modals/performance-update/performance-update.component';

declare var bootstrap: any; // Ensure bootstrap is globally available

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    public authService: AuthService,
    private modalService: NgbModal,
    // private router: Router,
    private performanceService: PerformanceService,
    // private toastr: ToastrService
  ) {}

  updateShow() {
    if (!this.authService.hasPerformances) {
      console.error('No performances to update.');
      return;
    }
    const modalRef = this.modalService.open(PerformanceDetailComponent, {
      backdrop: 'static',
      size: 'lg',
    });

    // Optionally, handle the result of the modal
    modalRef.result.then(
      (result) => {
        // Handle result if needed
      },
      (reason) => {
        // Handle dismissal if needed
      }
    );
  }

  createNewShow() {
    const modalRef = this.modalService.open(PerformanceUpdateComponent, {
      backdrop: 'static',
    });

    // Passing the data (performance, title, btnTitle) to the modal component
    modalRef.componentInstance.performance = null; // Pass performance data
    modalRef.componentInstance.title = 'Create New Performance'; // Pass title for the modal
    modalRef.componentInstance.btnTitle = 'Create'; // Pass the button title

    // Optionally, handle the result of the modal
    modalRef.result.then(
      (result) => {
        // Handle result if necessary (e.g., refresh the list of performances)
        this.getPerformances();
      },
      (reason) => {
        // Handle dismissal if needed
      }
    );
  }

  // Method to close the navbar menu
  closeNavbar() {
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarCollapse) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false, // Prevents immediate toggle
      });
      bsCollapse.hide(); // Closes the navbar
    }
  }

  getPerformances() {
    // Fetch performances based on the artist ID
    const artistId = localStorage.getItem('artistId') || '';

    if (artistId) {
      this.performanceService.getPerformancesByArtistId().subscribe(
        (performances: any) => {
          this.authService.hasPerformances = performances.length > 0;
        },
        (error: any) => {
          console.error('Error fetching performances:', error);
        }
      );
    }
  }

}
