import Image from "next/image";

import './styles.css';
import { LoginForm } from "../components";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className='fullFormContainer'>
        <div className='imageAndFormContainer'>
          <div className='half'>
            <Image
              className='logo'
              src='/flying-wing.svg'
              alt='logo'
              width={200}
              height={200}
            />
          </div>
          <hr className='hrFullForm' />
          <div className='half'>
            <div className='formAndH1container'>
              <h1 className='h1FullForm'>WELCOME</h1>
              <LoginForm />
              <h4 className='h4FullForm'>Don`t have an account? <a href='/signup' className='link'>Sign Up</a></h4>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
