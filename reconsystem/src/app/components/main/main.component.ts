import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  franchiseList: any = [];
  allList: any = [];
  filteredList: any = [];
  objList = new Observable<any>();
  pageCurrent: number = 1;
  countPerPage: number = 10;

  totalRecords: number;
  searchStr: string = "";

  selectedFromDate: any;
  selectedToDate: any;

  userInfo: any;
  isLogin: boolean = false;
  

  searchForm: UntypedFormGroup = new UntypedFormGroup({
    companyName: new UntypedFormControl(),
    dtCriteria: new UntypedFormControl(),
    fromDate: new UntypedFormControl(),
    toDate: new UntypedFormControl()
  });
  
 

  

  /*Pagination */
  config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
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
    screenReaderCurrentLabel: `You're on page`
  };

  /*End Pagination*/


  constructor(private _api: ApiService, private formBuilder: UntypedFormBuilder, private _auth: AuthService) {
  }


   ngOnInit(): void {
    this.userInfo = this._auth.getUserInfo();
    this.searchForm = this.formBuilder.group({
      companyName: '',
      dtCriteria: '',
      fromDate: '',
      toDate: ''
  });
console.log('any');

    this._api.getTypeRequest('franchise/').subscribe((res: any) => {
      //console.log(res[0]);
      this.franchiseList = res[0];
      this.totalRecords = this.franchiseList.length;
      let index = 0;

      for (let f of this.franchiseList) {
        index++;
        f.rownum = index;
      }

      this.filteredList = this.franchiseList;
      this.config.totalItems = this.franchiseList.length;
    });
  }

  filterList() {

    if (this.searchForm.value.dtCriteria == 'datereq') {
      
      this.selectedFromDate = moment(this.searchForm.value.fromDate).format('YYYY-MM-DD');
      this.selectedToDate = moment(this.searchForm.value.toDate).format('YYYY-MM-DD');
       
      console.log(this.selectedFromDate);
      console.log(this.selectedToDate);
      
      this.filteredList = [...this.franchiseList.filter((f: any) =>
        (
          f.companyName.toLowerCase().includes(this.searchStr.toLowerCase())
          &&
          (
            f.dateRequest >= this.selectedFromDate && f.dateRequest <= this.selectedToDate
          )
        )
 
        )
      ];
      let index = 0;
      for (let f of this.filteredList) {
        index ++;
        f.rownum = index;
      }
      this.config.totalItems = this.filteredList.length;

    }


  }



}