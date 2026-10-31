import Link from "next/link";
export default function NotFound() {
  return (
    <section className="page-hero"><div className="wrap">
      <p className="eyebrow">404</p><h1>Page not found.</h1>
      <p className="lede">The page you&apos;re looking for doesn&apos;t exist. The assistant in the corner can point you in the right direction.</p>
      <Link className="btn btn-primary" href="/">Back to home</Link>
    </div></section>
  );
}
