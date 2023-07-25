import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { GET_ME } from '../utils/queries';
import {useQuery} from '@apollo/client';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useMutation } from '@apollo/client';
import {REMOVE_BOOK} from '../utils/mutations';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);

  const [deleteBook, { error }] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({
        variables: {bookId: bookId}
      });
    
      removeBookId(bookId);
      document.getElementById(bookId).remove();
      let countE1 = document.getElementById('book-count');
      let currentNum = parseInt(countE1.innerText.split(' ')[1]);
      if (currentNum === 1) {
        return (countE1.innerText = 'You have 0 saved books!');
      }else{
        countE1.innerText = `Viewing ${currentNum - 1} saved books! ${
          currentNum - 1 === 1 ? 'book' : 'books'
        }`;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <h2>LOADING...</h2>
  }


  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
