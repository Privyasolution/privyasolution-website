// Admin panel has its own layout — no site header/footer
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
