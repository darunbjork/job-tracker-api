import { Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto, UpdateApplicationDto, Application } from '../types/application.types';
import { ApiResult, AuthRequest } from '../types/api.types';
import { catchAsync } from '../utils/catchAsync';

const applicationService = new ApplicationService();

export class ApplicationController {
  
  create = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id; 
    const data: CreateApplicationDto = {
      ...req.body,
      userId,
      dateApplied: req.body.dateApplied ? new Date(req.body.dateApplied) : new Date(),
    };

    const application = await applicationService.createApplication(data);
    const response: ApiResult<Application> = { success: true, data: application, error: null };
    res.status(201).json(response);
  });

  getAll = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const applications = await applicationService.getUserApplications(userId);
    const response: ApiResult<Application[]> = { success: true, data: applications, error: null };
    res.status(200).json(response);
  });

  getById = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;
    
    const application = await applicationService.getApplicationById(id, userId);
    const response: ApiResult<Application> = { success: true, data: application, error: null };
    res.status(200).json(response);
  });

  update = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const updateData: UpdateApplicationDto = req.body;
    
    const application = await applicationService.updateApplication(id, userId, updateData);
    const response: ApiResult<Application> = { success: true, data: application, error: null };
    res.status(200).json(response);
  });

  delete = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;
    
    await applicationService.deleteApplication(id, userId);
    const response: ApiResult<null> = { success: true, data: null, error: null };
    res.status(200).json(response);
  });
}