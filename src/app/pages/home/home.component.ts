import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { PerformanceService } from '../../services/performance.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare const $: any; // Declare the $ variable to avoid TypeScript errors

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  performances: any[] = []; // Initialize as an empty array
  reviewers: any[] = [];
  arrayReviews: string[] = [];
  carouselItems: number = 0; // Initialize with 0 items
  private carouselTimer: any; // Store the setInterval timer reference

  reviewForm!: FormGroup;
  selectedPerformance: string | null = null;
  dropdownOpened: boolean = false; // Flag to track if the dropdown has been opened
  isLoading: boolean = true;
  submit = false; // Add a loading state

  constructor(
    private reviewService: ReviewService,
    private performanceService: PerformanceService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initialize the form group here
    this.reviewForm = this.fb.group({
      performance: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Update here
      review: ['', Validators.required],
    });

    this.GetPerformanceData();
    this.getReviewsData();
    clearInterval(this.carouselTimer); // Clear existing timer
    this.carouselReviews();
  }

  carouselReviews(): void {
    const tickerItems = $('.carousel-inner-data ul li');
    const tickerHeight = tickerItems.outerHeight() || 0; // Assign 0 as the default height if it's undefined
    tickerItems.last().prependTo('.carousel-inner-data ul');
    $('.carousel-inner-data ul').css('marginTop', `-${tickerHeight}px`);

    const moveTop = () => {
      $('.carousel-inner-data ul').animate(
        {
          top: `-${tickerHeight}px`,
        },
        600,
        function () {
          $('.carousel-inner-data ul li:first-child').appendTo(
            '.carousel-inner-data ul'
          );
          $('.carousel-inner-data ul').css('top', '');
        }
      );
    };

    // Function to start the interval
    const startCarousel = () => {
      this.carouselTimer = setInterval(moveTop, 3600);
    };

    // Function to stop the interval
    const stopCarousel = () => {
      clearInterval(this.carouselTimer);
    };

    // Start the carousel initially
    startCarousel();

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopCarousel(); // Stop carousel if page is not visible
      } else {
        startCarousel(); // Restart carousel if page is visible
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselTimer); // Clear the setInterval timer when the component is destroyed
    document.removeEventListener('visibilitychange', this.carouselReviews); // Remove event listener to prevent memory leaks
  }

  getReviewsData() {
    this.isLoading = true; // Start loading
    this.reviewService.getAllReviews().subscribe(
      (data: any[]) => {
        this.reviewers = data.map((review) => ({
          ...review,
        }));
        this.carouselItems = this.reviewers.length;

        this.arrayReviews = data.map((review) => {
          const reviewerName = review.reviewerName || 'Unknown Reviewer';
          const reviewText = review.review || 'No Review Text';

          // Check if performance and artist exist
          const performance = review.performance || {};
          const artist = performance.artist || {};

          // If artist or performance data is missing, set a placeholder
          const artistName = artist.name || 'Unknown Artist';

          // Construct the review string
          return `${reviewerName}: ${artistName}: ${reviewText}`;
        });

        this.isLoading = false; // Stop loading
        // Manually trigger change detection to ensure the view updates
        // This is necessary because the data changes asynchronously
        // and Angular might not detect the changes automatically.
        this.cdr.markForCheck();

      },
      (error: any) => {
        console.error('Failed to fetch reviews:', error);
        this.isLoading = false; // Stop loading even if there's an error
        // Notify the user about the error
        alert('Failed to fetch reviews. Please try again later.');
      }
    );
  }

  selectPerformance(performanceId: string) {
    const selectedPerf = this.performances.find(
      (performance) => performance._id === performanceId
    );

    if (selectedPerf) {
      // Set the display name for the button
      this.selectedPerformance = `${selectedPerf.artistName} at ${selectedPerf.location} in ${selectedPerf.date}`;
      // Update the form control value
      this.reviewForm.controls['performance'].setValue(performanceId);
      this.dropdownOpened = false; // Reset dropdown flag when a selection is made
    }
  }

  openDropdown() {
    this.dropdownOpened = true; // Set dropdown flag when the dropdown is opened
  }

  submitReview() {
    this.submit = true; // Set loading state
    const selectedPerformanceId = this.reviewForm.value.performance; // This is the MongoDB _id
    const reviewData = {
      performance: selectedPerformanceId || '',
      email: this.reviewForm.value.email || '',
      reviewerName: this.reviewForm.value.name || '',
      review: this.reviewForm.value.review || '',
    };

    this.reviewService.createReview(reviewData).subscribe(
      (response: any) => {
        this.submit = false; // Reset loading state
        this.toastr.success('Review submitted successfully.', '', {
          positionClass: 'toast-center-center', // Apply the center position
        });
        this.getReviewsData(); // Refresh review data after submission
        this.reviewForm.reset();
        this.selectedPerformance = null; // Reset the dropdown to default text
      },
      (error: any) => {
        console.error('Failed to submit review:', error);
        this.submit = false; // Reset loading state
        if (error.error.message === 'Purchase not found') {
          // Show a message informing the user they can't write a review for a performance they didn't purchase a ticket for
          this.toastr.error(
            'You cannot write a review for a performance you did not purchase a ticket for.',
            '',
            {
              positionClass: 'toast-center-center', // Apply the center position
            }
          );
        } else {
          // Handle other errors
          this.toastr.error('Failed to submit the review. Please try again.');
          // Notify user with an alert as well
          alert('Failed to submit the review. Please try again later.');
        }
      }
    );
  }

  GetPerformanceData() {
    this.performanceService.getPerformances().subscribe((data: any[]) => {
      const today = new Date();
      this.performances = data
      .filter((performance: any) => new Date(performance.date) < today) // Filter out performances with dates earlier than today
      .map((performance: any) => ({
        _id: performance._id, 
        artistName: performance.artist.name,
        date: new Date(performance.date).toLocaleDateString('en-CA'),
        location: performance.location,
      }));
    });
  }

  navigateToSearch() {
    this.router.navigate(['/search']);
  }
}
