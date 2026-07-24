import { useEffect } from 'react';

export default function Header({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <title>{title}</title>
    </>
  );
}
