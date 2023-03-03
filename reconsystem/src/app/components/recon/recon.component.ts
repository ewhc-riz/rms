import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  UntypedFormBuilder,
  Validators,
  Form,
} from '@angular/forms';
import { filter, startWith, map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { rowsAnimation } from 'src/app/animations/template.animations';
import * as m from 'moment';
import { AuthService } from 'src/app/services/auth.service';

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
  userInfo: any;
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
    private _snackbar: MatSnackBar,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecon();
    this.userInfo = '';
  }

  loadRecon() {
    this._api.getTypeRequest('recon/').subscribe((res: any) => {
      // console.log(res);
      this.reconList = res[0];
      this.config.totalItems = this.reconList.length;
    });
  }
  openDialog() {
    const dialogRef = this._dialog.open(AddRecon, {
      width: '75%',
      height: '70%',
      maxWidth: '100%',

      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);
      if (result.status == 1) {
        this._snackbar.open(result.message, 'Close', {
          duration: 8000,
          verticalPosition: 'top',
        });
      }
    });
  }

  deleteRecon(id: number) {}
}

@Component({
  selector: 'update-recon',
  templateUrl: './update-recon.component.html',
  animations: [rowsAnimation],
})
export class UpdateRecon {
  reconId: number;
  reconAnalysisId: number;
  userInfo: any;
  reconData: any = [];
  isLinear = true;
  formHospital: FormGroup;
  is_edit: boolean = false;

  formAck: FormGroup;

  analysisColumns: string[];
  formAnalysis: FormGroup;
  analysisDataSource: MatTableDataSource<any>;
  analysisList: any = [];

  formFollowUp: FormGroup;

  accColumns: string[];
  formAccounting: FormGroup;
  accountingDatasource: MatTableDataSource<any>;
  accountingList: any[];

  adminColumns: string[];
  formAdmin: FormGroup;
  adminDatasource: MatTableDataSource<any>;
  adminList: any[];

  formClosure: FormGroup;

