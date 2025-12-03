import { CreateProfileDto } from './dto/create-prodiles.dto';
import { ProfilesService } from './profiles.service';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    findAll(): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        age: number;
        description: string;
    }[];
    findOneProfile(name: string): {
        name: string;
    }[];
    findOne(id: string): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        age: number;
        description: string;
    } | undefined;
    create(createProfileDto: CreateProfileDto): {
        name: string;
        age: number;
        description: string;
    };
    update(id: string): string;
    remove(id: string): string;
}
