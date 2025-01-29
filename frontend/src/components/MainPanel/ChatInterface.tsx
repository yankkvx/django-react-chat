import { useState } from "react";
import { useParams } from "react-router";
import useWebSocket from "react-use-websocket";
import useCrud from "../../hooks/useCrud";
import { Server } from "../../@types/server";

interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

const ChatInterface = () => {
    const [newMessage, setNewMessage] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const { serverId, channelId } = useParams();
    const { fetchData } = useCrud<Server>(
        [],
        `messages/?channel_id=${channelId}`
    );

    const socketUrl = channelId
        ? `ws://127.0.0.1:8000/${serverId}/${channelId}`
        : null;

    const { sendJsonMessage } = useWebSocket(socketUrl, {
        onOpen: async () => {
            try {
                const data = await fetchData();
                setNewMessage([]);
                setNewMessage(Array.isArray(data) ? data : []);
                console.log("Connected");
            } catch (error) {
                console.log(error);
            }
        },
        onClose: () => {
            console.log("Connection closed");
        },
        onError: () => {
            console.log("Error");
        },
        onMessage: (msg) => {
            const data = JSON.parse(msg.data);
            setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
        },
    });

    return (
        <div>
            {newMessage.map((msg: Message, index: number) => {
                return (
                    <div key={index}>
                        <p>{msg.sender}</p>
                        <p>{msg.content}</p>
                    </div>
                );
            })}
            <form>
                <label>Enter message: </label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </form>
            <button
                onClick={() => {
                    sendJsonMessage({ type: "message", message });
                }}
            >
                Send message
            </button>
        </div>
    );
};

export default ChatInterface;
