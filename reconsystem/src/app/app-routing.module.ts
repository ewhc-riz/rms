import { NgModule } from '@angular/core';
import { RouterModule, Routes, RoutesRecognized } from '@angular/router';
import { AddFranchiseComponent } from './components/add-franchise/add-franchise.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { TransferFranchiseComponent } from './components/transfer-franchise/transfer-franchise.component';
import { UsersComponent } from './components/users/users.component';
import { ViewFranchiseComponent } from './components/view-franchise/view-franchise.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { ReconComponent, UpdateRecon } from './components/recon/recon.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'main', component: MainComponent},
  {path: 'add-franchise', component: AddFranchiseComponent},
  {path: 'view-franchise', component: ViewFranchiseComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/:id', component: ViewUserComponent},
  {path: 'transfer-franchise', component: TransferFranchiseComponent},
  {path: 'recon', component: ReconComponent},
  {path: 'recon/:id', component: UpdateRecon},
  {path: 'reports', component: ReportsComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
