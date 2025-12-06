import { Controller } from '@nestjs/common';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { Get, Param } from '@nestjs/common';
import { ParseIntPipe } from './pipe/parse-int.pipe';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class UserController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }
}
