import { prisma } from '../utils/prisma';
import { Application, Prisma } from '@prisma/client';
import { CreateApplicationDto, UpdateApplicationDto } from '../types/application.types';

export class ApplicationRepository {
  async create(data: CreateApplicationDto): Promise<Application> {
    return prisma.application.create({
      data,
    });
  }

  async findAll(): Promise<Application[]> {
    return prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Application | null> {
    return prisma.application.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateApplicationDto): Promise<Application> {
    return prisma.application.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Application> {
    return prisma.application.delete({
      where: { id },
    });
  }
}