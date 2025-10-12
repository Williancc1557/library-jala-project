// Google Books API Types
export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    publishedDate?: string;
    pageCount?: number;
    language?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

// Database Types
export interface Book {
  id: string;
  googleBooksId?: string;
  title: string;
  authors: string; // JSON string
  description?: string;
  thumbnail?: string;
  categories?: string; // JSON string
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  isbn?: string;
  availableCopies: number;
  totalCopies: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  status: "active" | "returned" | "overdue";
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadingStatus {
  id: string;
  userId: string;
  bookId: string;
  status: "reading" | "completed" | "wishlist" | "want-to-read";
  notes?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  status: "pending" | "fulfilled" | "cancelled";
  requestDate: Date;
  fulfilledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface SearchBooksResponse {
  items: GoogleBook[];
  totalItems: number;
}

export interface LoanWithBook {
  loan: Loan;
  book: Book;
}

export interface ReadingStatusWithBook {
  readingStatus: ReadingStatus;
  book: Book;
}

export interface ReservationWithBook {
  reservation: Reservation;
  book: Book;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
  };
}

