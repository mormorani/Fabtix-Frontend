import { Component, OnInit } from '@angular/core';
import { PerformanceUpdateComponent } from '../../components/modals/performance-update/performance-update.component';
import { ConfirmationModalComponent } from '../../components/modals/confirmation-modal/confirmation-modal.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArtistService } from '../../services/artist.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false; // Add a loading state

  constructor(
    private modalService: NgbModal,
    private artistService: ArtistService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form group with validators
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required]],
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

    return emailPattern.test(value) ? null : { invalidEmail: true };
  }

  checkArtistExists(artistEmail: string): void {
    this.artistService.getArtistByEmail(artistEmail).subscribe(
      (artist) => {
        // If data exists, that means the artist already exists
        if (artist) {
          this.toastr.error('Artist already exists');
          console.log('Artist already exists.');
        }
      },
      (error: any) => {
        // Handle the case when the artist is not found (404)
        if (error.status === 404) {
          console.log('Artist not found, proceed with registration');
          this.addNewArtist();
        } else {
          console.error('Error checking artist', error);
          this.toastr.error('An error occurred while checking the artist');
        }
      }
    );
  }

  addNewArtist(): void {
    const artist = this.signupForm.value;

    this.authService.signupArtist(artist).subscribe(
      (response: any) => {
        console.log('Artist added:', response);
        this.toastr.success('Signup successful');
        this.openModal();
        this.signupForm.reset(); // Reset form after successful signup
      },
      (error: any) => {
        this.loading = false; // Reset loading state
        console.error('Error adding artist:', error);
        this.toastr.error('Error adding artist');
      }
    );
  }

  openModal() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.result
      .then((result) => {
        if (result === 'later') {
          // Navigate to the login page
          this.router.navigate(['/login']);
        } else if (result === 'now') {
          // Open the PerformanceUpdateComponent modal
          this.openPerformanceUpdateModal();
        }
      })
      .catch((error) => {
        console.log('Modal dismissed:', error);
        this.signupForm.reset();
      });
  }

  openPerformanceUpdateModal(): void {
    this.modalService.open(PerformanceUpdateComponent);
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true; // Set loading state
      const artistEmail = this.signupForm.value.email ?? '';

      this.checkArtistExists(artistEmail);
    }
  }

}
