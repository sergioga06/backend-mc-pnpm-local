import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from '@app/common';
import { MS_PRODUCTS } from '../../config/service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
@Controller('gestion/productos')
export class GatewayProductosController {
  constructor(@Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy) {}

  // 👇 RUTA BLINDADA: Crea la carpeta si no existe y guarda en la raíz exacta
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(process.cwd(), 'uploads');
        // Magia: Si la carpeta no existe, la crea sola
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
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
  }

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, { id, updateProductDto });
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'toggle_product_availability' }, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_product' }, id);
  }
}