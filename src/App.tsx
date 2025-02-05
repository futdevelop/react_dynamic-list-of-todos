/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState<number>();
  const [todo, setTodo] = useState<Todo>();
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');

  const handleSelectStatus = (status: string = 'all') => {
    setStatus(status);
  };

  const fetchTodos = (status?: string, query?: string) => {
    getTodos(status, query)
      .then(todos => setTodos(todos))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTodos(status, query);
  }, [query]);

  useEffect(() => fetchTodos(status, query), [status]);

  const close = () => setOpenModal(false);

  const open = (todo: Todo, userId: number) => {
    setUserId(userId);
    setTodo(todo);
    setOpenModal(true);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                handleSelectStatus={handleSelectStatus}
                fetchTodos={fetchTodos}
                setQuery={setQuery}
                query={query}
              />
            </div>

            <div className="block">
              {loading ? (
                <Loader />
              ) : (
                <TodoList
                  modalOpened={openModal}
                  todos={todos}
                  openModal={open}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <TodoModal closeModal={close} userId={userId} todo={todo} />
      )}
    </>
  );
};
