import { Component, OnInit } from '@angular/core';
import { PerformanceUpdateComponent } from '../../components/modals/performance-update/performance-update.component';
import { ConfirmationModalComponent } from '../../components/modals/confirmation-modal/confirmation-modal.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ArtistService } from '../../services/artist.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false; // Indicates the loading state during form submission

  constructor(
    private modalService: NgbModal,
    private artistService: ArtistService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the signup form with form controls and validators
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]], // Custom email validator for format
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
        ],
      ],
      genre: ['', Validators.required],
      image: [''],
      youtubeLink: [''],
    });
  }

  // Custom email validator that checks for a proper domain and TLD
  emailValidator(control: AbstractControl) {
    const value = control.value;
    // Regular expression to validate proper email format (with domain and TLD)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Returns null if valid, or an error object if invalid
    return emailPattern.test(value) ? null : { invalidEmail: true };
  }

  // Checks if an artist with the given email already exists
  checkArtistExists(artistEmail: string): void {
    this.artistService.getArtistByEmail(artistEmail).subscribe(
      (artist) => {
        // If data exists, that means the artist already exists
        if (artist) {
          // Artist already exists, show error message
          this.toastr.error('Artist already exists');
          this.loading = false;
          console.log('Artist already exists.');
        }
      },
      (error: any) => {
        // Handle the case when the artist is not found (404)
        if (error.status === 404) {
          // Artist not found, proceed with registration
          //console.log('Artist not found, proceed with registration');
          this.addNewArtist();
        } else {
          // Log other errors and show a user-friendly message
          console.error('Error checking artist', error);
          this.loading = false;
          this.toastr.error('An error occurred while checking the artist');
        }
      }
    );
  }

  // Registers a new artist if they don't already exist
  addNewArtist(): void {
    const artist = this.signupForm.value;

    this.authService.signupArtist(artist).subscribe(
      (response: any) => {
        this.loading = false; // Reset loading state

        this.toastr.success('Signup successful');
        this.openModal(); // Show the confirmation modal
        this.signupForm.reset(); // Clear the form on successful signup
        // Navigate to the main page
        this.router.navigate(['/']);
      },
      (error: any) => {
        console.error('Error adding artist:', error);
        this.loading = false; // Reset loading state on error
        this.toastr.error('Error adding artist');
      }
    );
  }

  // Opens a confirmation modal after successful signup
  openModal() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.result
      .then((result) => {
        if (result === 'later') {
          // Navigate to the login page
          this.router.navigate(['/login']); // Navigate to login page if user chooses to update later
        } else if (result === 'now') {
          // Open the PerformanceUpdateComponent modal
          this.openPerformanceUpdateModal(); // Open the performance update modal if user chooses to update now
        }
      })
      .catch((error) => {
        console.log('Modal dismissed:', error);
        this.signupForm.reset();
      });
  }

  // Opens a modal for updating performance information
  openPerformanceUpdateModal(): void {
    //this.modalService.open(PerformanceUpdateComponent);

    const modalRef = this.modalService.open(PerformanceUpdateComponent, {
      backdrop: 'static',
    });

    // Passing the data (performance, title, btnTitle) to the modal component
    modalRef.componentInstance.performance = null; // Pass performance data
    modalRef.componentInstance.title = 'Create New Performance'; // Pass title for the modal
    modalRef.componentInstance.btnTitle = 'Create'; // Pass the button title
  }

  // Triggered on form submission, starts the signup process if form is valid
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true; // Set loading state during submission
      const artistEmail = this.signupForm.value.email ?? '';

      this.checkArtistExists(artistEmail); // Check if artist exists before proceeding
    }
  }
}
