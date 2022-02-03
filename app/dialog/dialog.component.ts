import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog"

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList=["Brandnew","Secondhand","Refurbished"]
  productForm !:  FormGroup;
  actionBtn: String ="Save";
  constructor(private formbuilder : FormBuilder,
    private api:ApiService,
    @Inject(MAT_DIALOG_DATA) public editData:any,
    private dialogref:MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {

    this.productForm=this.formbuilder.group({
      productName : ['',Validators.required],
      category : ['',Validators.required],
      freshness : ['',Validators.required],
      price : ['',Validators.required],
      comment : ['',Validators.required],
      date : ['',Validators.required]
    })  

    if(this.editData){
      this.actionBtn="Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
    }

  }
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            alert("product added successfully");
            this.productForm.reset();
            this.dialogref.close("Saved");
          },
          error:()=>{
            alert("Error while adding the product");  
          }
        })
      }
      }else{
        this.updateProduct();
    }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Product Updated Successfully");
        this.productForm.reset();
        this.dialogref.close('Updated');
      },
      error:()=>{
        alert("Error While Updating the record");
      }
    })
  }

}
