import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('open => closed', [
        animate('1s ease-in-out')
      ]),
      transition('closed => open', [
        animate('0.5s ease-in')
      ]),
    ]),
  ],

})
export class ViewUserComponent implements OnInit {

  isOpen: boolean = false;
  isSubmitted: boolean = false;
  id: number = 0;
  userData: any = [];
  user_password: string = "";
  confirm_password: string = "";
  errorMessage: string = "";

  successMessage: string = "";

  departmentList: any = [];
  public userForm: FormGroup;

  constructor(private _api: ApiService,
    private _route: ActivatedRoute,
    private _fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.userForm = new FormGroup({
      firstname: new FormControl(),
      lastname: new FormControl(),
      email: new FormControl(),
      user_level: new FormControl(),
      department: new FormControl(),
      user_password: new FormControl(),
      confirm_password: new FormControl(),
      id: new FormControl()

    });
    // this.loadDepartments();

    this._route.params.subscribe(routeParams => {

      setTimeout(() => {
        (this._api.getTypeRequest('user/' + routeParams['id'])).subscribe((res: any) => {
          console.log(res);
          this.userData = res[0];
          this.loadUser(routeParams['id']);
          console.log(this.userData[0]);
        }
        );

      }, 300);
    });


    //registrationForm.value = this.userInfo;
    //
  }
  // loadDepartments() {
  //   this._api.getTypeRequest('department/').subscribe((res: any) => {
  //     console.log(res);
  //     this.departmentList = res.data[0];
  //   });

  // }
  async loadUser(id: number) {
    Promise.resolve(setTimeout(() => {
      (this._api.getTypeRequest('user/' + id)).subscribe((res: any) => {
        console.log(res);
        this.userData = res[0];

        this.userForm = this._fb.group({
          firstname: [this.userData.firstname, Validators.required],
          lastname: [this.userData.lastname, Validators.required],
          email: [this.userData.email, Validators.email],
          user_level: [this.userData.user_level, Validators.required],
          department: [this.userData.department, Validators.required],
          user_password: '',
          confirm_password: '',
          id: this.userData.id
        });

        //     console.log(this.userData[0]);
      }
      );

    }, 300));
  }



  checkPasswords(password1: string, password2: string) {
    if (!this.isPasswordSame(password1, password2)) {
      this.errorMessage = "Passwords doesn't match!"
      this.isOpen = true;
    }
    else {
      this.errorMessage = ""
      this.isOpen = false;
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

  saveUser() {
    // alert(this.userForm.valid); 

    this.isSubmitted = true;
    if (this.userForm.valid) {
      if (confirm('Do you want to update user info?')) {

        this._api.putTypeRequest('user/' + this.userForm.value.id, this.userForm.value)
          .subscribe((res: any) => {
            if (res.status == 1) {
              this.successMessage = "Successfully updated user info.";
            }
            else {
              this.errorMessage = res.message;
            }
          });
      }

    }

  }


}
