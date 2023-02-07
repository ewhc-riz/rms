import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { franchise, franchiseTransferRequest } from 'src/app/models/franchise-class.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-transfer-franchise',
  templateUrl: './transfer-franchise.component.html',
  styleUrls: ['./transfer-franchise.component.css'],
  animations: [
 
  ]
})
export class TransferFranchiseComponent implements AfterViewInit, OnInit {
  title = 'Transfer Franchise';
  dataSource: MatTableDataSource<Object>;
  columnsToDisplay: any = [];
  expandedElement: any = [];
  index: number = 0;
  dataResult: any;
  transferRequests: franchiseTransferRequest[];
  userInfo: any;
  successMessage: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog,
    private _api: ApiService,
    private _auth: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.userInfo = this._auth.getUserInfo();


  }

  ngAfterViewInit(): void {
    this._api.getTypeRequest('franchise/my-transfer-requests/' + this.userInfo.id).subscribe((res: any) => {
      console.log(res);
      this.dataResult = res[0];
      //  this.transferRequests = this.dataResult;
      this.dataSource = new MatTableDataSource<Object>(this.dataResult);
      
      this.columnsToDisplay = Object.keys(this.dataResult[0]);

      console.log(this.columnsToDisplay);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })


  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogTransferFranchiseRequest,
      {
        width: '60%'
      });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result == 1) {
        this.ngOnInit();
        this.ngAfterViewInit();
        
        
        // this._snackbar.open('An email was sent to the franchising officer for reviewing your Franchise Transfer Application ', 'Close', 
        // {
        //   duration: 8000,
        //   verticalPosition: 'top'
        // })
        
      }
    });


  }

}


@Component({
  selector: 'dialog-transfer-franchise',
  templateUrl: './dialog-transfer-franchise.html'

})
export class DialogTransferFranchiseRequest {

  franchiseList: franchise[];
  filteredFranchiseList: Observable<franchise[]>;

  selectedFranchise: franchise;

  file: any;

  selectedFile: any = [];

  requestForm: FormGroup;

  userInfo: any;


  ifFormSubmitted: boolean = false;
  constructor(private _api: ApiService,
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private _dialogRef: MatDialogRef<DialogTransferFranchiseRequest>) { }
  ngOnInit(): void {


    this.userInfo = this._auth.getUserInfo();

    this.requestForm = this._fb.group(
      {
        selectedFranchise: new FormControl('', [Validators.required]),
        file: new FormControl('', [Validators.required]),
        fileSource: new FormControl('', Validators.required)
      });

    this._api.getTypeRequest('franchise/').subscribe((res: any) => {
      console.log(res[0]);

      this.franchiseList = res[0];
      this.filteredFranchiseList = this.requestForm.controls['selectedFranchise'].valueChanges.pipe(
        startWith(''),
        map(value => ((typeof value === 'string') && (value.length >= 3) ? value : value.companyName)),
        map(name => (name ? this._filter(name) : this.franchiseList.slice(0, 300))),
      );

    });

  }

  displayCompanyName(company: franchise) {
    return company.companyName;
  }

  private _filter(name: string): franchise[] {
    const filterValue = name.toLowerCase();

    return this.franchiseList.filter(option => option.companyName.toLowerCase().includes(filterValue));
  }

  sendTransferRequest() {
    //   console.log(this.requestForm.value.fileControl);

    this.ifFormSubmitted = true;

    if (this.requestForm.valid) {
      let formData = new FormData();
      let selectedFranchise = this.requestForm.get('selectedFranchise')?.value;

      formData.append("file", this.requestForm.get('fileSource')?.value)
      formData.append("request_by_user_id", this.userInfo.id);
      formData.append("franchise_code", selectedFranchise.franchiseCode);
      formData.append("company_name", selectedFranchise.companyName);
      formData.append("email", this.userInfo.email);
      formData.append("firstname", this.userInfo.firstname);
      formData.append("lastname", this.userInfo.lastname);
      


      //

      this._api.postTypeRequest('franchise/transfer-request', formData).subscribe((res: any) => {
        if (res.status == 1) {
          this._router.navigate(['/transfer-franchise']);
          this._dialogRef.close(res.status);
        }
      });



    }

    //console.log(this.requestForm.value)


  }

  fileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.requestForm.patchValue({
        fileSource: file
      });
    }
  }

  clearSelection() {

    this.requestForm.controls['selectedFranchise'].setValue('');
  }


}

