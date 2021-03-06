import { Component, OnInit,ViewChild,ViewContainerRef,ComponentFactoryResolver } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Angular-ReaactiveForm';
  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness' ,'price' , 'comment' ,'action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog:MatDialog ,private api:ApiService,private viewConatainer:ViewContainerRef,private componentReference:ComponentFactoryResolver){}

  ngOnInit(): void {
      this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent , {
    width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val=='Saved'){
        this.getAllProducts();
      }
    })
  }

  getAllProducts(){
    this.api.getProduct()
    .subscribe({
      next:(res)=>{
        this.dataSource= new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort
      },
      error:()=>{
        alert("Error While fetching the record");
      }
    })
  }
  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row
      
    }).afterClosed().subscribe(val=>{
      if(val=="Updated"){
        this.getAllProducts();
      }
    })
  }
  deleteProduct(id:number){
    this.api.deleteProduct(id).subscribe({
      next:(res)=>{
        alert("Product Deleted Successfully");
        this.getAllProducts();

      },
      error:()=>{
        alert("Error While Deleting Product");
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async loadAdmin(){
    this.viewConatainer.clear;
    const{ AdminComponent } =await import("./admin/admin.component");
    this.viewConatainer.createComponent(
      this.componentReference.resolveComponentFactory(AdminComponent)
    )
  }

  async loadUser(){
    this.viewConatainer.clear;
    const{ UserComponent } =await import("./user/user.component");
    this.viewConatainer.createComponent(
      this.componentReference.resolveComponentFactory(UserComponent)
    )
  }
  async loadLogin(){
    this.viewConatainer.clear;
    const{ LoginComponent } =await import("./login/login.component");
    this.viewConatainer.createComponent(
      this.componentReference.resolveComponentFactory(LoginComponent)
    )
  }
}
