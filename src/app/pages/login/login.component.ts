import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PerformanceService } from '../../services/performance.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  loading = false; // Add a loading state

  constructor(
    private authService: AuthService,
    private performanceService: PerformanceService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form group here
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator]], // Added email validation
      password: ['', Validators.required],
    });
  }

  // Custom email validator that checks for a proper domain and TLD
  emailValidator(control: AbstractControl) {
    const value = control.value;
    // Regular expression to validate proper email format (with domain and TLD)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(value) ? null : { invalidEmail: true };
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true; // Set loading state
      const email = this.loginForm.value.email ?? '';
      const password = this.loginForm.value.password ?? '';

      this.authService.login(email, password).subscribe(
        (response: { accessToken: string; artistId: string }) => {
          // Store access token and artistId in localStorage
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('artistId', response.artistId);
          console.log(response.accessToken);
          this.loading = false; // Reset loading state

          // Set the token and artistId in the AuthService
          this.authService.artistId = response.artistId;
          this.authService.isLoggedIn = true;
          this.authService.loginStatus.next(this.authService.isLoggedIn);

          // Display success notification
          this.toastr.success('Login successful 🎉');

          // Navigate to the main page
          this.router.navigate(['/']);

          // Fetch performances only after successful login
          this.getPerformances();
        },
        (error: any) => {
          console.error('Invalid credentials:', error);
          this.loading = false; // Reset loading state
          this.toastr.error('Invalid credentials');
        }
      );
    }
  }

  // Function to fetch performances after login
  getPerformances(): void {
    this.performanceService.getPerformancesByArtistId().subscribe(
      (performances) => {
        if (performances.length > 0) {
          this.authService.hasPerformances = true;
        } else {
          this.authService.hasPerformances = false;
        }
        console.log('Performances:', performances);
      },
      (error) => {
        if (error.status === 404) {
          console.log('The artist has not added any performances yet');
        } else {
          console.error('Error fetching performances:', error);
          this.toastr.error('Error fetching performances');
        }
      }
    );
  }
}
