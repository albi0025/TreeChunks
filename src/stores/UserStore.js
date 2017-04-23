import { extendObservable } from 'mobx';
import { hashHistory } from 'react-router';

export default class UserStore {
  constructor() {
    extendObservable(this, {
      loggedIn: this.checkCookie()
    });

    this.getCookie = this.getCookie.bind(this);
    // this.getUserFromDb = this.getUserFromDb.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.checkCookie = this.checkCookie.bind(this);
    this.logout = this.logout.bind(this);
    this.saveToken = this.saveToken.bind(this);
  }

  // getUserFromDb() {
  //   fetch("/user/userData",{
  //     method:"GET",
  //     headers: {
  //       "Accept": "application/json",
  //       "Content-Type": "application/json",
  //       'Authorization': 'Bearer ' + this.getCookie('token')
  //     },
  //   })
  //   .then(result => result.json())
  //   .then(data => this.pets = data.pets);
  // }

  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  checkCookie() {
    let token = this.getCookie("token");
    if (token === "") {
      return false;
    } else {
      return true;
    }
  }

  saveToken(response) {
    if(response.tokenId) {
      document.cookie = "token=" + response.tokenId;
      this.loggedIn = true;
    } else{
      this.loggedIn = false;
    }
  }

  logout(e) {
    document.cookie = "token=";
    this.loggedIn = false;
    hashHistory.replace('/#');
  }

}
