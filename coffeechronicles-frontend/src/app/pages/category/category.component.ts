import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @ViewChild('editModal') editM: any;
  @ViewChild('deleteModal') deleteModal: any;

  item!: any;
  deleteItem!: any;
  items!: any;
  showFoodForm: boolean = false;
  addItemForm!: FormGroup;
  cid: any;
  constructor(
    private categoryService:CategoryService,
    private authService: AuthService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    
  ) {}
  ngOnInit(): void {
    
    this.addItemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.getCategories();
  }

  toggleFoodForm() {
    this.showFoodForm = !this.showFoodForm;
  }

  getRole(): boolean {
    return this.authService.getRole();
  }
  getCategories() {
    this.categoryService.getCategories().subscribe(
      (res: any) => {
        console.log(res);
        this.items = res;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  addCategory(category: any) {
    this.showFoodForm = !this.showFoodForm;
    this.categoryService.addCategory(category).subscribe(
      (res: any) => {
        this.getCategories();
      },
      (error: HttpErrorResponse) => {
        this.getCategories();
        // console.log(error.message);
      }
    );
  }

  updateCategory(category: any, cid: number) {
    category.cid = cid;
    const item: any = {
      cid: cid,
      title: category.title,
      description: category.description,
      
    };
    console.log(item);

    this.categoryService.updateCategory(item).subscribe(
      (res: any) => {
        this.getCategories();
      },
      (error: HttpErrorResponse) => {
        this.getCategories();
      }
    );
    this.closeEditModal();
  }

  deleteCategory(cid: any) {
    console.log(cid);
    this.categoryService.deleteCategory(cid).subscribe(
      (res: any) => {
        this.getCategories();
      },
      (error: HttpErrorResponse) => {
        this.getCategories();
      }
    );
    this.closeDeleteModal();
  }

  openEditModal(item: any) {
    this.item = item;
    this.modalService.open(this.editM);
  }

  closeEditModal() {
    this.modalService.dismissAll();
  }

  openDeleteModal(item: any) {
    this.deleteItem = item;
    this.modalService.open(this.deleteModal);
  }

  closeDeleteModal() {
    this.modalService.dismissAll();
  }

  getAssetImageUrl(name: string): string {
    // Assuming your assets are stored in a folder named 'assets/images'
    // and the images have a .jpg extension
    const imageName = name.toLowerCase().replace(' ', '-') + '.jpg';
  
    // Construct the URL to your asset
    const imageUrl = `assets/${imageName}`;
  
    return imageUrl;
  }

}
