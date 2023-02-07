import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = "";
  isLogin: boolean = false;
  collection = { count: 60, data: [] };
  userInfo: any;

 

  public config = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.collection.count
  };
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit(): void {

    
    this.userInfo = this._auth.getUserInfo();
    
    if (this._auth.getToken() == null) {
      this.isLogin = false;
      this._router.navigate(['login']);

    }
    else {
      this.isLogin = true;

    }
  }

  logOut() {
    this._auth.clearStorage();
    this._router.navigate(['login']);
  }

  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }
} 
