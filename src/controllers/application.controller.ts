import { Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto, UpdateApplicationDto, Application } from '../types/application.types';
import { ApiResult, AuthRequest } from '../types/api.types';

const applicationService = new ApplicationService();

export class ApplicationController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id; 
      
      const data: CreateApplicationDto = {
        ...req.body,
        userId,
        dateApplied: req.body.dateApplied ? new Date(req.body.dateApplied) : new Date(),
      };

      const application: Application = await applicationService.createApplication(data);
      
      const response: ApiResult<Application> = { success: true, data: application, error: null };
      res.status(201).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const response: ApiResult<null> = { success: false, data: null, error: errorMessage };
      res.status(400).json(response);
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const applications: Application[] = await applicationService.getUserApplications(userId);
      
      const response: ApiResult<Application[]> = { success: true, data: applications, error: null };
      res.status(200).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const response: ApiResult<null> = { success: false, data: null, error: errorMessage };
      res.status(400).json(response);
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;   // ✅ Fixed: cast to string
      
      const application: Application = await applicationService.getApplicationById(id, userId);
      
      const response: ApiResult<Application> = { success: true, data: application, error: null };
      res.status(200).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // 404 is appropriate if they don't own it or it doesn't exist
      const response: ApiResult<null> = { success: false, data: null, error: errorMessage };
      res.status(404).json(response);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;   // ✅ Fixed: cast to string
      const updateData: UpdateApplicationDto = req.body;
      
      const application: Application = await applicationService.updateApplication(id, userId, updateData);
      
      const response: ApiResult<Application> = { success: true, data: application, error: null };
      res.status(200).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const response: ApiResult<null> = { success: false, data: null, error: errorMessage };
      res.status(400).json(response);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;   // ✅ Fixed: cast to string
      
      await applicationService.deleteApplication(id, userId);
      
      const response: ApiResult<null> = { success: true, data: null, error: null };
      res.status(200).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const response: ApiResult<null> = { success: false, data: null, error: errorMessage };
      res.status(400).json(response);
    }
  }
}