export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string;
  status: "Bookmarked" | "Applied" | "Interview" | "Offer" | "Rejected";
  dateApplied: Date;
  contactName: string | null;
  contactLinkedIn: string | null;
  notes: string | null;
  followUpDate: Date | null;
  salaryRange: string | null;
  matchScore: number; // 1-10
  createdAt: Date;
  updatedAt: Date;
}

// ! Pick — Select only specific properties
export type CreateApplicationDto = Pick<Application, "companyName" | "jobTitle" | "jobUrl" | "status" | "matchScore">; 
// ? Omit — Remove specific properties. || Removes only "id" and "createdAt"
export type UpdateApplicationDto = Partial<Omit<Application, "id" | "createdAt">>; 
// * Partial — Make all properties optional