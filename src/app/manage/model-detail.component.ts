import { Component, Input, Output, ViewChild, EventEmitter,AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CadModel, powers } from '../shared/cad-model';
import { licenses } from '../shared/license';
import * as $ from 'jquery';

@Component
({
  selector: 'model-detail',
  templateUrl: './model-detail.component.html'
})

export class ModelDetailComponent implements AfterViewChecked
{
  @Input() model : CadModel
  @Output() isValid = new EventEmitter<boolean>();
  @ViewChild('ModelForm') currentForm: NgForm;

  ModelForm: NgForm;
  imagePreview: string;
  error: any = null;
  powers: any = powers
  licenses: any = licenses;

  constructor()
  {}

  ngAfterViewChecked()
  {
    this.formChanged()
  }

  formChanged()
  {
    if (this.currentForm === this.ModelForm) { return; }

    this.ModelForm = this.currentForm;

    if (this.ModelForm)
    {
      this.ModelForm.valueChanges
        .subscribe(data =>{this.checkValid();});
    }
  }

  fileImageChangeEvent(event: any)
  {
    this.error = null;

    // get file and attributes
    this.model.image.file = event.target.files[0];
    this.model.image.name = event.target.files[0].name;
    this.model.image.type = event.target.files[0].type;

    if (event.target.files && event.target.files[0] && event.target.files[0].type.match('image/*'))
    {
      var reader = new FileReader();
      reader.onload = (event:any) => {this.imagePreview = event.target.result;}
      reader.readAsDataURL(event.target.files[0]);
    }

    if (!this.model.image.type.match('image/*')) this.error = "Only *.jpg or *.png files";

    this.checkValid();
  }

  fileModelChangeEvent(event: any)
  {
    this.error = null;
    let extension: string;

    this.model.model.file = event.target.files[0];
    this.model.model.name = event.target.files[0].name;
    this.model.model.type = event.target.files[0].type;

    //get file extension
    extension = this.model.model.name.split('.').pop().toLowerCase()

   //check the file extension and set model.type
   switch(extension)
    {
      case "stl":
        this.model.model.type = "stl";
        break;

      case "jscad":
        this.model.model.type = "jscad";
        break;

      default:
        this.error = "Only *.stl or *.jscad files";
    }

    this.checkValid();
  }

  checkValid()
  {
    try
    {
      if (this.ModelForm.valid && this.model.image.type.match('image/*') &&
      (this.model.model.type === "stl"|| this.model.model.type ==="jscad"))
      {
        this.isValid.emit(true)
      }
      else this.isValid.emit(false)
    }
    catch(e)
    {
      this.isValid.emit(false)
    }
  }

  resetForm()
  {
    this.error = null;
    this.imagePreview = "../../assets/imgs/no-image-2.png";
  }

//end of class
}
