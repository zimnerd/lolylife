import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { CheckoutData } from '../../data/checkout';
import { Settings } from './../../data/settings';

@Component({
    selector: 'app-address',
    templateUrl: './address.page.html',
    styleUrls: ['./address.page.scss'],
})
export class CheckoutAddressPage implements OnInit {
    errorMessage: any;
    loader: boolean = false;
    countries: any;

    /* For Delivery Date Time */
    mydate: any;
    time: any;
    date: any;
    selectedDate: any;

    constructor(public api: ApiService, public checkoutData: CheckoutData, public router: Router, public navCtrl: NavController, public settings: Settings, public route: ActivatedRoute) {

        /* For Delivery Date Time */
        /*this.mydate = [];
        this.selectedDate = 0;

        this.mydate[0] = new Date();
        this.mydate[1] = new Date(this.mydate[0].getTime() + (1000 * 60 * 60 * 24));
        this.mydate[2] = new Date(this.mydate[1].getTime() + (1000 * 60 * 60 * 24));
        this.mydate[3] = new Date(this.mydate[2].getTime() + (1000 * 60 * 60 * 24));
        this.mydate[4] = new Date(this.mydate[3].getTime() + (1000 * 60 * 60 * 24));

        var curr_date = ("0" + this.mydate[0].getDate()).slice(-2);
        var curr_month = ("0" + (this.mydate[0].getMonth() + 1)).slice(-2);
        var curr_year = this.mydate[0].getFullYear();
        this.checkoutData.form['jckwds-delivery-date'] = curr_date + '/' + curr_month + '/' + curr_year;
        

        var mm = this.mydate[0].getMonth() + 1;
        var dd = this.mydate[0].getDate();

        this.date = [this.mydate[0].getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
             ].join('');

        this.checkoutData.form['jckwds-delivery-date-ymd'] = this.date;  
        this.api.getTime(this.date)
           .then((results) => this.time = results);*/
        /* End of Delivery Date Time */

    }
    /* For Delivery Date Time */
    getTimeSlot(i){
        var curr_date = ("0" + this.mydate[i].getDate()).slice(-2);
        var curr_month = ("0" + (this.mydate[i].getMonth() + 1)).slice(-2);
        var curr_year = this.mydate[i].getFullYear();
        this.checkoutData.form['jckwds-delivery-date'] = curr_date + '/' + curr_month + '/' + curr_year;
        var mm = this.mydate[i].getMonth() + 1;
        var dd = this.mydate[i].getDate();

        this.date = [this.mydate[i].getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
             ].join('');
        this.api.ajaxCall('/wp-admin/admin-ajax.php',this.date)
           .then((results) => this.time = results);    
        this.checkoutData.form['jckwds-delivery-date-ymd'] = this.date;   
    }
    
    ngOnInit() {
        this.getCheckoutForm();
        //this.getCountries();
    }
    async getCheckoutForm() {
        this.loader = true;
        await this.api.postItem('get_checkout_form').then(res => {
            this.checkoutData.form = res;
            this.checkoutData.form.sameForShipping = true;
            if(this.checkoutData.form.countries) {
                if(this.checkoutData.form.countries.length == 1) {
                this.checkoutData.form.billing_country = this.checkoutData.form.countries[0].value;
                this.checkoutData.form.shipping_country = this.checkoutData.form.countries[0].value;
                }
                this.checkoutData.billingStates = this.checkoutData.form.countries.find(item => item.value == this.checkoutData.form.billing_country);
                this.checkoutData.shippingStates = this.checkoutData.form.countries.find(item => item.value == this.checkoutData.form.shipping_country);
            }
            
            this.loader = false;
        }, err => {
            console.log(err);
            this.loader = false;
        });
    }
    getCountries() {
        this.api.getItem('settings/general/woocommerce_specific_allowed_countries').then(res => {
            this.countries = res;
        }, err => {
            console.log(err);
        });
    }
    getBillingRegion() {
        this.checkoutData.billingStates = this.checkoutData.form.countries.find(item => item.value == this.checkoutData.form.billing_country);
        this.checkoutData.form.billing_state = '';
    }
    getShippingRegion() {
        this.checkoutData.shippingStates = this.checkoutData.form.countries.find(item => item.value == this.checkoutData.form.shipping_country);
        this.checkoutData.form.shipping_state = '';
    }
    async updateOrderReview() {
        await this.api.postItem('update_order_review').then(res => {
            this.checkoutData.orderReview = res;
        }, err => {
            console.log(err);
        });
    }
    
