import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { Role as RoleEmun } from './role.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async getRoleByName(name: RoleEmun): Promise<Role> {
    return await this.roleRepository.findOne({ name });
  }
}
