import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from '../../services/purchase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticket-purchase',
  templateUrl: './ticket-purchase.component.html',
  styleUrl: './ticket-purchase.component.css'
})
export class TicketPurchaseComponent {

  ticketQuantity: number = 1; // Default to 1 ticket
  price: number | undefined; // Updated to number for price calculations
  performanceId!: string;
  checkoutForm!: FormGroup;

  countries: string[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  cardType: string | undefined;
  isSubmitting: boolean = false; // For showing loading indicator

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    private toastr: ToastrService,
    private countryService: CountryService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.price = Number(params['price']); // Convert price to number
      this.performanceId = params['id'];
    });
    this.loadCountries();
    this.checkoutForm = this.fb.group({
      ticketQuantity: [1, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      address: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          this.creditCardValidator,
        ],
      ],
      expiryDate: ['', [Validators.required, this.expiryDateValidator]],
      cvv: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\d{3,4}$/),
        ],
      ],
    });
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe(
      (response) => {
        this.countries = response.data.map((country: any) => country.name);
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  onCountryChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedCountry = input.value;
    this.countryService.getCitiesByCountry(this.selectedCountry).subscribe(
      (response) => {
        this.cities = response.data;
        this.checkoutForm.get('city')?.reset(); // Reset city selection
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  detectCardType(): string | undefined {
    const cleanedNumber = this.checkoutForm
      .get('cardNumber')
      ?.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (/^4/.test(cleanedNumber)) {
      return 'Visa';
    } else if (/^5[1-5]/.test(cleanedNumber)) {
      return 'MasterCard';
    } else if (/^3[47]/.test(cleanedNumber)) {
      return 'American Express';
    } else if (/^6(?:011|5[0-9]{2})/.test(cleanedNumber)) {
      return 'Discover';
    } else if (/^(?:2131|1800|35\d{3})/.test(cleanedNumber)) {
      return 'JCB';
    } else {
      return undefined; // No recognized card type
    }
  }

  // Calculate total price based on ticket quantity
  getTotalPrice(): number {
    return this.price
      ? this.price * this.checkoutForm.get('ticketQuantity')?.value
      : 0;
  }

  formatExpiryDate(event: Event) {
    const input = event.target as HTMLInputElement;
    // Remove any non-digit characters from the input value
    let value = input.value.replace(/\D/g, '');

    // If there are 2 or more digits, insert the slash
    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    // Update the Form Control Value
    this.checkoutForm.get('expiryDate')?.setValue(value, { emitEvent: false });
  }

  // Custom validator for expiry date
  expiryDateValidator(control: AbstractControl) {
    const value = control.value;
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      return { invalidExpiryDate: true };
    }

    const [month, year] = value
      .split('/')
      .map((val: string) => parseInt(val, 10));
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (
      month < 1 ||
      month > 12 ||
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      return { invalidExpiryDate: true };
    }
    return null;
  }

  // Custom email validator that checks for a proper domain and TLD
  emailValidator(control: AbstractControl) {
    const value = control.value;
    // Regular expression to validate proper email format (with domain and TLD)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(value) ? null : { invalidEmail: true };
  }

  // Custom validator for credit card number using the Luhn algorithm
  creditCardValidator(control: AbstractControl) {
    const value = control.value.replace(/\D/g, ''); // Remove any non-numeric characters
    // Ensure the card number is of valid length (13 to 19 digits)
    if (!/^\d{13,19}$/.test(value) || !this.isValidLuhn(value)) {
      return { invalidCreditCard: true };
    }
    return null; // Valid card number
  }

  // Luhn algorithm function for validating credit card numbers
  isValidLuhn(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.isSubmitting = true; // Show loading indicator
      this.purchaseService
        .makePurchase(this.performanceId, this.checkoutForm.get('email')?.value)
        .subscribe(
          (response: any) => {
            console.log(response);
            this.isSubmitting = false; // Hide loading indicator
            this.toastr.success(
              'The payment was successfully received. The tickets will be sent to your email.',
              '',
              {
                positionClass: 'toast-center-center',
              }
            );
            this.router.navigate(['/']);
            this.checkoutForm.reset(); // Reset form after successful purchase
          },
          (error: any) => {
            console.error(error);
            this.isSubmitting = false; // Hide loading indicator
            this.toastr.error('Error in purchase. Please try again.');
          }
        );
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
