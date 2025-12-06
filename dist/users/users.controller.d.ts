import { UsersService } from './users.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UsersService);
    findAll(): Promise<import("./types/User").User[]>;
    findOne(id: number): Promise<import("./types/User").User>;
}
