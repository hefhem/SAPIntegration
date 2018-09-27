export class DeliveryMaster {
    DeliveryMasterID = 0;
    CardCode = '';
    CardName = '';
    DocDate: Date;
    SOrderNo = '';
    SDocEntry = '';
    IsApproved = false;
    ApprovedBy = '';
    IsPosted = false;
    PostDate: Date;
    CreatedBy = '';
    DateCreated = '';
}
export class DeliveryDetail {
    DeliveryDetailID = 0;
    DeliveryMasterID = 0;
    LineNum = 0;
    ItemNo = '';
    ItemName = '';
    Quantity = 0;
    OpenQty = 0;
    SelectedQty = 0;
    UnitPrice = 0;
    Total = 0;
    IsPicked = false;
}
export class DeliveryPacking {
    DeliveryPackingID = 0;
    DeliveryDetailID = 0;
    ItemName = '';
    PackingNo = '';
    Quantity = 0;
}
export class DeliveryData {
    deliveryMaster = new DeliveryMaster;
    deliveryDetailsPackings: DeliveryDetailsPackings[] = [];
}
export class DeliveryDetailsPackings {
    deliveryDetail = new DeliveryDetail;
    deliveryPacking: DeliveryPacking[] = [];
}
export class PostDelivery {
    ObjectID: number;
    sapUserName: string;
    sapPassword: string;
}
export class SalesOrderMaster {
    DocEntry: 0;
    DocNum: '';
    CardCode: '';
    CardName: '';
}
export class SalesOrderDetail {
    LineNo: 0;
    ItemCode: '';
    ItemName: '';
    Quantity: 0;
    UnitPrice: 0;
    LineTotal: 0;
}

