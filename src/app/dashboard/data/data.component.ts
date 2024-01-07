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

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, AfterViewInit {
  length: any;
  event: any;
  //

  constructor(public storeService: StoreService, private backendService: BackendService, private _liveAnnouncer: LiveAnnouncer) {}
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;
  public firstPage: number = 1;
  message: boolean = false;
  public currentPaginatorPage: number = 0;

  //SpinnerVariables
  spinnerValue = 0;
  spinnerLoading = true;

  //Table and Paginator
  //dataSource = new MatTableDataSource<Child>(this.storeService.children);
  dataSource = new MatTableDataSource<Child>;
  
  //dataSource = new MatTableDataSource<Child>;
  //dataSource = new MatTableDataSource<ChildResponse>(this.backendService.getChildren(1));
  displayedColumns: string[] = ['name', 'kindergarten', 'address', 'alter', 'geburtsdatum', 'anmeldeDatum', 'kindAbmelden'];

  @ViewChild('childrenTable', {static: true}) table!: MatTable<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //SortVariables
  @ViewChild(MatSort) sort!: MatSort;
  /*@ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }*/

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
    //this.paginator.pageIndex = this.paginator.pageIndex;
    console.log('END ngAfterViewInit');
  }

  ngOnInit(): void {
    this.spinnerLoading = true;
    this.backendService.getChildrenWithReturn().subscribe((param: any) => {
      this.length = param.length;
    });
    //this.backendService.getChildren(this.currentPage);
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
          //case 'address': return item.name;
          //case 'anmeldeDatum': return new Date(item.registerDate).toDateString();
          case 'anmeldeDatum': return item.registerDate//new Date(item.registerDate).toLocaleDateString();
          default: return item.id;
        }
      };

      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = function (record,filter) {
        return record.kindergardenId.toString() == filter;
      }

      /*
      const sortState: Sort = {active: 'name', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
      */
    });
    //console.log("After subscribe done");



    this.dataSource = new MatTableDataSource<Child>(this.storeService.children);
    this.dataSource.paginator = this.paginator;
    
  }

  //FILTER
  public applyFilter = (value: number) => {
    console.log("Filter value: ", value);
    //value = "Kindergarden der Stadt Wien ";
    //this.dataSource.filter = value.toString();//value.trim().toLocaleLowerCase();//.trim().toLocaleLowerCase();
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

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);

    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    console.log('END announceSortChange');
  }
  
  ngOnChanges(): void {
    this.backendService.getChildren(this.currentPage)
    //if(changes['dataSource'].currentValue) {
      //this.dataSource = new MatTableDataSource<Child>(this.storeService.children);
      //this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  //}
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
    //console.log('eventPageIndex', this.paginator.pageIndex);
    console.log('this.currentPage', this.currentPage);
    //this.currentPaginatorPage = this.paginator.page;
    //CURRENT_PAGE.currentP =  this.currentPage;
    this.backendService.deleteChildData(childId, this.currentPage);
    this.message = true;
    //this.ngOnChanges();
    //this.onPaginatorPageChange(this.event.pageIndex);
    this.onPaginatorPageChange(this.event.pageIndex);
    this.paginator.pageIndex = CURRENT_PAGE.currentP;
    //this.paginator.pageIndex = this.currentPage;
    //this.paginator.pageIndex = this.currentPage;
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




