export declare class ProfilesService {
    private profiles;
    findAll(): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        age: number;
        description: string;
    }[];
    findOne(id: string): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        age: number;
        description: string;
    } | undefined;
}
