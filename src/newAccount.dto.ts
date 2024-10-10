interface Address {
    country: string;
    postalCode: string;
    city: string;
    street: string;
    houseNumber: string;
  }
  
  interface PaymentMethod {

  }

  export class PaymentDTO {
    name: string;
    balance: number;
    billingAddress: string;
    shippingAddress: string;
    // billingAddress: Address;
    // shippingAddress: Address;
    couponCode?: string; 
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
}