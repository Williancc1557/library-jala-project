import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { booksAPI } from "@/lib/api";
import { Search, BookOpen, LogOut, Heart, Book } from "lucide-react";
import { signOut } from "@/lib/auth";

export default function Library() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadPopularBooks();
  }, []);

  const loadPopularBooks = async () => {
    try {
      setLoading(true);
      const data = await booksAPI.getPopular(30);
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadPopularBooks();
      return;
    }

    try {
      setSearching(true);
      const data = await booksAPI.search({
        q: searchQuery,
        maxResults: 30,
      });
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getBookThumbnail = (book: any) => {
    return (
      book.volumeInfo?.imageLinks?.thumbnail ||
      book.volumeInfo?.imageLinks?.smallThumbnail ||
      "https://via.placeholder.com/128x192?text=No+Cover"
    );
  };

  const getBookAuthors = (book: any) => {
    return book.volumeInfo?.authors?.join(", ") || "Unknown Author";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  University Library
                </h1>
                <p className="text-sm text-gray-600">
                  Explore and borrow books
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                <Book className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/my-loans")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                My Loans
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/wishlist")}
              >
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={searching}>
                <Search className="w-4 h-4 mr-2" />
                {searching ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </div>
      </header>

      {/* Books Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No books found
            </h3>
            <p className="text-gray-600">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Showing {books.length} books
              {searchQuery && ` for "${searchQuery}"`}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <Card
                  key={book.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
                      <img
                        src={getBookThumbnail(book)}
                        alt={book.volumeInfo?.title || "Book cover"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="line-clamp-2 text-base mb-2">
                      {book.volumeInfo?.title || "Unknown Title"}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {getBookAuthors(book)}
                    </CardDescription>
                    {book.volumeInfo?.publishedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {book.volumeInfo.publishedDate.split("-")[0]}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-gray-600 bg-white">
        Desenvolvido por Willian Cavalcanti Coelho
      </footer>
    </div>
  );
}

