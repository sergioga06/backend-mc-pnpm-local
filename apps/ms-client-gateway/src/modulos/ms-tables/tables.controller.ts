import { Controller, Post, Body, Get, Inject, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MS_TABLES } from '../../config/service';
import { CreateTableDto, UpdateTableDto } from '@app/common';

@Controller('gestion/mesas')
export class GatewayTablesController {
  constructor(@Inject(MS_TABLES) private readonly tablesClient: ClientProxy) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesClient.send({ cmd: 'create_table' }, createTableDto);
  }

  @Get()
  findAll() {
    return this.tablesClient.send({ cmd: 'find_all_tables' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesClient.send({ cmd: 'find_one_table' }, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesClient.send({ cmd: 'update_table' }, { id, updateTableDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesClient.send({ cmd: 'remove_table' }, id);
  }
}