import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE, CURRENT_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';

import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Child, ChildResponse } from 'src/app/shared/interfaces/Child';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { KindergartensComponent } from 'src/app/kindergartens/kindergartens.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, AfterViewInit {
  length: any;
  event: any;
  //

  constructor(public storeService: StoreService, private backendService: BackendService, private _liveAnnouncer: LiveAnnouncer) 
  { 
    this.myGroup = new FormGroup({
    FilterkindergardenId: new FormControl()});
  }
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;
  public firstPage: number = 1;
  message: boolean = false;
  public currentPaginatorPage: number = 0;

  public myGroup: any;

  //SpinnerVariables
  spinnerValue = 0;
  spinnerLoading = true;

  //Table and Paginator
  dataSource = new MatTableDataSource<Child>;
  
  displayedColumns: string[] = ['name', 'kindergarten', 'address', 'alter', 'geburtsdatum', 'anmeldeDatum', 'kindAbmelden'];

  @ViewChild('childrenTable', {static: true}) table!: MatTable<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //SortVariables
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    console.log('END ngAfterViewInit');
  }

  ngOnInit(): void {
    this.spinnerLoading = true;
    this.backendService.getChildrenWithReturn().subscribe((param: any) => {
      this.length = param.length;
    });
    console.log("BEFORE");
    console.log(this.dataSource);
    this.backendService.getChildrenWithReturn().subscribe( (param: any) => {
      console.log("While subscribe", param);
      this.dataSource = new MatTableDataSource<Child>(this.storeService.children);
      this.dataSource.paginator = this.paginator;

      this.spinnerLoading = false;
      this.spinnerValue = 0;

      //needed for nested object sorting
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'name': return item.name;
          case 'kindergarten': return item.kindergardenId;
          case 'address': return item.kindergardenId;
          case 'anmeldeDatum': return item.registerDate;
          default: return item.id;
        }
      };

      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = function (record,filter) {
        return record.kindergardenId.toString() == filter;
      }
    });



    this.dataSource = new MatTableDataSource<Child>(this.storeService.children);
    this.dataSource.paginator = this.paginator;
    
  }

  //FILTER
  public applyFilter = (value: number) => {
    console.log("Filter value: ", value);
    this.dataSource.filter = value.toString();
  }

  // this is needed to allow sorting on nested properties
  nestedProperty = (data: any, sortHeaderId: string): string | number => {
  return sortHeaderId
    .split('.')
    .reduce((accumulator, key) => accumulator && accumulator[key], data) as
    | string
    | number;
  };

  //Announce change in sort state
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);

    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    console.log('END announceSortChange');
  }
  
  ngOnChanges(): void {
    this.backendService.getChildren(this.currentPage)
      this.dataSource.paginator = this.paginator;
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

  selectPage(i: any) {
    let currentPage = i;
    this.selectPageEvent.emit(currentPage)
    this.backendService.getChildren(currentPage);
  }

  public returnAllPages() {
    let res = [];
    const pageCount = Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE);
    for (let i = 0; i < pageCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  public cancelRegistration(childId: string) {
    console.log('this.currentPage', this.currentPage);
    this.backendService.deleteChildData(childId, this.currentPage);
    this.message = true;
    this.onPaginatorPageChange(this.event.pageIndex);
    this.paginator.pageIndex = CURRENT_PAGE.currentP;
  }

  removeMessage() {
    this.message = false;
  }
  
  onPaginatorPageChange(event: PageEvent) {
    console.log('currentPage', this.currentPage);
    console.log('event.pageIndex', event.pageIndex);
    this.currentPage = event.pageIndex;
    this.selectPageEvent.emit(this.currentPage);
    this.backendService.getChildren(this.currentPage);
  }
}




