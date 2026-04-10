// ? This is the ApplicationRepository — a clean class that handles all database operations
// ? related to the Application model. It does NOT create any database connection itself.

// ! Important: The real connection to the database does NOT happen in this file.
// ! It happens inside the PrismaClient (the singleton created earlier) only when
// ! you actually run a query for the first time.

// * We import the singleton prisma instance. This is the same single instance used
// * everywhere in the app, which prevents creating too many connection pools.
import { prisma } from '../utils/prisma.js';
import { Application } from '@prisma/client';
import { CreateApplicationDto, UpdateApplicationDto } from '../types/application.types.js';

export class ApplicationRepository {
  async create(data: CreateApplicationDto): Promise<Application> {

    // ? This will use the shared connection pool inside the prisma singleton.
    // ? First time this runs → Prisma will open real connections to the database using DATABASE_URL.
    return prisma.application.create({
      data,
    });
  }

  // * Strictly scoped to the authenticated user
  async findAllByUserId(userId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // * Ensures we only find the app if it belongs to this specific user
  async findByIdAndUserId(id: string, userId: string): Promise<Application | null> {
    return prisma.application.findFirst({
      where: { 
        id,
        userId 
      },
    });
  }

  async update(id: string, userId: string, data: UpdateApplicationDto): Promise<Application> {
    return prisma.application.update({
      where: { 
        id,
        // * Prisma requires a unique identifier for updates, but we also want to ensure ownership.
        // * A safer pattern is to verify ownership in the service layer first, then update by ID.
      },
      data,
    });
  }

  async delete(id: string): Promise<Application> {
    return prisma.application.delete({
      where: { id },
    });
  }
}