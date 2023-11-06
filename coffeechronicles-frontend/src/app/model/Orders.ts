export default interface Orders {
    createdBy: string;
    email: string;
    // firstName: string;
    // lastName: string;
    name: string;
    contactNumber:string;
    orderType: string;
    paymentMethod: string;
    productDetail: string; //previously Order[] = [];
    totalAmount: string;
  }