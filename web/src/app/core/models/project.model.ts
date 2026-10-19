export interface Project {
  id: number;
  name: string;
  description: string;
  createdByUserId: number;
  createdAt: string;
}
export interface CreateProject {
  name: string;
  description: string;
}
export interface UpdateProject {
  name: string;
  description: string;
}
