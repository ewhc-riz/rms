import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {
  addFranchise,
  addFranchiseRequest,
} from 'src/app/models/franchise-class.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-franchise',
  templateUrl: './add-franchise.component.html',
  styleUrls: ['./add-franchise.component.css'],
})
export class AddFranchiseComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<Object>;
  addFranchiseRequest: addFranchiseRequest[];

  expandedElement: any = [];
  dataResult: any;
  columnsToDisplay: any[] = [];
  userInfo: any;
  index: number = 0;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private _api: ApiService,
    private _auth: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackbar: MatSnackBar
  ) {
    

  }

  ngOnInit(): void {
    this.userInfo = this._auth.getUserInfo();
    
  }

  ngAfterViewInit(): void {
      this._api.getTypeRequest('add-recon/').subscribe((res: any) => {
      //+ this.userInfo.id insert this in prod

      this.dataResult = res;
      console.log("??result: ", res);
      this.dataSource = new MatTableDataSource<Object>(this.dataResult);

      this.columnsToDisplay = Object.keys(this.dataResult[0]);
 
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      
    });
  } 

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddFranchiseRequest, {
      width: '75%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result == 1) {
        this.ngOnInit();
        this.ngAfterViewInit();

        this._snackbar.open('An email was sent to the franchising officer for reviewing of your Request Franchise ', 'Close',
        {
          duration: 8000,
          verticalPosition: 'top'
        })
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

@Component({
  selector: 'dialog-transfer-franchise',
  templateUrl: './dialog-add-franchise.html',
})
export class DialogAddFranchiseRequest {
  
  franchiseList: addFranchiseRequest[];
  filteredFranchiseList: Observable<addFranchiseRequest[]>;
  selectedFranchise: addFranchiseRequest;

  userInfo: any;
  images: any;
  

  addFranchiseForm: FormGroup;

  ifFormSubmitted: boolean = false;

  address: addFranchiseRequest;

  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private _dialogRef: MatDialogRef<DialogAddFranchiseRequest>
  ) {}

  ngOnInit(): void {
    this.addFranchiseForm = this._fb.group(
      {
        selectedFranchise: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        file: new FormControl('', [Validators.required])
      });

      this._api.getTypeRequest('add-recon/').subscribe((res: any) => {
        // console.log(res[0]);

        this.franchiseList = res[0];
      // this.filteredFranchiseList = this.addFranchiseForm.controls['selectedFranchise'].valueChanges.pipe(
      //   startWith(''),
      //   map(value => ((typeof value === 'string') && (value.length >= 3) ? value : value.company)),
      //   map(name => (name ? this._filter(name) : this.franchiseList.slice(0, 300))),
      // );
      });
      

  }

  // private _filter(name: string): addFranchise[] {
  //   const filterValue = name.toLowerCase();

  //   return this.franchiseList.filter(option => option.company.toLowerCase().includes(filterValue));
  // }
  
  
  newFranchiseRequest(){
    this.ifFormSubmitted = true;

    if(this.addFranchiseForm.valid){
      let formData = new FormData();
      this._api
      .postTypeRequest(
        'new-franchise/add-franchise',
        formData
      )
      .subscribe((res: any) => {
        console.log(res.data);
        if (res.status == 1) {
          this._router.navigate(['/add-franchise']);
        } 
      });

    }


  }

  displayCompanyName(company: addFranchise) {
    return company.companyName;
  }
  selectFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.images = file;
    }
    // this.fileToUpload = element.target.files;
  }
  clearSelection() {

    this.addFranchiseForm.controls['selectedFranchise'].setValue('');
  }

}
