import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { User, Upload } from '../shared/user.model'
import { FirebaseObjectObservable } from 'angularfire2/database';
import { File} from '../shared/File.model'
import * as $ from 'jquery';

@Component
({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent
{
    public auth: any;
    public user : any;

    constructor(private userService: UserService)
    {
    }

    ngOnInit()
    {
      this.auth = this.userService.currentUser; // gets the authState Data
      this.user = this.userService.currentUserData; // gets the Observable for async pipe
    }
}

////////////////////////////////////////////////////////////////////////////////////////////7

@Component
({
  selector: 'profile',
  templateUrl: './account.component.html'
})

export class AccountComponent
{
  public error : any;
  public success: any;
  public user : User;
  public imagePreview: string;

  tmpUserPhotoName: string;
  subscription : any;
//  upload : Upload;

  currentFile: File;

  constructor(private userService: UserService, private router: Router)
  {
    //this.upload = new Upload();
    this.user = new User();
  }

  ngOnInit()
  {

    this.subscription = this.userService.currentUserData.subscribe(data =>
      {
        this.user = data;

        this.user.photo != undefined ?  this.imagePreview = this.user.photo.url : null

      });
  }

  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }

  fileImageChangeEvent(event: any)
  {
    this.success = null;
    this.error = null;

    this.userService.deleteProfilePicture(this.user.photo).then(()=>{
      this. currentFile = new File(event.target.files[0]);
      this.userService.uploadProfilePicture(this.currentFile);
    }).catch((err)=>
    {
      this. currentFile = new File(event.target.files[0]);
      this.userService.uploadProfilePicture(this.currentFile);
    });


    if (event.target.files && event.target.files[0] && event.target.files[0].type.match('image/*'))
    {
      var reader = new FileReader();
      reader.onload = (event:any) => {this.imagePreview = event.target.result;}
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  UpdateUser(userForm: any)
  {
    this.success = null;

    if (userForm.valid)
    {

/*
        console.log (this.user.photo.name+" "+this.tmpUserPhotoName)
      if (this.user.photo.name != undefined && this.user.photo.name != this.tmpUserPhotoName)
      {
        if (this.user.photo.type.match('image/*'))
        {
          console.log(this.tmpUserPhotoName)
          if (this.tmpUserPhotoName != "")
          {
            this.userService.deleteProfilePicture(this.user.photo.name)
              .then((success) =>
              {
                this.userService.uploadProfilePicture(this.user)
                  .then((success) => { this.showSuccess(success); })
                  .catch((err) => { this.error = err });
              })
              .catch((err) => this.error = err)
          }
          else
          {
            console.log(this.user);
            this.userService.uploadProfilePicture(this.user)
              .then((success) => { this.showSuccess(success); })
              .catch((err) => { this.error = err });
          }
        } else this.error = "Only images...";
      }




      this.userService.updateUserData(this.user)
        .then((success) => { this.showSuccess(success); })
        .catch((err) => { this.error = err; console.log(err) });*/
    }
  }

  updateAccount(accountForm : any)
  {
    this.success = null

    if (accountForm.valid)
    {
      if (accountForm.value.newEmail != null && accountForm.value.newEmail !='')
      {
        this.userService.updateAccountEmail(accountForm.value.newEmail, accountForm.value.email, accountForm.value.password)
        .then((success) => { this.showSuccess(success); })
        .catch((err) =>
          {
            console.log(err);
            this.router.navigate(['/login']);
          });
      }

      if (accountForm.value.newPassword != null && accountForm.value.newPassword !='')
      {
        this.userService.updateAccountPassword(accountForm.value.newPassword, accountForm.value.email, accountForm.value.password)
          .then((success) =>{ this.showSuccess(success); })
          .catch(err =>
            {
              console.log(err);
              this.router.navigate(['/login']);
            });
      }

      if (accountForm.value.accountName != null && accountForm.value.accountName !='')
      {
        this.userService.updateAccountName(accountForm.value.accountName)
        .then((success) => { this.showSuccess(success); })
        .catch((err) => { this.error = err });
      }
    }
  }

  showSuccess(success: any)
  {
    this.success = success;
    $(document).ready(function(){$('#success').fadeOut(4000);});
  }

  checkValid(userForm: any): boolean
  {
    try
    {
      if (userForm.valid && this.user.photo.type.match('image/*'))
      {
        return true;
      }
      else return false
    }
    catch(e)
    {
      return false
    }
  }
}

//////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'profile',
  templateUrl: './settings.component.html'
})

export class SettingsComponent { }
