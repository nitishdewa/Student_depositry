interface SpinnerProps {
  dark?: boolean;
}

export default function Spinner({ dark = false }: SpinnerProps) {
  return <span className={`spinner ${dark ? 'spinner-dark' : ''}`} />;
}