import { Component, Inject ,OnInit, ViewChild} from '@angular/core';
import { CadModel } from '../shared/cad-model';
import { CadModelService } from '../shared/cad-model.service';
import { ModelFormComponent } from'./model-form.component'
import * as $ from 'jquery';

@Component
({
  selector: 'newmodel',
  templateUrl: './newmodel.component.html'
})

export class NewmodelComponent implements OnInit
{
  public error: any;
  public success: any;
  public model: CadModel;
  public valid: boolean = false;
  @ViewChild(ModelFormComponent) private modelFormComponent : ModelFormComponent;

  constructor(private modelService: CadModelService)
  {}

  ngOnInit()
  {
    this.newModel();
  }

  // Creates the new model in firebase
  //
  onSubmit()
  {
    // reset error and success
    this.error = null;
    this.success = null;

    // checks if form valid
    if (this.valid)
    {
      // creates a new model with files
      this.modelService.createModel(this.model)
        .then((success) =>
          {
            this.success = success;
            $(document).ready(function(){$('#success').fadeOut(5000)});
            this.newModel();
          })
        .catch((err) => this.error = err)
    }
    else this.error = "Please check your input!";
  }

  // Reset for a new model
  //
  newModel()
  {
    this.modelFormComponent.resetForm();
    this.error = null;

    // new instance of CadModel
    this.model = new CadModel();
  }

//end of class
}
