export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        About CodeSphere
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          <strong>CodeSphere</strong> is a blog dedicated to helping developers learn and grow.
          We publish practical coding tutorials, web development guides, and programming resources
          for developers of all skill levels.
        </p>

        <p>
          Our mission is to make complex programming concepts easy to understand through
          real‑world examples and hands‑on projects.
        </p>

        <h2>What You'll Find Here</h2>
        <ul>
          <li>In‑depth tutorials on modern web technologies</li>
          <li>Best practices and coding tips</li>
          <li>Project‑based learning</li>
          <li>Community discussion and feedback</li>
        </ul>

        <h2>Tech Stack</h2>
        <p>
          CodeSphere is built with <strong>React</strong>, <strong>Vite</strong>,
          <strong>Tailwind CSS</strong>, and powered by <strong>Cloudflare Workers</strong>
          &amp; <strong>D1</strong> database.
        </p>
        <p>
          We believe in clean code, beautiful design, and a great developer experience.
        </p>

        <h2>Contact</h2>
        <p>
          Have questions or suggestions? Reach out to us at{' '}
          <a
            href="mailto:hello@codesphere.dev"
            className="text-primary hover:underline"
          >
            hello@codesphere.dev
          </a>
        </p>
      </div>
    </div>
  );
}
