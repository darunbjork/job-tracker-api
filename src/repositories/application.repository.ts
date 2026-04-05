// ? This is the ApplicationRepository — a clean class that handles all database operations
// ? related to the Application model. It does NOT create any database connection itself.

// ! Important: The real connection to the database does NOT happen in this file.
// ! It happens inside the PrismaClient (the singleton created earlier) only when
// ! you actually run a query for the first time.

// * We import the singleton prisma instance. This is the same single instance used
// * everywhere in the app, which prevents creating too many connection pools.
import { prisma } from '../utils/prisma';
import { Application } from '@prisma/client';
import { CreateApplicationDto, UpdateApplicationDto } from '../types/application.types';

export class ApplicationRepository {

  async create(data: CreateApplicationDto): Promise<Application> {
    // ? This will use the shared connection pool inside the prisma singleton.
    // ? First time this runs → Prisma will open real connections to the database using DATABASE_URL.
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