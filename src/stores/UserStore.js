import { extendObservable } from 'mobx';
import { hashHistory } from 'react-router';

export default class UserStore {
  constructor() {
    extendObservable(this, {
      loggedIn: this.checkCookie(),
      user: {}
    });

    this.getCookie = this.getCookie.bind(this);
    // this.getUserFromDb = this.getUserFromDb.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.checkCookie = this.checkCookie.bind(this);
    this.logout = this.logout.bind(this);
    this.saveToken = this.saveToken.bind(this);
    this.createUser = this.createUser.bind(this);
    this.flagUserUpChunk = this.flagUserUpChunk.bind(this);
    this.unFlagUserUpChunk = this.unFlagUserUpChunk.bind(this);
    this.flagUserDownChunk = this.flagUserDownChunk.bind(this);
    this.unFlagUserDownChunk = this.unFlagUserDownChunk.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  flagUserUpChunk(chunkId){
    fetch("/flagUpChunk",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ' + this.getCookie('token')
      },
      body: JSON.stringify({
        chunkId: chunkId,
        userId: this.user._id
      })
    })
    .then(res => { this.user.upchunks.push(chunkId);});
  }

  unFlagUserUpChunk(chunkId){
    fetch("/unFlagUpChunk",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ' + this.getCookie('token')
      },
      body: JSON.stringify({
        chunkId: chunkId,
        userId: this.user._id
      })
    })
    .then(res => {
      let chunkPosition = this.user.upchunks.indexOf(chunkId);
      this.user.upchunks.splice(chunkPosition, 1);
    });
  }

  flagUserDownChunk(chunkId){
    fetch("/flagDownChunk",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ' + this.getCookie('token')
      },
      body: JSON.stringify({
        chunkId: chunkId,
        userId: this.user._id
      })
    })
    .then(res => { this.user.downchunks.push(chunkId);});
  }

  unFlagUserDownChunk(chunkId){
    fetch("/unFlagDownChunk",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ' + this.getCookie('token')
      },
      body: JSON.stringify({
        chunkId: chunkId,
        userId: this.user._id
      })
    })
    .then(res => {
      let chunkPosition = this.user.downchunks.indexOf(chunkId);
      this.user.downchunks.splice(chunkPosition, 1);
    });
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

  createUser() {
    fetch('/newUser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getCookie('token')
      }
    });
  }

  getUser(email){
    fetch('/getUser/'+ email,{
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(response => this.user = response); //Unsure if this is best way?  Can we extract login info from token (cookie??)?
  }

  saveToken(response) {
    if(response.tokenId) {
      document.cookie = "token=" + response.tokenId;
      this.loggedIn = true;
      this.createUser();
      this.getUser(response.profileObj.email);
    } else{
      this.loggedIn = false;
    }
  }

  logout(e) {
    document.cookie = "token=";
    this.loggedIn = false;
    // hashHistory.replace('/#');
  }

}
