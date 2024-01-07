import { Component, OnInit } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { StoreService } from '../shared/store.service';
import { Typ } from '../shared/interfaces/Kindergarden';

@Component({
  selector: 'app-kindergartens',
  templateUrl: './kindergartens.component.html',
  styleUrls: ['./kindergartens.component.scss']
})
export class KindergartensComponent implements OnInit{

  constructor(public storeService: StoreService, public backendService: BackendService) {}

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
}
