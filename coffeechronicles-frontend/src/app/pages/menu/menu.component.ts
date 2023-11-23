import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  Inject
} from '@angular/core';


import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Order from 'src/app/model/Order';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { OrderService } from 'src/app/services/order/order.service';
import { SharedDataService } from 'src/app/services/sharedData/shared-data.service';
import { ViewmenuComponent } from 'src/app/viewmenu/viewmenu.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit{
  @ViewChild('editModal') editM: any;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('categoryContainer') categoryContainers!: QueryList<ElementRef>;

  item!: any;
  deleteItem!: any;
  items!: any;
  showFoodForm: boolean = false;
  addItemForm!: FormGroup;
  pid: any;
  menu!:any;
  order: Order[] = [];
  categories!: any;
  cid: any;
  active_item: any;
  categoryId: any;

  // categories = ['Category 1', 'Category 2', 'Category 3'];
  constructor(
    private menuService: MenuService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private sharedData: SharedDataService,
    public dialog: MatDialog,
  ) {}
  ngOnInit(): void {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      active:[],
      category: this.fb.group({
        cid: '',
      }),
    });
    // this.getProducts();
    this.getAll();

   
  }
  
  
  

  toggleFoodForm() {
    this.showFoodForm = !this.showFoodForm;
  }

  getRole(): boolean {
    return this.authService.getRole();
  }
 

  getAll(){
    this.categoryService.getCategories().subscribe(
      (data: any) => {
        this.categories = data;
        console.log(this.categories);

        if(!this.authService.getRole()){
        // Fetch items for each category based on their cid
        this.categories.forEach((category: any) => {
          this.menuService.getActiveProducts(category.cid).subscribe(
            (data: any) => {
              category.items = data;
               this.menu=data;
            },
            (error) => {
              console.log(error);
              this.toastr.error('Error', 'Server error');
            }
          );
        });
      }
      if(this.authService.getRole()){
        // Fetch items for each category based on their cid
        this.categories.forEach((category: any) => {
          this.menuService.getCategoryProducts(category.cid).subscribe(
            (data: any) => {
              category.items = data;
               this.menu=data;
            },
            (error) => {
              console.log(error);
              this.toastr.error('Error', 'Server error');
            }
          );
        });
      }
       
         // Now that items are loaded, call scrollToCategory
      //    this.route.params.subscribe((params) => {
      //     const cid = params['cid'];
      //     this.categoryId = cid;
      //     if (cid) {
      //       this.categoryContainers.changes.subscribe(
      //         (containers: QueryList<ElementRef>) => {
      //           if (containers && containers.length > 0) {
      //             this.scrollToCategory(this.categoryId);
      //           }
      //         }
      //       );
      //     }
      //   });
      },
      
      (error) => {
        console.log(error);
        this.toastr.error('Error', 'Server error');
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
        // this.getProducts();
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        // this.getProducts();
        // console.log(product);
        this.getAll();
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
  toggleActive() {
    // You can toggle the 'active' property in your 'item' based on the slide toggle state.
    
    
    this.item.active = !this.item.active; 
    console.log(this.item.active);
  }

  getAssetImageUrl(name: string): string {
    // Assuming your assets are stored in a folder named 'assets/images'
    // and the images have a .jpg extension
    const imageName = name.toLowerCase().replace(' ', '-') + '.jpg';
  
    // Construct the URL to your asset
    const imageUrl = `assets/${imageName}`;
  
    return imageUrl;
  }

  openDialog(
    name: any,
    title: any,
    description: any,
    price: any,
  ) {
    const dialogRef = this.dialog.open(ViewmenuComponent, {
      data: {
        name: name,
        title: title,
        description: description,
        price: price,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  
}
