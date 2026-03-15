import "@/styles/components/Comments.css";
import { useState, useEffect } from "react";
import { useCommentsStore } from "@/features/comments/comments.store";
import { Comment } from "@/features/comments/components/Comment";
import { Send } from "lucide-react";
import {useParams} from "react-router-dom";
import {useAuthStore} from "@/features/auth/auth.store";

export default function CommentsSection() {
    const { user } = useAuthStore();
    const { fanficId, chapterId } = useParams();
    const { commentsByChapter, fetchComments, addComment, removeComment } = useCommentsStore();
    const [content, setContent] = useState("");

    const isLoggedIn = !!user;

    useEffect(() => {
        if (fanficId && chapterId) {
            fetchComments(fanficId, chapterId);
        }
    }, [fanficId, chapterId, fetchComments]);

    const handleCreate = async () => {
        if (!content.trim()) return;
        await addComment(fanficId, chapterId, { content });
        setContent("");
    };

    const handleDelete = async (commentId) => {
        await removeComment(fanficId, chapterId, commentId)
    };

    const comments = commentsByChapter[chapterId]?.items || [];
    console.log(comments);
    return (
        <div className="comment-section">
            <h3>Коментарі</h3>

            <div className="comment-creation">
                <input
                    type="text"
                    disabled={!isLoggedIn}
                    placeholder={!isLoggedIn ? "Увійдіть, щоб писати коментарі" : "Напишіть коментар..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleCreate();
                        }
                    }}
                />
                <Send className="icon" onClick={handleCreate} />
            </div>

            <div className="comment-list">
                {comments.map((comment) => (
                    <Comment key={comment.id} {...comment} onDelete={handleDelete} isMe={isLoggedIn && user.id === comment.user_id}/>
                ))}
            </div>
        </div>
    );
}