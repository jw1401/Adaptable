import { Injectable,Inject } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFire, FirebaseApp,FirebaseObjectObservable  } from 'angularfire2';
import {UserModel} from './user-model';

//this is the user-service for the user-dashboard
@Injectable()
export class UserService
{
  public auth : any;
  public error : any;
  public authData : any;
  public userModel : UserModel;
  public firebase : any;
  private user : FirebaseObjectObservable<any>;

  constructor(@Inject(FirebaseApp) firebaseApp: any, private af: AngularFire)
  {
    this.af.auth.subscribe(auth =>
    {
      if(auth)
      {
        this.authData = auth;
        console.log("UserService active for " + this.authData.auth.email);
        this.user = this.af.database.object(`/users/${this.authData.uid}`);
      }
    });

    this.firebase = firebaseApp;
    this.auth = firebaseApp.auth();
  }

  getUser () : Promise<UserModel>
  {
    return this.af.database.object(`/users/${this.authData.uid}`).first().toPromise();
  }

  getUserById (id: string) : Promise<UserModel>
  {
    return this.af.database.object(`/users/${id}`).first().toPromise();
  }

  getAuthData():any
  {
    return this.authData;
  }

  updateUser(user: any)
  {
    this.user.update({name: user.value.displayName, country: user.value.country, bio:user.value.bio}).then((user)=>{}).catch((err)=>
    {
      this.error = err;
      console.log(err)
    });
  }

  updateAccountName(accountData:any)
  {
    this.auth.currentUser.updateProfile({displayName: accountData.value.accountName})
      .then((success) => {
        console.log('Success');
      })
      .catch((error) => {
        console.log(error);
      })
  }

  updateEmail(emailData: any) : Promise<any>
  {
      return this.auth.currentUser.updateEmail(emailData.value.email)
        .then((success) =>
        {
          return Promise.resolve("Success in changeEmail ");
        })
        .catch((error) =>
        {
          return Promise.reject("Error in changeEmail " + error);
        })
  }

  updatePassword(passwordData: any) : Promise<any>
  {
    return this.auth.currentUser.updatePassword(passwordData.value.newpassword).then((sucess) =>
      {
        return Promise.resolve("Password changed")
      }).catch((error) =>
      {
        return Promise.reject(error);
      })
  }

  uploadImage(imageFileName, imagefile)
  {
        let user = this.user;
        let auth = this.auth;

        // todo: implement to delete the user photo first on image change
        let promise = new Promise((res,rej) =>
        {
            let uploadTask = this.firebase.storage().ref(this.authData.uid+`/userData/${imageFileName}`).put(imagefile);

            uploadTask.on('state_changed', function(snapshot){}, function(error){rej(error);},
            function()
            {
              var downloadURL = uploadTask.snapshot.downloadURL;
              res(downloadURL);

              auth.currentUser.updateProfile({photoURL: downloadURL});

              user.update({photoURL: downloadURL}).then((user)=>{}).catch((err)=>
              {
                this.error = err;
                console.log(err)
              });
            });
        });
        return promise;
    }
}
