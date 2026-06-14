import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, Query, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
// 👇 Importamos las herramientas de seguridad
import { CreateProductDto, UpdateProductDto, JwtAuthGuard, RolesGuard, Roles, UserRole } from '@app/common';
import { MS_PRODUCTS } from '../../config/service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('gestion/productos')
@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Bloquea todo el controlador pidiendo Login
export class GatewayProductosController {
  constructor(@Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy) {}

  // 👇 RUTA BLINDADA: Solo el jefe puede subir fotos
  @Post('upload')
  @Roles(UserRole.ADMIN) 
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(process.cwd(), 'uploads');
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `img-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|avif)$/)) {
        return cb(new BadRequestException('Solo se permiten archivos de imagen'), false);
      }
      cb(null, true);
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }
    const fileUrl = `http://localhost:3005/uploads/${file.filename}`;
    return { url: fileUrl };
  }

  // --- RESTO DE RUTAS NORMALES ---

  @Post()
  @Roles(UserRole.ADMIN) // 🛡️ Solo el jefe crea productos
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  // Sin @Roles para que cualquier empleado logueado pueda verlos
  findAll(@Query('includeInactive') includeInactive: string) {
    return this.productsClient.send({ cmd: 'find_all_products' }, includeInactive === 'true');
  }

  @Get('buscar')
  // Sin @Roles para que puedan buscar en el TPV
  search(@Query('q') query: string) {
    return this.productsClient.send({ cmd: 'search_products' }, query);
  }

  @Get('disponibles')
  findAvailable() {
    return this.productsClient.send({ cmd: 'find_available_products' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_product' }, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN) // 🛡️ Solo el jefe edita
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, { id, updateProductDto });
  }

  @Patch(':id/toggle')
  @Roles(UserRole.ADMIN) // 🛡️ Solo el jefe los activa/desactiva
  toggle(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'toggle_product_availability' }, id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // 🛡️ Solo el jefe borra
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_product' }, id);
  }
}