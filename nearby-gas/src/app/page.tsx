import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to My Travel App</h1>
      <Link href="/FormPage">Go to Form Page</Link>
    </div>
  );
};

export default HomePage;