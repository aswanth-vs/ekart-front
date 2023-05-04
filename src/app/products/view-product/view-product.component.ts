import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit {
  productId: string = '';
  product: any = {};
  constructor(
    private viewActivatedRoute: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((data: any) => {
      console.log(data.id);
      this.productId = data.id;
      console.log(this.productId);
    });

    //view product api call
    this.api.viewproduct(this.productId).subscribe(
      (result: any) => {
        this.product = result;
        console.log(this.product);
      },
      (error: any) => {
        alert(error.error);
      }
    );
  }

  //wishlist
  addtowishlist() {
    const { id, title, price, image } = this.product;
    this.api.addtowishlist(id, title, price, image).subscribe(
      (result: any) => {
        //200
        alert(result);
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
        this.api.cartCount();
        alert(result);
      },
      //400
      (result: any) => {
        alert(result.error);
      }
    );
  }
}
