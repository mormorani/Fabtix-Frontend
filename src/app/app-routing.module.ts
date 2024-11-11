import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { TicketPurchaseComponent } from './pages/ticket-purchase/ticket-purchase.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AllPerformancesComponent } from './pages/all-performances/all-performances.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: AllPerformancesComponent },
  { path: 'artist', component: ArtistComponent },
  { path: 'buy', component: TicketPurchaseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
