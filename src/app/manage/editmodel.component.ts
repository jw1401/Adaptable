import { Component, Inject ,OnInit} from '@angular/core';
import { FirebaseListObservable} from 'angularfire2';
import { CadModel } from '../shared/cad-model';
import { FormsModule } from '@angular/forms';
import {CadModelService} from '../shared/cad-model.service';
import { Observable, Subject } from 'rxjs/Rx';

@Component
({
  selector: 'editmodel',
  templateUrl: './editmodel.component.html'
})

export class EditmodelComponent implements OnInit
{
  public error:any;

  public model : CadModel;
  public modelKey : string;
  public items: Observable<any>;

 constructor(private modelService: CadModelService)
 {
   this.model=  new CadModel("userId","Name", "Description","",0,"imageURL","modelURL");
 }

  ngOnInit()
  {
    //query for all models that belongs to user with uid
    this.items = this.modelService.getEditModels();
    //this.modelService.getEditModels().subscribe(value => this.items=value)

  }

  //make model data available in the modal
  editItem(key: string, name: string, description: string, power: string,
    like: number, imageURL:string, modelURL:string, customizable:boolean, userId:string)
  {
    this.modelKey = key;

    this.model.userId=userId;
    this.model.name= name;
    this.model.description = description;
    this.model.power = power;
    this.model.like = like;
    this.model.imageURL = imageURL;
    this.model.modelURL = modelURL;
    this.model.isCustomizable = customizable;
  }

  updateItem(key: string)
  {
    this.modelService.updateModel(key, this.model);
  }

  updateLike(key: string, like: number)
  {
    this.modelService.updateLike(key, like);
  }

  deleteItem(key:string)
  {
    this.modelService.deleteModel(key, this.model.imageURL, this.model.modelURL);
  }

  deleteItemOnCard(key:string, imageURL, modelURL)
  {
    this.modelService.deleteModel(key, imageURL, modelURL);
    this.items = this.modelService.getEditModels();

  }
}
