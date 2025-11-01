import NewsImage from "@/components/ui/NewsImage";
import { useEffect, useState } from "react";

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  author_name?: string;
  created_at?: string;
}
<section>
  <div className="bg-blend-color-dodge"></div>
</section>;
export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    // fetch all approved news
    fetch("http://localhost:5000/api/news/approved")
      .then((res) => res.json())
      .then((data) => setNewsList(data))
      .catch((err) => console.error("Error loading news:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Latest League News</h1>
      {newsList.length === 0 ? (
        <p className="text-center text-gray-600">No news available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
            >
              <NewsImage src={news.image_url} alt={news.title} />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{news.title}</h2>
                <p className="text-gray-700 mt-2">{news.content}</p>
                <div className="mt-4 text-sm text-gray-500 flex justify-between">
                  <span>By: {news.author_name || "Unknown"}</span>
                  <span>
                    {news.created_at ? new Date(news.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
