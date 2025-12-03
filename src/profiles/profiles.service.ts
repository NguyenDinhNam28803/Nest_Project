import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class ProfilesService {
    private profiles = [
        {
            id: randomUUID(),
            name: 'John',
            age: 30,
            description: 'John is a developer'
        },
        {
            id: randomUUID(),
            name: 'Jane',
            age: 25,
            description: 'Jane is a designer'
        }
    ];

    findAll() {
        return this.profiles;
    }
}
