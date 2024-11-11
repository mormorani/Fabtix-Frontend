import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicketPurchaseComponent } from './pages/ticket-purchase/ticket-purchase.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ConfirmationModalComponent } from './components/modals/confirmation-modal/confirmation-modal.component';
import { PerformanceDetailComponent } from './components/modals/performance-detail/performance-detail.component';
import { PerformanceUpdateComponent } from './components/modals/performance-update/performance-update.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AllPerformancesComponent } from './pages/all-performances/all-performances.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    TicketPurchaseComponent,
    SignupComponent,
    ConfirmationModalComponent,
    PerformanceDetailComponent,
    PerformanceUpdateComponent,
    NavbarComponent,
    AllPerformancesComponent,
    ArtistComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
