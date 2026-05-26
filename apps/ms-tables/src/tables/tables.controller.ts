import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TablesService } from './tables.service';
import { CreateTableDto, UpdateTableDto, TableStatus } from '@app/common';

@Controller()
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @MessagePattern({ cmd: 'create_table' })
  create(@Payload() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @MessagePattern({ cmd: 'find_all_tables' })
  findAll() {
    return this.tablesService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_table' })
  findOne(@Payload() id: string) {
    return this.tablesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_table' })
  update(@Payload() data: { id: string; updateTableDto: UpdateTableDto }) {
    return this.tablesService.update(data.id, data.updateTableDto);
  }

  @MessagePattern({ cmd: 'change_table_status' })
  changeStatus(@Payload() data: { id: string; status: TableStatus }) {
    return this.tablesService.changeStatus(data.id, data.status);
  }

  @MessagePattern({ cmd: 'remove_table' })
  remove(@Payload() id: string) {
    return this.tablesService.remove(id);
  }
}