import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UnitsModule } from './units/units.module';
import { TasksModule } from './tasks/tasks.module';
import { TemplatesModule } from './templates/templates.module';
import { StreaksModule } from './streaks/streaks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    UnitsModule,
    TasksModule,
    TemplatesModule,
    StreaksModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
