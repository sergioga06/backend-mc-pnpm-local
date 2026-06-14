import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, Query, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto, Roles, UserRole } from '@app/common';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard'; 
import { RolesGuard } from '@app/common/guards/roles.guard';
import { MS_PRODUCTS } from '../../config/service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('gestion/productos')
// ❌ ATENCIÓN: Eliminado el @UseGuards global de aquí para no bloquear el kiosko
export class GatewayProductosController {
  constructor(@Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy) {}

  // 👇 PROTEGIDO: Solo el ADMIN puede subir fotos
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  // 👇 PROTEGIDO: Solo el ADMIN crea productos
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  // =================================================================
  // 🟢 MÉTODOS PÚBLICOS PARA EL KIOSKO Y CLIENTES (SIN GUARDS)
  // =================================================================

  @Get()
  findAll(@Query('includeInactive') includeInactive: string) {
    return this.productsClient.send({ cmd: 'find_all_products' }, includeInactive === 'true');
  }

  @Get('buscar')
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

  // =================================================================
  // 🔴 MÉTODOS DE ESCRITURA PROTEGIDOS
  // =================================================================

  // 👇 PROTEGIDO: Solo el ADMIN edita
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, { id, updateProductDto });
  }

  // 👇 PROTEGIDO: Solo el ADMIN los activa/desactiva
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  toggle(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'toggle_product_availability' }, id);
  }

  // 👇 PROTEGIDO: Solo el ADMIN borra
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_product' }, id);
  }
}