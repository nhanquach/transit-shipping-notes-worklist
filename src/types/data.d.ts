interface Operation {
    code: string;
    name: string;
    description: null | string;
    status: string;
}

interface OfficeType {
    code: string;
    name: string;
    description: null | string;
    status: string;
}

interface Office {
    code: string;
    name: string;
    description: null | string;
    status: null | string;
    communicationReference: string;
    officeTypes: OfficeType[];
}

interface ContentItem {
    id: string;
    reference: string;
    operation: Operation;
    principal: string;
    principalName: string;
    status: string;
    officeDeparture: Office;
    officeDestination: Office;
    createdDate: string;
    submittedDate: string;
    departureDateTime: string;
    estimatedArrivalDate: string;
    facilityCode: null | string;
    facilityBillReference: null | string;
    requests: any[];
    pinned: boolean;
    isInvoiceGenerated: boolean;
}

interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

interface Data {
    content: ContentItem[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export {
    Data,
    ContentItem,
    Operation,
    OfficeType,
    Office,
    Sort,
    Pageable,
};
