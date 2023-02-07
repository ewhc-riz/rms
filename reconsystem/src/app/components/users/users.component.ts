import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { concat } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  countPerPage: number = 10;
  pageCurrent: number = 1;
  userList: any = [];
  errorMessage: string = "";
  user_password: string = "";
  confirm_password: string = ""
  userId: number;

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


  constructor(private _api: ApiService, private _route: ActivatedRoute, private _router: Router) { }



  ngOnInit(): void {



    this.loadAllUsers();

  }

  loadAllUsers() {
    this._api.getTypeRequest('user/').subscribe((res: any) => {
      console.log(res);
      this.userList = res.data;
      this.config.totalItems = this.userList.length;
    });

  }

  checkPasswords(password1: string, password2: string) {
    if (!this.isPasswordSame(password1, password2)) {
      this.errorMessage = "Passwords doesn't match!"
    }
    else {
      this.errorMessage = ""
    }

  }

  isPasswordSame(password1: string, password2: string) {
    if (password1 != password2) {
      return false;
    }
    else {
      return true;
    }
  }

  saveUser(registrationForm: NgForm) {
    if (!this.isPasswordSame(registrationForm.value.user_password, registrationForm.value.confirm_password)) {
      this.errorMessage = "Passwords doesn't match!"
    }
    else {
      this.errorMessage = ""
    }

    this._api.postTypeRequest('user/add-user', registrationForm.value).subscribe((res: any) => {
      console.log(res.status);
      if (res.status == 1) {
        this.errorMessage = "";
        window.location.href = 'users';
      }
      else {
        this.errorMessage = res.message;
      }
    })
  }

  deleteUser(id: number) {
    if (confirm("Are you sure you want delete this user?")) {
      this._api.deleteTypeRequest("user/" + id).subscribe((res: any) => {
        this.loadAllUsers();
      });

    }
  }



}
