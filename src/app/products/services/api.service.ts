import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  BASE_URL = 'https://ecommerce-2rx7.onrender.com';

  constructor(private http: HttpClient) {
    this.cartCount();
  }

  //to hold searchterm
  searchTerm = new BehaviorSubject('');

  //hold cart items count
  cartItemsCount = new BehaviorSubject(0);

  //get all products
  getallproducts() {
    return this.http.get(`${this.BASE_URL}/products/all-products`);
  }

  //view product
  viewproduct(id: any) {
    return this.http.get(`${this.BASE_URL}/products/view-product/${id}`);
  }

  //wishlist
  addtowishlist(id: any, title: any, price: any, image: any) {
    const body = {
      id,
      title,
      price,
      image,
    };
    return this.http.post(`${this.BASE_URL}/wishlist/add-product`, body);
  }

  //get wishlist items
  getwishlist() {
    return this.http.get(`${this.BASE_URL}/wishlist/get-products`);
  }

  //remove wishlist item
  removewishlistitem(id: any) {
    return this.http.delete(`${this.BASE_URL}/wishlist/remove-item/${id}`);
  }

  //add to cart
  addtocart(product: any) {
    const body = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      quantity: product.quantity,
    };

    return this.http.post(`${this.BASE_URL}/cart/add-product`, body);
  }

  //get all cart items
  getCart() {
    return this.http.get(`${this.BASE_URL}/cart/all-products`);
  }

  cartCount() {
    this.getCart().subscribe((result: any) => {
      this.cartItemsCount.next(result.length);
    });
  }

  //remove cart item
  removecartitem(id: any) {
    return this.http.delete(`${this.BASE_URL}/cart/remove-item/${id}`);
  }

  //empty cart
  emptyCart() {
    return this.http.delete(`${this.BASE_URL}/cart/remove-all-items`);
  }

  //increment cart item quantity
  incCartItem(id: any) {
    return this.http.get(`${this.BASE_URL}/cart/increment-item/${id}`);
  }

  //decrement cart item quantity
  decCartItem(id: any) {
    return this.http.get(`${this.BASE_URL}/cart/decrement-item/${id}`);
  }
}
