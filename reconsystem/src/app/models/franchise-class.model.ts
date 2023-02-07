export class FranchiseClass {
    private id: number;
    private companyName: string;
    private dateRequest: string;
    private addRess: string;

    constructor(id: number, companyName: string, dateRequest: string, addRess: string) {
        this.id = id;
        this.companyName = companyName;
        this.addRess = addRess;
        this.dateRequest = dateRequest;

    }

    getCompanyName(): string {
        return this.companyName;
    }
    getId(): number {
        return this.id;
    }
    getDateRequest() : string {
        return this.dateRequest;
    }
}

export interface franchise {
    rownum: number;
    id: number;
    franchiseCode: string;
    companyName: string;
    dateRequest: string;

    
}

export interface franchiseTransferRequest{
    dateRequest: string;
    companyName: string;
    franchiseCode: string;
    franchisee: string;
    transferStatus: string;
    submittedFile: string;

}

export interface addFranchise{
    rownum: number;
    id: number;
    addRess: string;
    dateRequest: string;
    companyName: string;
}

export interface addFranchiseRequest{
    id: number;
    addRess: string;
    dateRequest: string;
    submittedFile: string;
    created_at: string;
    created_by_user_id : number;
}

