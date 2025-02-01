export interface Server {
    id: number;
    name: string;
    server: string;
    description: string;
    image: string;
    category: string;
    server_channel: {
        id: number;
        name: string;
        server: number;
        topic: string;
        owner: number;
    }[];
}