    continueCheckout() {

        this.errorMessage  = '';

        if(this.validateForm()){
            if(!this.checkoutData.form.ship_to_different_address)
            this.assgnShippingAddress();
            this.navCtrl.navigateForward('/tabs/cart/checkout');
        }
    }

    validateForm(){
        if(this.checkoutData.form.billing_first_name == '' || this.checkoutData.form.billing_first_name == undefined){
            this.errorMessage = 'Billing first name is a required field';
            return false;
        }

        if(this.checkoutData.form.billing_last_name == '' || this.checkoutData.form.billing_last_name == undefined){
            this.errorMessage = 'Billing last name is a required field';
            return false;
        }

        if(this.checkoutData.form.billing_phone == '' || this.checkoutData.form.billing_phone == undefined){
            this.errorMessage = 'Billing phone is a required field';
            return false;
        }

        if(this.checkoutData.form.billing_address_1 == '' || this.checkoutData.form.billing_address_1 == undefined){
            this.errorMessage = 'Billing Street address is a required field';
            return false;
        }

        if(this.checkoutData.form.billing_city == '' || this.checkoutData.form.billing_city == undefined){
            this.errorMessage = 'Billing city is a required field';
            return false;
        }

        if(this.checkoutData.form.billing_postcode == '' || this.checkoutData.form.billing_postcode == undefined){
            this.errorMessage = 'Billing post code is a required field';
            return false;
        }

        if(this.checkoutData.form.billing_country == '' || this.checkoutData.form.billing_country == undefined){
            this.errorMessage = 'Billing country is a required field';
            return false;
        }

        if(this.checkoutData.form.billing_state == '' || this.checkoutData.form.billing_state == undefined){
            this.errorMessage = 'Billing state is a required field';
            return false;
        }

        if(this.checkoutData.form.ship_to_different_address){
                if(this.checkoutData.form.shipping_first_name == '' || this.checkoutData.form.shipping_first_name == undefined){
                    this.errorMessage = 'Shipping first name is a required field';
                    return false;
                }

                if(this.checkoutData.form.shipping_last_name == '' || this.checkoutData.form.shipping_last_name == undefined){
                    this.errorMessage = 'Shipping last name is a required field';
                    return false;
                }

                if(this.checkoutData.form.shipping_address_1 == '' || this.checkoutData.form.shipping_address_1 == undefined){
                    this.errorMessage = 'Shipping Street address is a required field';
                    return false;
                }

                if(this.checkoutData.form.shipping_city == '' || this.checkoutData.form.shipping_city == undefined){
                    this.errorMessage = 'Shipping city is a required field';
                    return false;
                }

                if(this.checkoutData.form.shipping_postcode == '' || this.checkoutData.form.shipping_postcode == undefined){
                    this.errorMessage = 'Shipping post code is a required field';
                    return false;
                }

                if(this.checkoutData.form.shipping_country == '' || this.checkoutData.form.shipping_country == undefined){
                    this.errorMessage = 'Shipping country is a required field';
                    return false;
                }

                if(this.checkoutData.form.shipping_state == '' || this.checkoutData.form.shipping_state == undefined){
                    this.errorMessage = 'Shipping state is a required field';
                    return false;
                }
                return true;
        }

        else return true;
    }

    assgnShippingAddress(){
        this.checkoutData.form.shipping_first_name = this.checkoutData.form.billing_first_name;
        this.checkoutData.form.shipping_last_name = this.checkoutData.form.billing_last_name;
        this.checkoutData.form.shipping_company = this.checkoutData.form.billing_company;
        this.checkoutData.form.shipping_address_1 = this.checkoutData.form.billing_address_1;
        this.checkoutData.form.shipping_address_2 = this.checkoutData.form.billing_address_2;
        this.checkoutData.form.shipping_city = this.checkoutData.form.billing_city;
        this.checkoutData.form.shipping_postcode = this.checkoutData.form.billing_postcode;
        this.checkoutData.form.shipping_country = this.checkoutData.form.billing_country;
        this.checkoutData.form.shipping_state = this.checkoutData.form.billing_state;
        return true;
    }
}