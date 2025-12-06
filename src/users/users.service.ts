import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { User } from './types/User';

@Injectable()
export class UsersService {
    private users: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async findOne(id: number): Promise<User> {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }
        return user;
    }
}
