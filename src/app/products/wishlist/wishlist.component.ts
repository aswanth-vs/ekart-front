import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  allProducts: any = [];
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.getwishlist().subscribe(
      (result: any) => {
        console.log(result);
        this.allProducts = result;
      },
      (result: any) => {
        console.log(result.error);
      }
    );
  }

  //remove wishlist item
  removeitem(id: any) {
    this.api.removewishlistitem(id).subscribe(
      //200
      (result: any) => {
        this.allProducts = result;
      },
      //400
      (result: any) => {
        alert(result.error);
      }
    );
  }

  addtocart(product: any) {
    //add {quantity: 1} to product object
    Object.assign(product, { quantity: 1 });
    this.api.addtocart(product).subscribe(
      //200
      (result: any) => {
        //to make the cart count increment
        this.api.cartCount();
        //remove item from wishlist
        this.removeitem(product.id);
        alert(result);
      },
      //400
      (result: any) => {
        alert(result.error);
      }
    );
  }
}
