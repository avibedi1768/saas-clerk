"use client";

// import { useUser, SignOutButton } from "@clerk/nextjs";
// import { Todo } from "@prisma/client";
// import React, { useCallback, useEffect, useState } from "react";

// import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { TodoItem } from "@/components/TodoItem";
import { TodoForm } from "@/components/TodoForm";
import { Todo } from "@prisma/client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";

// debounce -> when user is typing, wait for some time (eg: 300ms) before sending the request. usually we send request at every typed word.
import { useDebounceValue } from "usehooks-ts";

function Dashboard() {
  const { user } = useUser();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false); // protect from failures
  const [totalPages, setTotalPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1); // maybe should be 0
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [debounceSearchTerm] = useDebounceValue(searchTerm, 300);

  // const firstName = user?.firstName;

  // change in debounceSearchTerm -> delay 300ms. then send request
  // useCallback -> like useEffect, but it prevents infinite loop
  const fetchTodos = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/todos?page=${page}&search=${debounceSearchTerm}`
        );

        if (!response.ok) {
          // something went wrong. maybe use alert/toast
          throw new Error("failed to fetch todos");
        }

        const data = await response.json();
        setTodos(data.todos);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
    [debounceSearchTerm]
  );

  useEffect(() => {
    fetchTodos(1);
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    const response = await fetch("/api/subscription");
    if (response.ok) {
      const data = await response.json();
      setIsSubscribed(data.isSubscribed);
    }
  };

  const handleAddTodo = async (title: string) => {
    try {
      console.log("inside the trycatch", title);

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      console.log("after the response", title);

      if (!response.ok) {
        console.log("inside the !response.ok");

        throw new Error("failed to add todo");
      }

      // console.log("inside the trycatch", title);

      await fetchTodos(currentPage);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTodo = async (id: string, completed: boolean) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error("failed to update todo");
    }

    await fetchTodos(currentPage);
  };

  const handleDeleteTodo = async (id: string) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("failed to delete todo");
    }

    await fetchTodos(currentPage);
  };

  return (
    // <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
    //   {/* <h1>Dashboard</h1> */}
    //   <h1>Hello {firstName} bhaji</h1>
    //   <div className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-800 transition duration-300 w-fit hover:cursor-pointer">
    //     <SignOutButton />
    //   </div>
    // </div>

    <div className="container mx-auto p-4 max-w-3xl mb-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Welcome, {user?.firstName}!
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm onSubmit={(title) => handleAddTodo(title)} />
        </CardContent>
      </Card>
      {!isSubscribed && todos.length >= 3 && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You&apos;ve reached the maximum number of free todos.{" "}
            <Link href="/subscribe" className="font-medium underline">
              Subscribe now
            </Link>{" "}
            to add more.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Your Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          {isLoading ? (
            <p className="text-center text-muted-foreground">
              Loading your todos...
            </p>
          ) : todos.length === 0 ? (
            <p className="text-center text-muted-foreground">
              You don&apos;t have any todos yet. Add one above!
            </p>
          ) : (
            <>
              <ul className="space-y-4">
                {todos.map((todo: Todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={handleUpdateTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </ul>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchTodos(page)}
              />
            </>
          )}
        </CardContent>
      </Card>

      <CardHeader className="mt-8 bg-blue-400 hover:bg-blue-700 text-white hover:cursor-pointer px-6 py-2 rounded-lg shadow-md transition duration-300 ">
        <SignOutButton />
      </CardHeader>
    </div>
  );
}

export default Dashboard;
