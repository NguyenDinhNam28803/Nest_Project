import { Controller, Get, Param, Query, Post, Put, Body, Delete } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-prodiles.dto';
import { ProfilesService } from './profiles.service';
@Controller('profiles')
export class ProfilesController {

    constructor(private readonly profilesService: ProfilesService) { }

    // Get /profiles
    @Get()
    findAll() {
        return this.profilesService.findAll();
    }

    // Get /profiles?name=John
    @Get('fullname')
    findOneProfile(@Query('name') name: string) {
        return [{ name: name }];
    }

    // Get /profiles/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.profilesService.findOne(id);
    }

    // Post /profiles
    @Post()
    create(@Body() createProfileDto: CreateProfileDto) {
        return {
            name: createProfileDto.name,
            age: createProfileDto.age,
            description: createProfileDto.description
        };
    }

    // Put /profiles/:id
    @Put(':id')
    update(@Param('id') id: string) {
        return `This action updates a #${id} profile`;
    }

    // Delete /profiles/:id
    @Delete(':id')
    remove(@Param('id') id: string) {
        return `This action removes a #${id} profile`;
    }
}
