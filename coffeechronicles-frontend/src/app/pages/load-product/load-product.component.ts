import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import Order from 'src/app/model/Order';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-load-product',
  templateUrl: './load-product.component.html',
  styleUrls: ['./load-product.component.css']
})
export class LoadProductComponent implements OnInit {
  @ViewChild('editModal') editM: any;
  @ViewChild('deleteModal') deleteModal: any;
  
  categoryId: any;
  items!: any;
  categoryTitle:any;
  item!: any;
  order: Order[] = [];
  categories!: any;
  deleteItem!: any;

  constructor(private route:ActivatedRoute, private authService:AuthService, private menuService: MenuService,
    private toastr:ToastrService, private orderService:OrderService, private modalService: NgbModal,
    private categoryService:CategoryService){

  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const cid = params['cid'];
      this.categoryId = cid;
      console.log(this.categoryId);
  });

  this.getAll();
  
  }
  getAll(){
    if(!this.authService.getRole()){
    
    
      this.menuService.getActiveProducts(this.categoryId).subscribe(
        (data: any) => {
          this.items = data;
          if (this.items.length > 0 && this.items[0].category) {
            this.categoryTitle = this.items[0].category.title;
            console.log(this.categoryTitle);
           console.log(data);
          }
        },
        (error) => {
          console.log(error);
          this.toastr.error('Error', 'Server error');
        }
      );
    
  }
  if(this.authService.getRole()){
    
    
      this.menuService.getCategoryProducts(this.categoryId).subscribe(
        (data: any) => {
          this.items = data;
          if (this.items.length > 0 && this.items[0].category) {
            this.categoryTitle = this.items[0].category.title;
            console.log(this.categoryTitle);
           console.log(data);
          }
        },
        (error) => {
          console.log(error);
          this.toastr.error('Error', 'Server error');
        }
      );

      this.categoryService.getCategories().subscribe(
        (data: any) => {
          this.categories = data;
          console.log(this.categories);
        },
        (error) => {
          console.log(error);
          this.toastr.error('Error', 'Server error');
        });
        
    
  }

  }
  getRole(): boolean {
    return this.authService.getRole();
  }

  addToOrder(item: any) {
    // Add the item to the order using the service

    const singleOrder: Order = {
      name: item.name,
      price: item.price.toString(),
      quantity: '1',
      total: (parseFloat(item.price) * 1).toFixed(2),
    };
    this.orderService.addToOrder(singleOrder);
    // this.order.push(singleOrder);
    this.toastr.success('Success', 'Added to your order cart!!');
    // console.log(item);
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
      active:product.active,
      // category: { cid: categoryId }
      category: { cid: product.category },
    };
    console.log(product.category.cid);
    console.log(item);

    this.menuService.updateProduct(item).subscribe(
      (res: any) => {
        // this.getProducts();
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        // this.getProducts();
        this.getAll();
      }
    );
    this.closeEditModal();
  }

  deleteProduct(pid: any) {
    console.log(pid);
    this.menuService.deleteProduct(pid).subscribe(
      (res: any) => {
        // this.getProducts();
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        // this.getProducts();
        this.getAll();
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
