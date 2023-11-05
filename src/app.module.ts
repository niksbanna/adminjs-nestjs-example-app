import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { MongooseSchemasModule } from './mongoose/mongoose.module'
import { Admin } from './mongoose/admin-model'
import { Model } from 'mongoose'


import('adminjs').then(({AdminJS}) => {
  import('@adminjs/mongoose').then((AdminJSMongoose) => {
    AdminJS.registerAdapter({
      Resource: AdminJSMongoose.Resource,
      Database: AdminJSMongoose.Database,
    });
  });
});

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    import('@adminjs/nestjs').then(({ AdminModule }) => AdminModule.createAdminAsync({
      imports: [
        MongooseSchemasModule
      ],
      inject: [
        getModelToken('Admin'),
      ],
      useFactory: (adminModel: Model<Admin>) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            { resource: adminModel },
          ],
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secret'
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret'
        },
      }),
    })),
    MongooseSchemasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }