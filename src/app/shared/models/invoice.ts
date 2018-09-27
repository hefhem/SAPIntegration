export class Invoice {
    invoiceMasterID = 0;
    invoiceNumber: string;
    invoiceDate: string;
    customerCode: string;
    customerName: string;
    isCancelled: boolean;
    invoiceTotal = 0;
    schoolTermID: number;
    schoolSessionID: number;
    studentClassID: number;
    discount = 0;
    discountAmount = 0;
    status = 'Open';
    invoiceTotalBeforeDiscount = 0;
    createdByID: number;
}

export class InvoiceDetail {
    invoiceID: number;
    itemID: number;
    itemName: string;
    qty: number;
    unitPrice: number;
    lineTotal = 0;
    createdByID: number;
}

export class InvoiceFull {
    invoiceID = 0;
    invoiceNumber: string;
    invoiceDate: string;
    customerCode: string;
    customerName: string;
    isCancelled: boolean;
    invoiceTotal = 0;
    schoolTermID: number;
    schoolSessionID: number;
    studentClassID: number;
    discount = 0;
    discountAmount = 0;
    status: string;
    invoiceTotalBeforeDiscount = 0;
    createdByID: number;
    invoiceDetails: InvoiceDetail[];
}

export class PriceList {
    priceListID = 0;
    priceDescription = '';
    schoolSessionID: number;
    studentClassID: number;
    schoolTermID: number;
    itemID: number;
    unitPrice: number;
    createdByID: number;
  }

  export class PriceListView {
    priceListID: number;
    priceDescription: string;
    schoolSessionID: number;
    schoolSessionName: string;
    studentClassID: number;
    studentClassName: string;
    schoolTermID: number;
    schoolTermName: string;
    itemID: number;
    itemName: string;
    unitPrice: number;
    createdByID: number;
  }

  export class Item {
      itemID = 0;
      itemName: string;
      createdByID: number;
  }

  export class StudentClass {
      studentClassID = 0;
      studentClassName: string;
      createdByID: number;
  }

  export class SchoolSession {
      schoolSessionID = 0;
      isActive: string;
      schoolSessionName: string;
      createdByID: number;
  }

  export class SchoolTerm {
      schoolTermID = 0;
      schoolTermName: string;
      createdByID: number;
  }
