// Mock data for the Firm Users -> Clients CRUD table (DashboardView only)

export type ClientRight = "Full" | "Read";

export type FirmClient = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  rights: ClientRight;
  createdAt: string;
};

export const mockFirmClients: FirmClient[] = [
  {
    id: "CL-10001",
    name: "Apex Trading LLC",
    email: "admin@apextrading.com",
    role: "Firm Admin",
    status: "Active",
    rights: "Full",
    createdAt: "2026-01-12",
  },
  {
    id: "CL-10002",
    name: "Northwind Retail Group",
    email: "ops@northwindretail.com",
    role: "Client Admin",
    status: "Active",
    rights: "Full",
    createdAt: "2026-01-18",
  },
  {
    id: "CL-10003",
    name: "BluePeak Consulting",
    email: "team@bluepeak.co",
    role: "Client User",
    status: "Invited",
    rights: "Read",
    createdAt: "2026-02-01",
  },
  {
    id: "CL-10004",
    name: "Cedar & Stone Partners",
    email: "finance@cedarstone.com",
    role: "Client Admin",
    status: "Active",
    rights: "Full",
    createdAt: "2026-02-09",
  },
  {
    id: "CL-10005",
    name: "Evergreen Logistics",
    email: "admin@evergreenlogistics.com",
    role: "Firm Admin",
    status: "Active",
    rights: "Full",
    createdAt: "2026-02-14",
  },
  {
    id: "CL-10006",
    name: "Skyline Manufacturing",
    email: "it@skylinemfg.com",
    role: "Client User",
    status: "Suspended",
    rights: "Read",
    createdAt: "2026-03-02",
  },
  {
    id: "CL-10007",
    name: "Golden Gate Ventures",
    email: "admin@goldengate.vc",
    role: "Client Admin",
    status: "Active",
    rights: "Full",
    createdAt: "2026-03-11",
  },
  {
    id: "CL-10008",
    name: "Horizon Health Systems",
    email: "security@horizonhealth.io",
    role: "Client User",
    status: "Active",
    rights: "Read",
    createdAt: "2026-03-20",
  },
  {
    id: "CL-10009",
    name: "Pinecrest Education Trust",
    email: "admin@pinecrest.edu",
    role: "Firm Admin",
    status: "Invited",
    rights: "Full",
    createdAt: "2026-04-03",
  },
  {
    id: "CL-10010",
    name: "Redwood Payments",
    email: "ops@redwoodpayments.com",
    role: "Client Admin",
    status: "Active",
    rights: "Full",
    createdAt: "2026-04-19",
  },
];
