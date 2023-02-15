import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, UntypedFormBuilder } from '@angular/forms';
import { concat } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-recon',
  templateUrl: './recon.component.html',
  styleUrls: ['./recon.component.css'],
})
export class ReconComponent implements OnInit {
  countPerPage: number = 10;
  pageCurrent: number = 1;
  reconList: any = [];
  errorMessage: string = '';
  userId: number;
  /*Pagination */
  config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  constructor(
    private _api: ApiService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRecon();
  }

  loadRecon() {
    this._api.getTypeRequest('recon/').subscribe((res: any) => {
      // console.log(res);
      this.reconList = res.data;
      this.config.totalItems = this.reconList.length;
    });
  }
  openDialog() {
    const dialogRef = this._dialog.open(AddRecon,
      {
        width: '75%',
        height: '50%',
        maxWidth: '100%',

        disableClose: true,


      });


    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if (result.status == 1) {


        this._snackbar.open(result.message, 'Close',
          {
            duration: 8000,
            verticalPosition: 'top'
          })

      }
    });
  }

  deleteRecon(id: number) {}
}

@Component({
  selector: 'update-recon',
  templateUrl: './update-recon.component.html',
})
export class UpdateRecon {
  reconData: any = [];
  id: number = 0;
  reconForm: FormGroup;

  constructor(
    private _api: ApiService,
    private _route: ActivatedRoute,
    private _fb: FormBuilder
  ) {}

  updateRecon() {}
}

@Component({
  selector: 'add-recon',
  templateUrl: './add-recon.component.html',
})
export class AddRecon {
  id: number = 0;

  reconForm: FormGroup;
  ackList : any[];

  dataSource = new MatTableDataSource<any>();
  testForm: FormGroup;

  errorMessage: string = '';

  constructor(
    private _api: ApiService,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
      this.testForm = this._formBuilder.group({
        ackRow: this._formBuilder.array([])
    });
      this.ackList = [];
      this.testForm = this._fb.group({
          ackRow: this._fb.array(this.ackList.map(val => this._fb.group({
            ack_status: new FormControl(''),
            ack_desc: new FormControl('')
          })))
      });
    this.addRowAck();
    this.dataSource = new MatTableDataSource((this.testForm.get('ackRows') as FormArray).controls);
  }

  saveRecon() {
    this._api
      .postTypeRequest('recon/add-recon', this.reconForm.value)
      .subscribe((res: any) => {
        console.log(res.status);
        if (res.status == 1) {
          this.errorMessage = '';
          window.location.href = 'recon';
        } else {
          this.errorMessage = res.message.length;
        }
      });
  }

  changeDate(event: any) {
    alert(event);
  }

  addRowAck(){
    const control = this.testForm.get('ackRows') as FormArray;
    control.insert(0, this.initiateReconForm());
    this.dataSource = new MatTableDataSource(control.controls)
    
  }

  initiateReconForm(): FormGroup {
    return this._fb.group({
      ack_status: new FormControl(''),
      ack_desc: new FormControl('')
    });
  }

}
