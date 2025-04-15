// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-black text-gray-400 px-6 py-6 text-center mt-12">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Auto India Spare Parts. All rights reserved.
        </p>
      </footer>
    );
  }
  