import { Trash } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";
import {Link, useNavigate} from "react-router-dom";

export const Comment = ({ id, avatar_url, username, content, onDelete, isMe }) => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isLoggedIn = !!user;



    return (
        <article className="comment">

            <div className="comment-header">
                <img src={"http://localhost:5000"+avatar_url} alt={username}/>
                <span onClick={() => navigate(`/profile/${username}`)}>{username}</span>
                {isMe && (
                    <Trash
                        className="icon"
                        title="Видалити коментар"
                        onClick={() => onDelete(id)}
                    />
                )}
            </div>

            <p>
                {content}
            </p>
        </article>
    );
};