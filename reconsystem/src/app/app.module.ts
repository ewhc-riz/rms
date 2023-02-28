import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { MainComponent } from './components/main/main.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { UsersComponent } from './components/users/users.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { MatMomentDateModule} from '@angular/material-moment-adapter';
import { MatGridListModule } from '@angular/material/grid-list';
import { DialogTransferFranchiseRequest, TransferFranchiseComponent } from './components/transfer-franchise/transfer-franchise.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { AddFranchiseComponent, DialogAddFranchiseRequest } from './components/add-franchise/add-franchise.component';
import { MatMenuModule} from '@angular/material/menu';
import { AddRecon, ReconComponent, UpdateRecon} from './components/recon/recon.component';
import { ReportsComponent } from './components/reports/reports.component';
import { MatStepperModule} from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';

const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY'
  },
  display: {
    dateInput: 'MMMM DD, YYYY',
    monthYearLabel: 'MM YYYY',
    dateAllyLabel: 'MMMM DD, YYYY',
    monthYearAllyLabel: 'MM YYYY'
  }
}
@NgModule({
  declarations: [
    
    AppComponent,
    MainComponent,
    SpinnerComponent,
    UsersComponent,
    ViewUserComponent,
    TransferFranchiseComponent,
    DialogTransferFranchiseRequest,
    AddFranchiseComponent,
    DialogAddFranchiseRequest,
    ReconComponent,
    UpdateRecon,
    AddRecon,
    ReportsComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AuthModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatGridListModule, 
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule, 
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatMenuModule,
    MatStepperModule,
    MatSelectModule
  

  ],
  providers: [
    {
      provide:  HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },
    {
      provide:  MAT_DATE_FORMATS, useValue: MY_FORMATS
    }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }