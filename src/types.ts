export interface StaffMember {
  id: number;
  name: string;
  subject: string;
  office: string;
  department: string;
  class?: string;
  extension: string;
  phone: string;
  status: 'TENURED' | 'ACTIVE' | 'EDITORIAL' | 'ON CAMPUS' | 'EMERITUS' | 'NEW HIRE';
  isVerified: boolean;
}
