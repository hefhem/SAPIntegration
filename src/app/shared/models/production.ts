export class ProdMaster {
    ProdMasterID = 0;
    DocEntry = '';
    DocNum = '';
    ItemCode: string;
    ItemName: string;
    KgFactor = 0;
    UOM: string;
    PlannedQty = 0;
    CompletedQty: number;
    TotalQty = 0;
    NoOfRolls = 0;
    MachineNo: string;
    Status: string;
    Warehouse: string;
    CardName: string;
    PackingNo: string;
    ProdDate: Date;
    Supervisor: string;
    IsPosted: boolean;
    PostDate: Date;
    IsApproved: boolean;
    ApprovedBy: string;
    CreatedBy: string;
    DateCreated: Date;
}

export class ProdDetail {
    ProdDetailID: number;
    Line_No: number;
    ProdMasterID: number;
    BatchNo: string;
    Quantity = 0;
    KgQty = 0;
    IsPosted: boolean;
    IsRedressed = 'N';
}

export class SAPCompany {
    SAPCompanyID: number;
    SAPLicenseServerName: string;
    SAPLicenseServerPort: string;
    SAPServerName: string;
    SAPUserName: string;
    SAPUserPassword: string;
    SQLdbName: string;
    SQLUserName: string;
    SQLUserPassword: string;
    SQLServerVersion: string;
}

export class PostToSAP {
    ObjectID: number;
    sapUserName: string;
    sapPassword: string;
}

export class ProductionOrderModel {
    DocEntry: number;
    DocNum: string;
    PostDate: Date;
    CardCode: string;
    CardName: string;
    ItemCode: string;
    ItemName: string;
    PlannedQty: number;
    CompltQty: number;
    MachineNo: string;
  }

  export class GoodsReceiptMaster {
    GoodsReceiptMasterID = 0;
    DocEntry = '';
    DocNum = '';
    ItemCode = '';
    ItemName = '';
    TotalQty = 0;
    MachineNo = '';
    ProdDate: Date;
    Supervisor: '';
    IsPosted = false;
    PostDate: Date;
    PostedBy = '';
    IsApproved = false;
    ApprovedBy = '';
    DateApproved: Date;
    CreatedBy = '';
    DateCreated: Date;
  }
  export class GoodsReceiptDetail {
    GoodsReceiptDetailID = 0;
    Line_No = 0;
    GoodsReceiptMasterID = 0;
    ItemCode = '';
    ItemName = '';
    BatchNo = '';
    Quantity = 0;
    Warehouse = '';
    IsPosted = false;
  }


