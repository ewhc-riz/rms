import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  getUserInfo() {
    let userInfo = JSON.parse(
      this.getUserDetails() || "[]" // insert this on prod {firstname: 'Guest'}
    );
    return userInfo[0];
  }

  getUserDetails() {
    if (localStorage.getItem('userData')) {
      return localStorage.getItem('userData');
    } else {
      return null;
    }
  }

  setDataInLocalStorage(variableName: any, data: any) {
    localStorage.setItem(variableName, data);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  clearStorage() {
    localStorage.clear();
  }
}
