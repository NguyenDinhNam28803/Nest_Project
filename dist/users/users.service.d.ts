import { User } from './types/User';
export declare class UsersService {
    private users;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
}
