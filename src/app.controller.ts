import { Body, Controller, Get, Post, Query, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { PaymentDTO } from './newAccount.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  #accounts = [];

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }


  @Get("shop")
  @Render('shopForm')
  getShopForm(@Body()  @Res() res:Response){

  }



  @Post("shop")
  postShopForm(@Body() product, @Res() res:Response){
    console.log(product.product);
    return res.redirect("/newUser?product="+product.product);
  }


  @Get("newUser")
  @Render('newUserForm')
  getNewUserForm(){
    

    return {
      product:{},
      errors: []
    };
  }

  @Post("newUser")
  postNewUserForm(@Query() product, @Body() userData:PaymentDTO, @Res() res:Response){
      const errors = [];

      if(userData.balance < 0){
        errors.push("Balance cannot be negative");
      }

      if(userData.balance < parseInt(product.product)){
        errors.push("Balance is not enough to buy the product");
      }
      if(userData.name.length < 3){
        errors.push("Name must be at least 3 characters");
      }
      const billingAddressRegex = /^[A-Za-z\s]+,\s*\d{4,5},\s*[A-Za-z\s]+,\s*[A-Za-z\s]+\s*\d+$/;
      if (!billingAddressRegex.test(userData.billingAddress)) {
        errors.push("Billing address must be in the format: Country, Postal Code, City, Street and House Number");
      }
      if (!billingAddressRegex.test(userData.shippingAddress)) {
        errors.push("Shipping address must be in the format: Country, Postal Code, City, Street and House Number");
      }

      const couponCodeRegex = /^[A-Z]{2}-\d{4}$/;
      if (userData.couponCode && !couponCodeRegex.test(userData.couponCode)) {
        errors.push("Coupon code must be in the format BB-SSSS, where B is a capital letter and S is a number, e.g., PT-1255");
      }


      console.log(userData.cardNumber);
      const creditCardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
      if (!creditCardRegex.test(userData.cardNumber)) {
        errors.push("Credit card number must be in the format XXXX-XXXX-XXXX-XXXX");
      }

      const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryDateRegex.test(userData.expiryDate)) {
        errors.push("Expiry date must be in the format MM/YY");
      }
      const securityCodeRegex = /^\d{3}$/;
      if (!securityCodeRegex.test(userData.securityCode)) {
        errors.push("Security code must be a 3-digit number");
      }

      if(errors.length > 0) {
        res.render("newUserForm", {errors, product: userData});
        return ;
  }
  this.#accounts.push({
    name: userData.name,
    balance: userData.balance-product.product,
    billingAddress: userData.billingAddress,
    shippingAddress: userData.shippingAddress,
    couponCode: userData.couponCode,
    
  });
  res.redirect(303,"/successPage");

}

@Get("successPage")
@Render('successPage')
newAccountSuccess() {
  return {
    message: "Account created successfully",
    accounts :this.#accounts

  };
}
}
