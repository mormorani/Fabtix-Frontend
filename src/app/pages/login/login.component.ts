import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PerformanceService } from '../../services/performance.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

/**
 * @Component
 * LoginComponent
 * -------------------------
 * Handles user login functionality, including form validation, authentication,
 * and navigation upon successful login.
 *
 * Responsibilities:
 * - Displays a login form with email and password fields.
 * - Validates the form using Angular's reactive forms and custom validators.
 * - Sends login requests to the backend for authentication.
 * - Fetches performances for the authenticated artist.
 * - Displays notifications to the user for login status and errors.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  /**
   * @property loginForm - Reactive form group for the login form.
   * Contains `email` and `password` fields with validation rules.
   */
  loginForm!: FormGroup;
  /**
   * @property loading - Indicates the loading state during form submission.
   * 
   * Default: `false`.
   */
  loading = false; 

  /**
   * Initializes the login component and its dependencies.
   *
   * @param authService - The service for handling authentication operations.
   * @param performanceService - The service for fetching performances related to the artist.
   * @param toastr - The service for displaying notifications.
   * @param router - The Angular router for navigating between pages.
   * @param fb - The Angular FormBuilder for creating form groups.
   */
  constructor(
    private authService: AuthService,
    private performanceService: PerformanceService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {}


  /**
   * Angular lifecycle hook that runs after the component is initialized.
   * Initializes the login form group with email and password fields.
   *
   * @returns {void} This function does not return any value.
   */
  ngOnInit(): void {
    // Initialize the form group here
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator]], // Added email validation
      password: ['', Validators.required],
    });
  }

  /**
   * Custom email validator function for the login form.
   * This function checks if the provided email control value is in a valid format,
   * including a proper domain and TLD.
   *
   * @param control - The AbstractControl object representing the email form control.
   * @returns An object `{ invalidEmail: boolean }` if the email is invalid, or `null` if valid.
   * The `invalidEmail` property is set to `true` when the validation fails.
   */
  emailValidator(control: AbstractControl) {
    const value = control.value;
    // Regular expression to validate proper email format (with domain and TLD)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(value) ? null : { invalidEmail: true };
  }

  /**
   * Handles the login process by validating the form, making an API call to authenticate the user,
   * and navigating to the main page upon successful login.
   *
   * @returns {void} This function does not return any value.
   */
  onLogin(): void {
    // Check if the form is valid
    if (this.loginForm.valid) {
      // Set loading state to true
      this.loading = true;

      // Extract email and password from the form values
      const email = this.loginForm.value.email ?? '';
      const password = this.loginForm.value.password ?? '';

      // Make an API call to authenticate the user
      this.authService.login(email, password).subscribe(
        () => {
          // Reset loading state to false
          this.loading = false;

          // Display success notification
          this.toastr.success('Login successful 🎉');

          // Navigate to the main page
          this.router.navigate(['/']);

          // Fetch performances only after successful login
          this.getPerformances();
        },
        (error: any) => {
          // Log the error and display an error notification
          console.error('Invalid credentials:', error);
          this.loading = false; // Reset loading state
          this.toastr.error('Invalid credentials');
        }
      );
    }
  }

  /**
   * Fetches performances for the authenticated artist from the backend API.
   * Updates the `hasPerformances` property of the `AuthService` based on the fetched data.
   * Displays notifications to the user if no performances are found or if an error occurs during the fetch.
   *
   * @returns {void} This function does not return any value.
   */
  getPerformances(): void {
    this.performanceService.getPerformancesByArtistId().subscribe(
      (performances) => {
        if (performances.length > 0) {
          this.authService.hasPerformances = true;
        } else {
          this.authService.hasPerformances = false;
          // Notify the artist if no performances are found
          alert('You have not added any performances yet.');
        }
      },
      (error) => {
        if (error.status === 404) {
          console.log('The artist has not added any performances yet');
          // Notify the artist with an alert
          alert('You have not added any performances yet.');
        } else {
          console.error('Error fetching performances:', error);
          this.toastr.error('Error fetching performances');
        }
      }
    );
  }
}
