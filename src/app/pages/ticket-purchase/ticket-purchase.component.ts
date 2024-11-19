import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from '../../services/purchase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-ticket-purchase',
  templateUrl: './ticket-purchase.component.html',
  styleUrl: './ticket-purchase.component.css',
})
export class TicketPurchaseComponent {
  ticketQuantity: number = 1; // Default to 1 ticket
  price: number | undefined; // Updated to number for price calculations
  performanceId!: string;
  checkoutForm!: FormGroup;

  countries: string[] = [];
  selectedCountry: string = '';
  cardType: string | undefined;
  isSubmitting: boolean = false; // For showing loading indicator
  isFetchingCities: boolean = false;
  isCreditNumberInvalid!: boolean;

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
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
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

  // Validate Credit Card Number with Luhn Algorithm
  checkCreditCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    // Remove any non-digit characters from the input value
    let value = input.value.replace(/\D/g, '');

    if (!value) {
      this.isCreditNumberInvalid = true; // Set invalid if the input is empty or undefined
      return;
    }

    const cleanedNumber = value.replace(/\D/g, ''); // Remove non-numeric characters

    const cardNumberPattern =
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;

    // Check if card pattern matches
    this.isCreditNumberInvalid = !cardNumberPattern.test(cleanedNumber);

    // console.log(this.isCreditNumberInvalid);
    let sum = 0;
    let double = false;
    for (let i = cleanedNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanedNumber.charAt(i), 10);
      if (double) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      double = !double;
    }
    // console.log(sum);
    // Checksum validation (Luhn algorithm)
    this.isCreditNumberInvalid = this.isCreditNumberInvalid || sum % 10 !== 0;
    // Detect card type and update the variable
    this.cardType = this.detectCardType();
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && !this.isCreditNumberInvalid) {
      this.isSubmitting = true; // Show loading indicator
      this.purchaseService
        .makePurchase(this.performanceId, this.checkoutForm.get('email')?.value)
        .subscribe(
          (response: any) => {
            console.log('Purchase successful. Server response:', response);
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
            console.error('Error occurred during the purchase process:', error);
            this.isSubmitting = false; // Hide loading indicator
            this.toastr.error('Error in purchase. Please try again.');
          }
        );
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
