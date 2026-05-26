import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table, CreateTableDto, UpdateTableDto, TableStatus } from '@app/common';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto) {
    const existing = await this.tableRepository.findOneBy({ number: createTableDto.number });
    if (existing) throw new ConflictException(`La mesa número ${createTableDto.number} ya existe`);
    
    const table = this.tableRepository.create(createTableDto);
    return await this.tableRepository.save(table);
  }

  async findAll() {
    return await this.tableRepository.find({
      where: { isActive: true },
      order: { number: 'ASC' },
    });
  }

  async findOne(id: string) {
    const table = await this.tableRepository.findOneBy({ id, isActive: true });
    if (!table) throw new NotFoundException(`Mesa no encontrada`);
    return table;
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    const table = await this.findOne(id);
    Object.assign(table, updateTableDto);
    return await this.tableRepository.save(table);
  }

  async changeStatus(id: string, status: TableStatus) {
    const table = await this.findOne(id);
    table.status = status;
    return await this.tableRepository.save(table);
  }

  async remove(id: string) {
    const table = await this.findOne(id);
    table.isActive = false; // Soft delete
    return await this.tableRepository.save(table);
  }
}