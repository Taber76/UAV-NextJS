'use client'

import { useRouter } from 'next/navigation'
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { SimpleModal } from '..';

import { useEffect, useState } from 'react'
import { checkJWT } from '../../server/helpers/user.helper';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  useEffect(() => {
    const username = localStorage.getItem('username')
    const tokenString = localStorage.getItem('token')
    const token = tokenString ? JSON.parse(tokenString) : null
    if (username && token) { // arreglar con JWT
      console.log(checkJWT(token))
      //router.push('/main')
    }
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        onOpen()
        throw new Error('Error al obtener los datos');
      }
      const token = await response.json();
      localStorage.setItem('username', formData.username)
      localStorage.setItem('token', JSON.stringify(token.token)) // arreglar con JWT
      router.push('/main')
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOnSubmit = async (e: any) => {
    e.preventDefault()
    if (formData.username === '' || formData.password === '') {
      onOpen()
    }
    fetchData();
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  return (
    <div>
      <SimpleModal isOpen={isOpen} onClose={onClose} title="Error" text="Wrong username or password" />
      <form className='flex flex-col gap-2' onSubmit={handleOnSubmit}>
        <Input
          color='primary'
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <Input
          color='primary'
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button color="primary" variant="bordered" type="submit">Login</Button>
      </form>

    </div>
  )
}

export default LoginForm