  constructor(
    private _api: ApiService,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userInfo = this._auth.getUserInfo();
    this.formHospital = this._fb.group({
      hospital: new FormControl(''),
      date_emailed: new FormControl(''),
      amount: new FormControl(''),
      suspension: new FormControl(''),
      due_date: new FormControl(''),
    });

    // start Acknowledgement
    this.formAck = this._fb.group({
      ack: new FormControl(''),
      ack_status: new FormControl(''),
      ack_desc: new FormControl(''),
    });
    // end Acknowledgement

    // Start Analysis
    this.formAnalysis = this._formBuilder.group({
      analysisRows: this._formBuilder.array([]),
    });

    this.analysisList = [];
    this.formAnalysis = this._fb.group({
      analysis: new FormControl(''),
      analysisRows: this._fb.array(
        this.analysisList.map((val: any) =>
          this._fb.group({
            id: new FormControl(''),
            analysis_status: new FormControl(''),
            analysis_desc: new FormControl(''),
          })
        )
      ),
    });
    this.analysisDataSource = new MatTableDataSource(
      (this.formAnalysis.get('analysisRows') as FormArray).controls
    );
    this.analysisColumns = ['id', 'analysis_status', 'analysis_desc'];
    //End Analysis

    this.formFollowUp = this._fb.group({
      follow_up: new FormControl(''),
      follow_status: new FormControl(''),
      follow_desc: new FormControl(''),
    });

    // Start Accounting
    this.formAccounting = this._formBuilder.group({
      accoungtingRows: this._formBuilder.array([]),
    });

    this.accountingList = [];
    this.formAccounting = this._fb.group({
      accounting: new FormControl(''),
      accountingRows: this._fb.array(
        this.accountingList.map((val: any) =>
          this._fb.group({
            id: new FormControl(''),
            acc_status: new FormControl(''),
            acc_desc: new FormControl(''),
          })
        )
      ),
    });
    this.accountingDatasource = new MatTableDataSource(
      (this.formAccounting.get('accountingRows') as FormArray).controls
    );
    this.accColumns = ['id', 'acc_status', 'acc_desc'];
    //End Accounting
    // Start Admin
    this.formAdmin = this._formBuilder.group({
      adminRows: this._formBuilder.array([]),
    });

    this.adminList = [];
    this.formAdmin = this._fb.group({
      admin: new FormControl(''),
      adminRows: this._fb.array(
        this.adminList.map((val: any) =>
          this._fb.group({
            id: new FormControl(''),
            admin_status: new FormControl(''),
            admin_desc: new FormControl(''),
          })
        )
      ),
    });
    this.adminDatasource = new MatTableDataSource(
      (this.formAdmin.get('adminRows') as FormArray).controls
    );

    this.adminColumns = ['id', 'admin_status', 'admin_desc'];
    //End admin

    // start closure
    this.formClosure = this._fb.group({
      closure: new FormControl(''),
    });

    // end closure

    this.reconId = 0;
    this._route.params.subscribe((routeParams) => {
      setTimeout(() => {
        this.reconId = routeParams['id'];
        // console.log("recondata??", this.reconId);
        this._api
          .getTypeRequest('recon/' + routeParams['id'])
          .subscribe((res: any) => {
            // console.log(res);
            this.reconData = res[0];

            (this.formHospital = this._fb.group({
              hospital: new FormControl(this.reconData.hospital),
              date_emailed: new FormControl(this.reconData.date_emailed),
              amount: new FormControl(this.reconData.amount),
              suspension: new FormControl(this.reconData.suspension),
              due_date: new FormControl(this.reconData.due_date),
            })),
              (this.formAck = this._fb.group({
                ack: new FormControl(this.reconData.ack),
                ack_status: new FormControl(this.reconData.ack_status),
                ack_desc: new FormControl(this.reconData.ack_desc),
              })),
              this.formAnalysis.patchValue({
                analysis: this.reconData.analysis,
              });
            this.formFollowUp = this._fb.group({
              follow_up: new FormControl(this.reconData.follow_up),
              follow_status: new FormControl(this.reconData.follow_status),
              follow_desc: new FormControl(this.reconData.follow_desc),
            });
            this.formAccounting.patchValue({
              accounting: this.reconData.accounting,
            });
            this.formAdmin.patchValue({
              admin: this.reconData.admin,
            });
            this.formClosure = this._fb.group({
              closure: new FormControl(this.reconData.closure),
            });

            this._api
              .getTypeRequest('recon/recon-analysis/' + routeParams['id'])
              .subscribe((res: any) => {
                this.analysisList = res;
                // console.log("Analysis Array??", this.analysisList);
                var analysis = this.formAnalysis.get(
                  'analysisRows'
                ) as FormArray;
                var allAnalysis: any[] = [];
                Object.values(this.analysisList).forEach((val: any) => {
                  // console.log("test??", val);
                  allAnalysis.push({
                    id: val.id,
                    analysis_status: val.analysis_status,
                    analysis_desc: val.analysis_desc,
                  });
                  this.addAnalysis();
                });
                analysis.setValue(allAnalysis);
              });
            this._api
              .getTypeRequest('recon/recon-accounting/' + routeParams['id'])
              .subscribe((res: any) => {
                this.accountingList = res;
                // console.log("test??",this.accountingList);
                var accountingArray = this.formAccounting.get(
                  'accountingRows'
                ) as FormArray;
                var allAcc: any[] = [];
                Object.values(this.accountingList).forEach((val: any) => {
                  // console.log('test??', val);
                  allAcc.push({
                    id: val.id,
                    acc_status: val.acc_status,
                    acc_desc: val.acc_desc,
                  });
                  this.addAccounting();
                });
                accountingArray.patchValue(allAcc);
              });

            this._api
              .getTypeRequest('recon/recon-admin/' + routeParams['id'])
              .subscribe((res: any) => {
                this.adminList = res;
                var adminArray = this.formAdmin.get('adminRows') as FormArray;
                var allAdmin: any[] = [];
                Object.values(this.adminList).forEach((val: any) => {
                  // console.log('testadmin??', this.adminList);
                  allAdmin.push({
                    id: val.id,
                    admin_status: val.admin_status,
                    admin_desc: val.admin_desc,
                  });
                  this.addAdmin();
                });
                adminArray.patchValue(allAdmin);
              });
          });
      }, 300);
    });
  }

  // async loadRecon( id : number ){
  //   Promise.resolve(setTimeout(() => {
  //     this._api
  //         .getTypeRequest('recon/' + id)
  //         .subscribe((res: any) => {
  //           console.log(res);
  //           this.reconData = res[0];
  //           this.formHospital = this._fb.group({
  //             hospital: new FormControl(this.reconData.hospital),
  //             date_emailed: new FormControl(this.reconData.date_emailed),
  //             amount: new FormControl(this.reconData.amount),
  //             suspension: new FormControl(this.reconData.suspension),
  //             due_date: new FormControl(this.reconData.due_date),
  //           }),
  //             this.formAck = this._fb.group({
  //               ack: new FormControl(this.reconData.ack),
  //               ack_status: new FormControl(this.reconData.ack_status),
  //               ack_desc: new FormControl(this.reconData.ack_desc),
  //             }),
  //             this.formAnalysis.patchValue({
  //               analysis: (this.reconData.analysis),
  //             });
  //         });
  //   }, 300));

  // }

  // Start Analysis

  addAnalysis() {
    const control = this.formAnalysis.get('analysisRows') as FormArray;
    control.insert(0, this.initiateAnalysisForm());
    this.analysisDataSource = new MatTableDataSource(control.controls);
  }

