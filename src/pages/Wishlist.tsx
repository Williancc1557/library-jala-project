import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { readingAPI } from "@/lib/api";
import { ArrowLeft, Heart, Trash2, BookOpen } from "lucide-react";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await readingAPI.getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId: string) => {
    try {
      await readingAPI.removeStatus(bookId);
      alert("Removed from wishlist");
      loadWishlist();
    } catch (error) {
      alert("Failed to remove from wishlist");
    }
  };

  const getBookInfo = (item: any) => {
    const book = item.book;
    const volumeInfo = book?.volumeInfo || book;

    // Tratar authors - garantir que seja um array
    let authors = [];
    if (volumeInfo.authors) {
      authors = Array.isArray(volumeInfo.authors)
        ? volumeInfo.authors
        : [volumeInfo.authors];
    } else if (book.authors) {
      try {
        const parsed =
          typeof book.authors === "string"
            ? JSON.parse(book.authors)
            : book.authors;
        authors = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error("Erro ao fazer parse dos autores:", e);
        authors = [book.authors];
      }
    }

    return {
      id: book.googleBooksId || book.id,
      title: volumeInfo.title || book.title || "Unknown Title",
      authors: authors.length > 0 ? authors.join(", ") : "Unknown Author",
      thumbnail:
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail ||
        book.thumbnail ||
        "https://via.placeholder.com/128x192?text=No+Cover",
      description:
        volumeInfo.description ||
        book.description ||
        "No description available",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate("/library")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            My Wishlist
          </h1>
          <div></div>
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add books to your wishlist to keep track of books you want to
                read
              </p>
              <Button onClick={() => navigate("/library")}>
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Library
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {wishlist.length} {wishlist.length === 1 ? "Book" : "Books"}{" "}
                  in Your Wishlist
                </CardTitle>
                <CardDescription>
                  Books you want to read in the future
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => {
                const bookInfo = getBookInfo(item);

                return (
                  <Card
                    key={item.readingStatus.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="p-0">
                      <div
                        className="aspect-[2/3] relative overflow-hidden rounded-t-lg cursor-pointer"
                        onClick={() => navigate(`/book/${bookInfo.id}`)}
                      >
                        <img
                          src={bookInfo.thumbnail}
                          alt={bookInfo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle
                        className="line-clamp-2 text-base mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => navigate(`/book/${bookInfo.id}`)}
                      >
                        {bookInfo.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-1 mb-4">
                        {bookInfo.authors}
                      </CardDescription>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => navigate(`/book/${bookInfo.id}`)}
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleRemove(item.readingStatus.bookId)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {item.readingStatus.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          <p className="line-clamp-2">
                            {item.readingStatus.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-12 py-6 text-center text-sm text-gray-600 bg-white">
        Desenvolvido por Willian Cavalcanti Coelho
      </footer>
    </div>
  );
}
