import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { booksAPI, loansAPI, readingAPI } from "@/lib/api";
import { ArrowLeft, BookOpen, Heart, Calendar, FileText } from "lucide-react";

export default function BookDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [readingStatus, setReadingStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBookDetails();
      loadReadingStatus();
    } else {
      setError("ID do livro não encontrado");
      setLoading(false);
    }
  }, [id]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await booksAPI.getById(id!);
      setBook(data);
    } catch (error: any) {
      console.error("Error loading book:", error);
      setError(
        error.response?.data?.error || "Falha ao carregar detalhes do livro"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadReadingStatus = async () => {
    try {
      const status = await readingAPI.getStatus(id!);
      setReadingStatus(status);
    } catch (error) {
      console.error("Error loading reading status:", error);
    }
  };

  const handleBorrow = async () => {
    try {
      setBorrowing(true);

      // First, add to library if not already
      await booksAPI.addToLibrary(id!);

      // Then borrow
      await loansAPI.borrowBook(id!);
      alert("Book borrowed successfully! Due in 14 days.");
      navigate("/my-loans");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to borrow book");
    } finally {
      setBorrowing(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await booksAPI.addToLibrary(id!);
      await readingAPI.updateStatus(id!, { status: "wishlist" });
      alert("Added to wishlist!");
      loadReadingStatus();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Failed to add to wishlist");
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await booksAPI.addToLibrary(id!);
      await readingAPI.updateStatus(id!, {
        status: status as any,
      });
      alert(`Status updated to: ${status}`);
      loadReadingStatus();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getBookInfo = () => {
    if (book?.volumeInfo) {
      return book;
    }
    return book;
  };

  const bookData = getBookInfo();

  if (!loading && !error && !bookData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-orange-600">Debug Mode</CardTitle>
            <CardDescription>
              Componente renderizado mas sem dados. ID: {id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>
                <strong>ID:</strong> {id}
              </p>
              <p>
                <strong>Loading:</strong> {loading ? "true" : "false"}
              </p>
              <p>
                <strong>Error:</strong> {error || "null"}
              </p>
              <p>
                <strong>Book:</strong> {book ? "presente" : "null"}
              </p>
            </div>
            <Button onClick={() => navigate("/library")} className="w-full">
              Voltar para Biblioteca
            </Button>
            <Button
              onClick={() => {
                setLoading(true);
                setError(null);
                loadBookDetails();
              }}
              variant="outline"
              className="w-full"
            >
              Forçar Recarregamento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do livro...</p>
          <p className="mt-2 text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">
              Erro ao carregar livro
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate("/library")} className="w-full">
              Voltar para Biblioteca
            </Button>
            <Button
              onClick={() => {
                setError(null);
                loadBookDetails();
              }}
              variant="outline"
              className="w-full"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Livro não encontrado</CardTitle>
            <CardDescription>
              O livro solicitado não pôde ser encontrado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/library")}>
              Voltar para Biblioteca
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const volumeInfo = bookData.volumeInfo || bookData;
  const thumbnail =
    volumeInfo.imageLinks?.thumbnail ||
    volumeInfo.imageLinks?.smallThumbnail ||
    volumeInfo.thumbnail ||
    "https://via.placeholder.com/400x600?text=No+Cover";

  const title = volumeInfo.title || bookData.title || "Unknown Title";

  // Tratar authors - garantir que seja um array
  let authors = [];
  if (volumeInfo.authors) {
    authors = Array.isArray(volumeInfo.authors)
      ? volumeInfo.authors
      : [volumeInfo.authors];
  } else if (bookData.authors) {
    try {
      const parsed =
        typeof bookData.authors === "string"
          ? JSON.parse(bookData.authors)
          : bookData.authors;
      authors = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error("Erro ao fazer parse dos autores:", e);
      authors = [bookData.authors];
    }
  }

  const description =
    volumeInfo.description ||
    bookData.description ||
    "No description available";

  // Tratar categories - garantir que seja um array
  let categories = [];
  if (volumeInfo.categories) {
    categories = Array.isArray(volumeInfo.categories)
      ? volumeInfo.categories
      : [volumeInfo.categories];
  } else if (bookData.categories) {
    try {
      const parsed =
        typeof bookData.categories === "string"
          ? JSON.parse(bookData.categories)
          : bookData.categories;
      categories = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error("Erro ao fazer parse das categorias:", e);
      categories = [bookData.categories];
    }
  }

  const publishedDate =
    volumeInfo.publishedDate || bookData.publishedDate || "Unknown";
  const pageCount = volumeInfo.pageCount || bookData.pageCount;
  const language = volumeInfo.language || bookData.language || "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/library")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full rounded-lg shadow-lg"
                />

                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full"
                    onClick={handleBorrow}
                    disabled={borrowing}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {borrowing ? "Borrowing..." : "Borrow Book"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAddToWishlist}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Wishlist
                  </Button>
                </div>

                {readingStatus && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Status: {readingStatus.status}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{title}</CardTitle>
                <CardDescription className="text-lg">
                  {authors.length > 0 ? authors.join(", ") : "Unknown Author"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">Description</Label>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Published
                    </Label>
                    <p className="mt-1 text-gray-700">{publishedDate}</p>
                  </div>

                  {pageCount && (
                    <div>
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Pages
                      </Label>
                      <p className="mt-1 text-gray-700">{pageCount}</p>
                    </div>
                  )}

                  <div>
                    <Label>Language</Label>
                    <p className="mt-1 text-gray-700 uppercase">{language}</p>
                  </div>

                  {categories.length > 0 && (
                    <div>
                      <Label>Categories</Label>
                      <p className="mt-1 text-gray-700">
                        {categories.join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Update Reading Status
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={
                        readingStatus?.status === "reading"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleUpdateStatus("reading")}
                    >
                      Reading
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        readingStatus?.status === "completed"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleUpdateStatus("completed")}
                    >
                      Completed
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        readingStatus?.status === "want-to-read"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleUpdateStatus("want-to-read")}
                    >
                      Want to Read
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        readingStatus?.status === "wishlist"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleUpdateStatus("wishlist")}
                    >
                      Wishlist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="mt-12 py-6 text-center text-sm text-gray-600 bg-white">
        Desenvolvido por Willian Cavalcanti Coelho
      </footer>
    </div>
  );
}