  initiateAnalysisForm(): FormGroup {
    return this._fb.group({
      id: new FormControl(''),
      analysis_status: new FormControl(''),
      analysis_desc: new FormControl(''),
    });
  }
  // End Analysis
  // Start Accounting
  addAccounting() {
    const control = this.formAccounting.get('accountingRows') as FormArray;
    control.insert(0, this.initiateAccounting());
    this.accountingDatasource = new MatTableDataSource(control.controls);
  }
  initiateAccounting(): FormGroup {
    return this._fb.group({
      id: new FormControl(''),
      acc_status: new FormControl(''),
      acc_desc: new FormControl(''),
    });
  }
  //End Accounting

  addAdmin() {
    const control = this.formAdmin.get('adminRows') as FormArray;
    control.insert(0, this.initiateAdmin());
    this.adminDatasource = new MatTableDataSource(control.controls);
  }
  initiateAdmin(): FormGroup {
    return this._fb.group({
      id: new FormControl(''),
      admin_status: new FormControl(''),
      admin_desc: new FormControl(''),
    });
  }
  // End admin

  updateRecon() {
    let data = {
      hospital: JSON.stringify(this.formHospital.value),
      acknowledgement: JSON.stringify(this.formAck.value),
      analysis: JSON.stringify(this.formAnalysis.value),
      follow_up: JSON.stringify(this.formFollowUp.value),
      accounting: JSON.stringify(this.formAccounting.value),
      admin: JSON.stringify(this.formAdmin.value),
      closure: JSON.stringify(this.formClosure.value),
      user_id: this.userInfo.id,
    };

    console.log('hospital: ', this.formHospital.value);
    console.log('acknowle: ', this.formAck.value);
    console.log('analysis: ', this.formAnalysis.value);
    console.log('follow_up: ', this.formFollowUp.value);
    console.log('admin: ', this.formAdmin.value);
    console.log('closure: ', this.formClosure.value);

    console.log(data);

    this._api
      .putTypeRequest('recon/update/' + this.reconId, data)
      .subscribe((res: any) => {
        if (res.status == 1) {
          console.log(res);
          this._router.navigate(['/recon']);
        }
      });
    // window.location.reload();
  }
}

@Component({
  selector: 'add-recon',
  templateUrl: './add-recon.component.html',
  animations: [rowsAnimation],
})
export class AddRecon {
  hospitalList: any;
  filteredHospitalList: any;
  date: any;
  userInfo: any;

  formHospital: FormGroup;
  isLinear = true;
  datePicker: Date;

  formAck: FormGroup;

  dateEmailed: any;

  analysisColumns: string[];
  formAnalysis: FormGroup;
  analysisDataSource: MatTableDataSource<any>;
  analysisList: any[];

  formFollowUp: FormGroup;

  accColumns: string[];
  formAccounting: FormGroup;
  accountingDatasource: MatTableDataSource<any>;
  accountingList: any[];

  adminColumns: string[];
  formAdmin: FormGroup;
  adminDatasource: MatTableDataSource<any>;
  adminList: any[];

  formClosure: FormGroup;

