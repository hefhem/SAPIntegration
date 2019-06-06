export class COA {
    COA_ID = 0;
    SAPDocNum: string;
    DocDate: Date;
    CustomerName: string;
    ItemName: string;
    MaterialType: string;
    JobNo: string;
    PD: string;
    EXP: string;
    Quantity: number;
    NoOfRolls: string;
    UOM: string;
    Remarks: string;
    IsApproved: boolean;
    ApprovedBy: string;
    DateApproved: Date;
    IsArchived: boolean;
    ArchivedBy: string;
    DateArchived: Date;
    CreatedBy: string;
    DateCreated: Date;
    ModifiedBy: string;
    DateModified: Date;
}

export class COADetail {
     COADetailID  : number;
     COA_ID : number;
     LineID : number;
     COATypeID : number;
     COATypeName: string;
     Std : string;
     Min : string;
     Max : string;
     Avg : string;
     TestMethod : string;
}

export class COAType {
    COATypeID = 0;
    COATypeName: string;
}

