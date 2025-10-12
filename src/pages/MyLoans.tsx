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
import { loansAPI } from "@/lib/api";
import { ArrowLeft, BookOpen, Calendar, AlertCircle } from "lucide-react";

export default function MyLoans() {
  const navigate = useNavigate();
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [overdueLoans, setOverdueLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningLoanId, setReturningLoanId] = useState<string | null>(null);

  useEffect(() => {
    loadLoansData();
  }, []);

  const loadLoansData = async () => {
    try {
      setLoading(true);
      const [active, past, overdue] = await Promise.all([
        loansAPI.getMyLoans(),
        loansAPI.getHistory(),
        loansAPI.getOverdue(),
      ]);

      setActiveLoans(active);
      setHistory(past);
      setOverdueLoans(overdue);
    } catch (error) {
      console.error("Error loading loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: string) => {
    try {
      setReturningLoanId(loanId);
      await loansAPI.returnBook(loanId);
      alert("Book returned successfully!");
      loadLoansData();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to return book");
    } finally {
      setReturningLoanId(null);
    }
  };

  const formatDate = (date: string | number) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDue = (dueDate: string | number) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
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
      title: volumeInfo.title || book.title || "Unknown Title",
      authors: authors.length > 0 ? authors.join(", ") : "Unknown Author",
      thumbnail:
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail ||
        book.thumbnail ||
        "https://via.placeholder.com/128x192?text=No+Cover",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading loans...</p>
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
          <h1 className="text-3xl font-bold">My Loans</h1>
          <div></div>
        </div>

        {/* Overdue Loans */}
        {overdueLoans.length > 0 && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                Overdue Loans ({overdueLoans.length})
              </CardTitle>
              <CardDescription className="text-red-600">
                Please return these books as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueLoans.map((item) => {
                  const bookInfo = getBookInfo(item);
                  const daysOverdue = Math.abs(
                    getDaysUntilDue(item.loan.dueDate)
                  );

                  return (
                    <div
                      key={item.loan.id}
                      className="flex gap-4 p-4 bg-white rounded-lg"
                    >
                      <img
                        src={bookInfo.thumbnail}
                        alt={bookInfo.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{bookInfo.title}</h3>
                        <p className="text-sm text-gray-600">
                          {bookInfo.authors}
                        </p>
                        <p className="text-sm text-red-600 mt-1 font-medium">
                          {daysOverdue} days overdue
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleReturn(item.loan.id)}
                        disabled={returningLoanId === item.loan.id}
                      >
                        {returningLoanId === item.loan.id
                          ? "Returning..."
                          : "Return Now"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Loans */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Active Loans ({activeLoans.length})
            </CardTitle>
            <CardDescription>Books you currently have borrowed</CardDescription>
          </CardHeader>
          <CardContent>
            {activeLoans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>You don't have any active loans</p>
                <Button className="mt-4" onClick={() => navigate("/library")}>
                  Browse Library
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeLoans.map((item) => {
                  const bookInfo = getBookInfo(item);
                  const daysUntilDue = getDaysUntilDue(item.loan.dueDate);
                  const isAlmostDue = daysUntilDue <= 3 && daysUntilDue > 0;

                  return (
                    <div
                      key={item.loan.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <img
                        src={bookInfo.thumbnail}
                        alt={bookInfo.title}
                        className="w-16 h-24 object-cover rounded cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/book/${item.book.googleBooksId || item.book.id}`
                          )
                        }
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{bookInfo.title}</h3>
                        <p className="text-sm text-gray-600">
                          {bookInfo.authors}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Borrowed: {formatDate(item.loan.loanDate)}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-1 ${
                              isAlmostDue ? "text-orange-600 font-medium" : ""
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDate(item.loan.dueDate)}</span>
                            {isAlmostDue && <span>(Due soon!)</span>}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleReturn(item.loan.id)}
                        disabled={returningLoanId === item.loan.id}
                      >
                        {returningLoanId === item.loan.id
                          ? "Returning..."
                          : "Return"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loan History */}
        <Card>
          <CardHeader>
            <CardTitle>Loan History</CardTitle>
            <CardDescription>Your complete borrowing history</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No loan history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 10).map((item) => {
                  const bookInfo = getBookInfo(item);
                  const statusColor =
                    item.loan.status === "returned"
                      ? "text-green-600"
                      : item.loan.status === "overdue"
                      ? "text-red-600"
                      : "text-blue-600";

                  return (
                    <div
                      key={item.loan.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={bookInfo.thumbnail}
                        alt={bookInfo.title}
                        className="w-12 h-18 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {bookInfo.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {bookInfo.authors}
                        </p>
                        <div className="mt-1 flex gap-3 text-xs text-gray-500">
                          <span>{formatDate(item.loan.loanDate)}</span>
                          <span className={`font-medium ${statusColor}`}>
                            {item.loan.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="mt-12 py-6 text-center text-sm text-gray-600 bg-white">
        Desenvolvido por Willian Cavalcanti Coelho
      </footer>
    </div>
  );
}
