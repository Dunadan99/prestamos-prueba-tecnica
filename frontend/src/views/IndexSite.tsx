import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function IndexSite() {
  return (
    <>
      <Header />
      <div className='flex flex-row justify-center py-14 px-20'>
        <div className='dashboard'>
          <Outlet />
        </div>
      </div>
    </>
  );
}
