import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'apps/auth/src/roles.decorator';
import { Role } from 'apps/auth/src/role.enum';
import { RolesGuard } from 'apps/auth/src/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  adminOnly() {
    return 'admin area';
  }

  @Get('manager')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER)
  managerOnly() {
    return 'manager area';
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER)
  userOnly() {
    return 'user area';
  }
}
