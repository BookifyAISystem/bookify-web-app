import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuthorById } from "../../services/authorService";
import "./AuthorDetailPage.css";

const AuthorDetailPage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await getAuthorById(id);
        setAuthor(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tác giả:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (!author) return <p>Không tìm thấy tác giả!</p>;

  return (
    <div className="author-detail-container">
      <div className="author-detail">
        <img
          src={author.authorImage || "https://via.placeholder.com/150"}
          alt={author.authorName}
          className="author-detail-image"
        />
        <div className="author-info">
          <h2 className="author-name">{author.authorName}</h2>
          <p className="author-content">{author.content}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetailPage;