  constructor(
    private _api: ApiService,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<AddRecon>,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this._api
      .getTypeRequest('recon/autocomplete/hospital-list')
      .subscribe((res: any) => {
        // console.log(res);
        this.hospitalList = res.data;
        this.filteredHospitalList = this.formHospital.controls[
          'hospital'
        ].valueChanges.pipe(
          startWith(''),
          map((value: any) =>
            typeof value === 'string' && value.length >= 3
              ? value
              : value.hospital_name
          ),
          map((name: any) =>
            name ? this._filter(name) : this.hospitalList.slice(0, 100)
          )
        );
      });
    //  Start Hospital group
    this.formHospital = this._fb.group({
      hospital: new FormControl('', [Validators.required]),
      date_emailed: new FormControl('', [Validators.required]),
      amount: new FormControl(''),
      suspension: new FormControl(''),
      due_date: new FormControl(''),
    });
    // End Hospital

    // start Acknowledgement
    this.formAck = this._fb.group({
      ack: new FormControl(''),
      ack_status: new FormControl(''),
      ack_desc: new FormControl(''),
    });

    // end Acknowledgement

    // Start Analysis
    this.formAnalysis = this._formBuilder.group({
      analysisRows: this._formBuilder.array([]),
    });

    this.analysisList = [];
    this.formAnalysis = this._fb.group({
      analysis: new FormControl(''),
      analysisRows: this._fb.array(
        this.analysisList.map((val: any) =>
          this._fb.group({
            id: new FormControl(0),
            analysis_status: new FormControl(''),
            analysis_desc: new FormControl(''),
          })
        )
      ),
    });
    this.addAnalysis();
    this.analysisDataSource = new MatTableDataSource(
      (this.formAnalysis.get('analysisRows') as FormArray).controls
    );

    this.analysisColumns = ['id', 'analysis_status', 'analysis_desc'];
    //End Analysis

    // Start Follow up
    this.formFollowUp = this._fb.group({
      follow_up: new FormControl(''),
      follow_status: new FormControl(''),
      follow_desc: new FormControl(''),
    });
    //End Follow UP
    // Start Accounting
    this.formAccounting = this._formBuilder.group({
      accoungtingRows: this._formBuilder.array([]),
    });

    this.accountingList = [];
    this.formAccounting = this._fb.group({
      accounting: new FormControl(''),
      accountingRows: this._fb.array(
        this.accountingList.map((val: any) =>
          this._fb.group({
            id: new FormControl(0),
            acc_status: new FormControl(''),
            acc_desc: new FormControl(''),
          })
        )
      ),
    });
    this.addAccounting();
    this.accountingDatasource = new MatTableDataSource(
      (this.formAccounting.get('accountingRows') as FormArray).controls
    );

    this.accColumns = ['id', 'acc_status', 'acc_desc'];
    //End Accounting

    // Start Admin
    this.formAdmin = this._formBuilder.group({
      adminRows: this._formBuilder.array([]),
    });

    this.adminList = [];
    this.formAdmin = this._fb.group({
      admin: new FormControl(''),
      adminRows: this._fb.array(
        this.adminList.map((val: any) =>
          this._fb.group({
            admin_status: new FormControl(''),
            admin_desc: new FormControl(''),
          })
        )
      ),
    });
    this.addAdmin();
    this.adminDatasource = new MatTableDataSource(
      (this.formAdmin.get('adminRows') as FormArray).controls
    );

    this.adminColumns = ['admin_status', 'admin_desc'];
    //End admin

    // start closure
    this.formClosure = this._fb.group({
      closure: new FormControl(''),
    });

    // end closure
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.hospitalList.filter((option: any) =>
      option.hospital_name.toLowerCase().includes(filterValue)
    );
  }

  // Start Analysis
  addAnalysis() {
    const control = this.formAnalysis.get('analysisRows') as FormArray;
    control.insert(0, this.initiateAnalysisForm());
    this.analysisDataSource = new MatTableDataSource(control.controls);
  }

  initiateAnalysisForm(): FormGroup {
    return this._fb.group({
      id: new FormControl(0),
      analysis_status: new FormControl(''),
      analysis_desc: new FormControl(''),
    });
  }
  // End Analysis

  myFilter: (date: Date | any) => boolean = (date: Date | any) => {
    if (!date) {
      return false;
    }
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  // onChange: (date: Date | null) => boolean = (d: Date | any) => {
  //   const day = d.getDay();
  //   return day !== 0 && day !== 6;
  // };

  // Start Accounting
  addAccounting() {
    const control = this.formAccounting.get('accountingRows') as FormArray;
    control.insert(0, this.initiateAccounting());
    this.accountingDatasource = new MatTableDataSource(control.controls);
  }
  initiateAccounting(): FormGroup {
    return this._fb.group({
      id: new FormControl(''),
      acc_status: new FormControl(''),
      acc_desc: new FormControl(''),
    });
  }
  //End Accounting
  // Start Admin
  addAdmin() {
    const control = this.formAdmin.get('adminRows') as FormArray;
    control.insert(0, this.initiateAdmin());
    this.adminDatasource = new MatTableDataSource(control.controls);
  }
  initiateAdmin(): FormGroup {
    return this._fb.group({
      admin_status: new FormControl(''),
      admin_desc: new FormControl(''),
    });
  }
  // End admin

  displayHospitalName(hospitals: any) {
    return hospitals.hospital_name;
  }

  //End Admin
  addRecon() {
    let userInfo = this._auth.getUserInfo();
    let data = {
      hospital: JSON.stringify(this.formHospital.value),
      acknowledgement: JSON.stringify(this.formAck.value),
      analysis: JSON.stringify(this.formAnalysis.value),
      follow_up: JSON.stringify(this.formFollowUp.value),
      accounting: JSON.stringify(this.formAccounting.value),
      admin: JSON.stringify(this.formAdmin.value),
      closure: JSON.stringify(this.formClosure.value),
      user_id: userInfo.id,
    };

    console.log('hospital: ', this.formHospital.value);
    console.log('acknowle: ', this.formAck.value);
    console.log('analysis: ', this.formAnalysis.value);
    console.log('follow_up: ', this.formFollowUp.value);
    console.log('admin: ', this.formAdmin.value);
    console.log('closure: ', this.formClosure.value);

    console.log(data);

    this._api.postTypeRequest('recon/add-recon', data).subscribe((res: any) => {
      if (res.status == 1) {
        this._dialogRef.close(res);
        console.log(res);
      }
    });
    this._dialogRef.close();
    window.location.reload();
  }
}
