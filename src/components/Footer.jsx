export default function Footer() {
  return (
    <footer className="bg-white dark:bg-darkBg border-t border-gray-200 dark:border-gray-800 py-6 text-center text-gray-600 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} CodeSphere. Built with ❤️ using React & Cloudflare.</p>
    </footer>
  );
}
