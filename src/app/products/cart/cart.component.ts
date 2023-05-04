import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;

  constructor(private api: ApiService, private fb: FormBuilder) {}
  allProducts: any = [];
  cartTotalprice: any = 0;
  proceedtopaymentstatus: Boolean = false;
  offerClickedStatus: Boolean = false;
  discountClickStatus: Boolean = false;
  username: any = '';
  flat: any = '';
  street: any = '';
  state: any = '';
  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;
  showPaypal: boolean = false;

  //formgroup
  addressForm = this.fb.group({
    username: [''],
    flat: [''],
    street: [''],
    state: [''],
  });

  ngOnInit(): void {
    this.api.getCart().subscribe(
      //200
      (result: any) => {
        this.allProducts = result;
        this.getCartTotalPrice();
        //paypal
        this.initConfig();
      },
      //400
      (result: any) => {
        console.log(result.error);
      }
    );
  }

  //when Proceed to Payment is clicked
  submitBtnClicked() {
    if (this.addressForm.valid) {
      this.proceedtopaymentstatus = true;
      this.username = this.addressForm.value.username;
      this.flat = this.addressForm.value.flat;
      this.street = this.addressForm.value.street;
      this.state = this.addressForm.value.state;
    } else {
      alert('Please enter the Valid info');
    }
  }

  //when offers is clicked
  offerClicked() {
    this.offerClickedStatus = true;
  }

  //clears the delivery/payment details when closed
  clearForm() {
    this.addressForm.reset();
    this.username = '';
    this.flat = '';
    this.street = '';
    this.state = '';
    this.proceedtopaymentstatus = false;
    this.showError = false;
    this.showCancel = false;
    this.showSuccess = false;
    this.showPaypal = false;
  }

  removeCartitem(id: any) {
    this.api.removecartitem(id).subscribe(
      //200
      (result: any) => {
        this.allProducts = result;
        this.getCartTotalPrice();
        this.api.cartCount();
      },
      //400
      (result: any) => {
        alert(result.error);
      }
    );
  }

  getCartTotalPrice() {
    let total = 0;
    this.allProducts.forEach((i: any) => {
      total += i.grandTotal;
      this.cartTotalprice = Math.ceil(total);
    });
  }

  emptycart() {
    this.api.emptyCart().subscribe(
      (result: any) => {
        this.allProducts = [];
        this.getCartTotalPrice();

        this.api.cartCount();
      },
      //400
      (result: any) => {
        alert(result.error);
      }
    );
  }

  //increment cart item
  incCartItem(id: any) {
    this.api.incCartItem(id).subscribe(
      //200
      (result: any) => {
        this.allProducts = result;
        //update grand total
        this.getCartTotalPrice();
      },
      //400
      (result: any) => {
        alert(result.error);
      }
    );
  }

  //increment cart item
  decCartItem(id: any) {
    this.api.decCartItem(id).subscribe(
      //200
      (result: any) => {
        this.allProducts = result;
        //update grand total
        this.getCartTotalPrice();
      },
      //400
      (result: any) => {
        alert(result.error);
      }
    );
  }

  //50% discount
  discount50() {
    let discount: any = Math.ceil((this.cartTotalprice * 50) / 100);
    this.cartTotalprice -= discount;
    this.discountClickStatus = true;
  }

  //10% discount
  discount10() {
    let discount: any = Math.ceil((this.cartTotalprice * 10) / 100);
    this.cartTotalprice -= discount;
    this.discountClickStatus = true;
  }

  makepayment() {
    this.showPaypal = true;
  }

  //paypal
  private initConfig(): void {
    let amount = this.cartTotalprice.toString();
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: amount,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: amount,
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: amount,
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.showSuccess = true;
        //empty cart
        this.emptycart();
        this.showPaypal = false;
        this.proceedtopaymentstatus = false;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;
        this.showPaypal = false;
      },
      onError: (err) => {
        console.log('OnError', err);
        this.showError = true;
        this.showPaypal = false;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
