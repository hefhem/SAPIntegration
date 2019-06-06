export class UserRole {
    UserRoleID: number;
    UserName: string;
    IsAdmin: string;
    ApprovePR: string;
    ApproveDV: string;
    ApproveGR: string;
    ApproveCOA: string;
    ViewPR: string;
    ViewDV: string;
    ViewGR: string;
    ViewCOA: string;
    Password: string;
}
export class ClsTokenResponse {
    IsSuccess: boolean;
    Id: number;
    Message: string;
    UserName: string;
    Token: string;
    ResetPassword: boolean;
    IsAdmin: boolean;
}
