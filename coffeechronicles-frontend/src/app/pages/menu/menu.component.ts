import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @ViewChild('editModal') editM: any;
  @ViewChild('deleteModal') deleteModal: any;

  item!: any;
  deleteItem!: any;
  items!: any;
  showFoodForm: boolean = false;
  addItemForm!: FormGroup;
  pid: any;
  categories!: any;

  // categories = ['Category 1', 'Category 2', 'Category 3'];
  constructor(
    private menuService: MenuService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: this.fb.group({
        cid: '',
      }),
    });
    this.getProducts();
    this.categoryService.getCategories().subscribe(
      (data: any) => {
        this.categories = data;
        console.log(this.categories);
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error', 'Server error');
      }
    );
  }

  toggleFoodForm() {
    this.showFoodForm = !this.showFoodForm;
  }

  getRole(): boolean {
    return this.authService.getRole();
  }
  getProducts() {
    this.menuService.getProducts().subscribe(
      (res: any) => {
        console.log(res);
        this.items = res;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  addProduct(product: any) {
    // const categoryId = product.category.cid;
    // console.log(product.category.cid);

    // Create the product object with the desired structure
    // const productData = {
    //   name: product.name,
    //   price: product.price,
    //   description: product.description,
    //   category: { cid: categoryId }
    // };

    this.showFoodForm = !this.showFoodForm;
    this.menuService.addProduct(product).subscribe(
      (res: any) => {
        // console.log(res);
        this.getProducts();
      },
      (error: HttpErrorResponse) => {
        this.getProducts();
        // console.log(product);
        console.log(error);
      }
    );
  }

  updateProduct(product: any, pid: number) {
    // const categoryId = product.category.cid;
    console.log(product);
    
    product.pid = pid;
    const item: any = {
      pid: pid,
      name: product.name,
      description: product.description,
      price: product.price,
      // category: { cid: categoryId }
      category: { cid: product.category }
    };
    console.log(product.category.cid)
    console.log(item);

    this.menuService.updateProduct(item).subscribe(
      (res: any) => {
        this.getProducts();
      },
      (error: HttpErrorResponse) => {
        this.getProducts();
      }
    );
    this.closeEditModal();
  }

  deleteProduct(pid: any) {
    console.log(pid);
    this.menuService.deleteProduct(pid).subscribe(
      (res: any) => {
        this.getProducts();
      },
      (error: HttpErrorResponse) => {
        this.getProducts();
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
}
