import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule, AbstractControl, NgForm, FormGroup } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss'],
  //standalone: true,
  //imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
})
export class AddDataComponent implements OnInit{

  constructor(private formbuilder: FormBuilder, public storeService: StoreService, public backendService: BackendService) {}
  public addChildForm!: any;
  @Input() currentPage!: number;

  messageSuccess: boolean = false;
  messageError: boolean = false;

  submitted = false;

  //email = new FormControl('', [Validators.required, Validators.email]);
  
  ngOnInit(): void {
    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      kindergardenId: ['', Validators.required],
      birthDate: [null, Validators.required],
      registerDate: [null]
    });
    console.log('ngOnItit', this.addChildForm.name);
  }

  getTodaysDate(): string {
    const todaysDate = new Date();
    let formattedTodaysDate = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate();
    console.log('formattedTodaysDateFUNCTION: ', formattedTodaysDate);
    return formattedTodaysDate;
  }
/*
  ngOnChanges(): void {
    this.submitted = false;
    this.addChildForm.reset({
      name: '', 
      kindergardenId: '',
      birthDate: ''
     });
  }
*/

  onSubmit() {
    if(this.addChildForm.valid) {
      console.log(this.currentPage);
      console.log('Form Data:', this.addChildForm.value);
      console.log('Current Page:', this.currentPage);
      let todaysDate = this.getTodaysDate();
      this.addChildForm.value.registerDate = todaysDate;
      console.log('addChildForm: ', this.addChildForm.registerDate);
      this.backendService.addChildData(this.addChildForm.value, this.currentPage);
      this.messageSuccess = true;
      //this.submitted = true;
      //this.addChildForm.reset( {} );
      //this.addChildForm.resetForm( {} );
      //this.clear(this.addChildForm);
      //this.addChildForm.name.setErrors(null);
      console.log(this.addChildForm);
      //this.submitted = false;
    } else {
      this.messageError = true;
      this.submitted = false;
    }
  }

  clear(form: NgForm): void {
    form.resetForm();
    Object.keys(form.controls).forEach(key =>{
       form.controls[key].setErrors(null)
    });
  }

  removeMessage(){
    this.messageSuccess = false;
  }

  removeErrorMessage(){
    this.messageError = false;
  }

  numberFormControl = new FormControl('', [
    Validators.min(3),
    Validators.max(6),
  ]);
 
  childRegisterButtonFormControl(){

  }

  getErrorMessageName() {
    if (this.addChildForm.hasError('required')) {
      return 'Feld muss ausgefüllt sein.';
    }

    return this.addChildForm.hasError('name') ? 'Kein valider Wert' : '';
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
        age--;
    }
    return age;
  }

  //minimumAgeValidator(): ValidatorFn {
  //  return (control: AbstractControl): { [key: string]: boolean} | null => {
  //    const currentDate
  //  }
  //}
}
