import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import * as Excel from 'exceljs';
import * as fs from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  fileName = 'Recon.xlsx';
  hospitalList: any = [];
  allList: any = [];
  filteredList: any = [];
  objList = new Observable<any>();
  pageCurrent: number = 1;
  countPerPage: number = 10;

  totalRecords: number;
  searchStr: string = '';

  selectedFromDate: any;
  selectedToDate: any;

  userInfo: any;
  isLogin: boolean = false;

  tblDataSource: MatTableDataSource<any>;
  columnsToDisplay: string[];

  searchForm: UntypedFormGroup = new UntypedFormGroup({
    hospitalName: new UntypedFormControl(),
    fromDate: new UntypedFormControl(),
    toDate: new UntypedFormControl(),
  });

  /*Pagination */
  config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  public maxSize: number = 3;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: '<',
    nextLabel: '>',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`,
  };

  /*End Pagination*/

  constructor(
    private _api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userInfo = this._auth.getUserInfo();
    this.searchForm = this.formBuilder.group({
      hospitalName: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
    });
    this._api.getTypeRequest('recon/').subscribe((res: any) => {
      //console.log(res[0]);
      this.hospitalList = res[0];
      // console.log("??result", this.hospitalList)
      this.totalRecords = this.hospitalList.length;

      let index = 0;

      for (let f of this.filteredList) {
        index++;
        f.rownum = index;
      }

      this.filteredList = this.hospitalList;
      this.config.totalItems = this.hospitalList.length;
    });
  }

  filterList() {
    this.selectedFromDate = this.searchForm.value.fromDate;
    this.selectedToDate = this.searchForm.value.toDate;

    console.log(this.selectedFromDate);
    console.log(this.selectedToDate);

    this.filteredList = [
      ...this.hospitalList.filter(
        (f: any) =>
          f.date_emailed >= this.selectedFromDate &&
          f.date_emailed <= this.selectedToDate
      ),
    ];
    let index = 0;
    for (let f of this.filteredList) {
      index++;
      f.rownum = index;
    }
    this.config.totalItems = this.filteredList.length;
  }

  downloadExcel() {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Recon List');

    let header = [
      'id',
      'Hospital',
      'Date Emailed',
      'Amount',
      'Suspension',
      'Due Date',
      'Acknowledgement',
      'Analysis',
      'Analysis Status',
      'Anylysis Description',
      'Follow-up Email',
      'Follow-up Status',
      'Follow-up Description',
      'Accounting',
      'Accounting Status',
      'Accounting Description',
      'Admin',
      'Admin Status',
      'Admin Description',
      'Closure'
    ];
    let headerRow = worksheet.addRow(header);

    for (let recon of this.hospitalList) {
      let rec = Object.keys(recon);
      let temp = [];
      for (let y of rec) {
        temp.push(recon[y]);
      }
      worksheet.addRow(temp);
    }

    let fileName = 'Recon';

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fileName + '.xlsx');
    });
  }
}
