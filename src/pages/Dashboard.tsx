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
import { signOut, useSession } from "@/lib/auth";
import { loansAPI, readingAPI } from "@/lib/api";
import { LogOut, User, BookOpen, Heart, Book, Clock } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState({
    activeLoans: 0,
    wishlist: 0,
    currentlyReading: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadStats();
    }
  }, [session]);

  const loadStats = async () => {
    try {
      const [loans, wishlist, reading, completed, overdue] = await Promise.all([
        loansAPI.getMyLoans(),
        readingAPI.getWishlist(),
        readingAPI.getCurrentlyReading(),
        readingAPI.getCompleted(),
        loansAPI.getOverdue(),
      ]);

      setStats({
        activeLoans: loans.length,
        wishlist: wishlist.length,
        currentlyReading: reading.length,
        completed: completed.length,
        overdue: overdue.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <Button onClick={() => navigate("/library")}>
            <Book className="w-4 h-4 mr-2" />
            Browse Library
          </Button>
          <Button variant="outline" onClick={() => navigate("/my-loans")}>
            <BookOpen className="w-4 h-4 mr-2" />
            My Loans
          </Button>
          <Button variant="outline" onClick={() => navigate("/wishlist")}>
            <Heart className="w-4 h-4 mr-2" />
            Wishlist
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Active Loans */}
          <Card className={stats.overdue > 0 ? "border-red-300" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeLoans}</div>
              {stats.overdue > 0 && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {stats.overdue} overdue
                </p>
              )}
            </CardContent>
          </Card>

          {/* Wishlist */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.wishlist}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Books to read
              </p>
            </CardContent>
          </Card>

          {/* Currently Reading */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Book className="w-4 h-4" />
                Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.currentlyReading}</div>
              <p className="text-xs text-muted-foreground mt-1">
                In progress
              </p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Books finished
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Profile
              </CardTitle>
              <CardDescription>Account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-lg">{session.user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg">{session.user?.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome to University Library!</CardTitle>
              <CardDescription>Final Project - JALA</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explore our catalog, borrow books, track your reading
                progress, and manage your wishlist.
              </p>
              <Button
                className="w-full"
                onClick={() => navigate("/library")}
              >
                Start Browsing
              </Button>
            </CardContent>
          </Card>

          {/* Tech Stack Card */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
              <CardDescription>Built with modern stack</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  React + TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Tailwind CSS + shadcn/ui
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Better Auth
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Express + Drizzle ORM
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Google Books API
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Desenvolvido por Willian Cavalcanti Coelho
        </div>
      </main>
    </div>
  );
}
