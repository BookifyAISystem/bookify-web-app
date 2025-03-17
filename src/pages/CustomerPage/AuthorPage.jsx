import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAuthors } from "../../services/authorService";
import "./AuthorPage.css";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await getAllAuthors();
        if (data && Array.isArray(data)) {
          setAuthors(data);
        } else {
          console.error("❌ API không trả về mảng tác giả:", data);
          setAuthors([]); 
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách tác giả:", error);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleAuthorClick = (id) => {
    navigate(`/authors/${id}`);
  };

  return (
    <div className="authors-container">
      <h2 className="authors-title">Tác giả</h2>
      {loading ? (
        <p>Đang tải danh sách tác giả...</p>
      ) : authors.length > 0 ? (
        <div className="authors-grid">
          {authors.map((author) => (
            <div 
              key={author.authorId} 
              className="author-card" 
              onClick={() => handleAuthorClick(author.authorId)}
            >
              <img
                src={author.authorImage || "https://via.placeholder.com/150"}
                alt={author.authorName}
                className="author-image"
              />
              <p className="author-name">{author.authorName}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có tác giả nào.</p>
      )}
    </div>
  );
};

export default AuthorsPage;
