import { ApplicationRepository } from '../repositories/application.repository';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '../types/application.types';

export class ApplicationService {
  private repository: ApplicationRepository;

  constructor() {
    this.repository = new ApplicationRepository();
  }

  async createApplication(data: CreateApplicationDto): Promise<Application> {
    return this.repository.create(data);
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    return this.repository.findAllByUserId(userId);
  }

  async getApplicationById(id: string, userId: string): Promise<Application> {
    const application = await this.repository.findByIdAndUserId(id, userId);
    
    if (!application) {
      throw new Error('Application not found or you do not have permission to view it');
    }
    
    return application;
  }

  async updateApplication(id: string, userId: string, data: UpdateApplicationDto): Promise<Application> {
    // 1. Verify the application exists AND belongs to the user
    await this.getApplicationById(id, userId); 
    
    // 2. If verification passes, perform the update
    return this.repository.update(id, userId, data);
  }

  async deleteApplication(id: string, userId: string): Promise<Application> {
    // 1. Verify the application exists AND belongs to the user
    await this.getApplicationById(id, userId);
    
    // 2. If verification passes, delete it
    return this.repository.delete(id);
  }
}