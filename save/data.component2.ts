import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';

import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Child, ChildResponse } from 'src/app/shared/interfaces/Child';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  length: any;
  event: any;

  constructor(public storeService: StoreService, private backendService: BackendService) {}
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;
  public firstPage: number = 1;
  message: boolean = false;

  //Table and Paginator
  //dataSource = new MatTableDataSource<Child>(this.storeService.children);
  dataSource = new MatTableDataSource<Child>;
  
  //dataSource = new MatTableDataSource<Child>;
  //dataSource = new MatTableDataSource<ChildResponse>(this.backendService.getChildren(1));
  displayedColumns: string[] = ['name', 'kindergarten', 'address', 'alter', 'geburtsdatum', 'kindAbmelden'];

  @ViewChild('childrenTable', {static: true}) table!: MatTable<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

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
    });
    //console.log("After subscribe done");
    this.dataSource = new MatTableDataSource<Child>(this.storeService.children);
    this.dataSource.paginator = this.paginator;
    
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
    this.backendService.deleteChildData(childId, this.currentPage);
    this.message = true;
    //this.ngOnChanges();
    this.onPaginatorPageChange(this.event.pageIndex);
    //location.reload();
    /*
    this.backendService.getChildrenWithReturn().subscribe( (param: any) => {
      console.log("While subscribe", param);
      this.dataSource = new MatTableDataSource<Child>(this.storeService.children);
      this.dataSource.paginator = this.paginator;
    });
    //this.dataSource = new MatTableDataSource<Child>(this.storeService.children);
    this.dataSource.paginator = this.paginator;
    */
  }

  removeMessage() {
    this.message = false;
  }

  onPaginatorPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.selectPageEvent.emit(this.currentPage);
    this.backendService.getChildren(this.currentPage);
    
  }

}




