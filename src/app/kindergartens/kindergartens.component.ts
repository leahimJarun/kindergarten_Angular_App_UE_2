import { Component, Inject, OnInit } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { StoreService } from '../shared/store.service';
import { Typ } from '../shared/interfaces/Kindergarden';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-kindergartens',
  templateUrl: './kindergartens.component.html',
  styleUrls: ['./kindergartens.component.scss']
})
export class KindergartensComponent implements OnInit{

  id: number | undefined;

  constructor(public storeService: StoreService, public backendService: BackendService, public dialog: MatDialog) {}

  spinnerValue = 0;
  spinnerLoadingKindergartens = true;

  ngOnInit(): void {
    this.spinnerLoadingKindergartens = true;
    this.backendService.getKindergardens().subscribe((param: any) => {
      this.spinnerLoadingKindergartens = false;
    });
  }

  getTypeOfKindergartens(type: number) {
    var realType = Typ[type];
    return realType;
  }

  openDialog(id: number, kindergardenType: number) {
    //const dialogRef = this.dialog.open(DialogContentDialog);
    this.backendService.getKindergardens().subscribe((param: any) => {
      this.spinnerLoadingKindergartens = false;
    });
    
    /*
    const dialogRef = this.dialog.open(DialogContentDialog, {
      data: {
          person: {
              name: 'Simon',
              age: 32,
          }
      },});
    */
    //this.storeService.kindergardens.filter(name == '');
    console.log(this.storeService.kindergardens);
    console.log(this.id);
    //const dialogRef = this.dialog.open(DialogContentDialog, {data: this.storeService.kindergardens.find(kindergarden => kindergarden.id == id)});
    //const typeOfKindergarden = this.getTypeOfKindergartens(id);
    const typeOfKindergarden = this.getTypeOfKindergartens(id);
    console.log(typeOfKindergarden);

    const kindergardenFoundEntry = this.storeService.kindergardens.find(kindergarden => kindergarden.id == id);
    //const dialogRef = this.dialog.open(DialogContentDialog, {data: this.storeService.kindergardens.find(kindergarden => kindergarden.id == id)});
    const dialogRef = this.dialog.open(DialogContentDialog, {
      data: {
        kindergarden: this.storeService.kindergardens.find(kindergarden => kindergarden.id == id),
        type: this.getTypeOfKindergartens(kindergardenType)
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'kindergartensDialog',
  templateUrl: 'kindergartensDialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentDialog{
  constructor(public dialogRef: MatDialogRef<DialogContentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {}

}
