export interface Server {
    id: number;
    name: string;
    server: string;
    description: string;
    image: string;
    category: string;
    channel_server: {
        id: number;
        name: string;
        server: number;
        topic: string;
        owner: number;
    }[];
}
