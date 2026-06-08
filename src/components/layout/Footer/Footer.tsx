import Link from 'next/link';
import FacebookIcon from '@/assets/icon/icon_facebook.svg';
import InstagramIcon from '@/assets/icon/icon_instagram.svg';
import YoutubeIcon from '@/assets/icon/icon_youtube.svg';
import TwitterIcon from '@/assets/icon/icon_X.svg';

export const Footer = () => {
  return (
    <footer className="border-border-default w-full border-t bg-white py-8 md:py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 md:flex-row md:gap-0">
        {/* Copyright */}
        <div className="text-sm font-normal text-gray-500">©codeit - 2023</div>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm font-normal text-gray-500">
          <Link
            href="/privacy"
            className="hover:text-text-primary font-semibold text-gray-700 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/faq" className="hover:text-text-primary transition-colors">
            FAQ
          </Link>
        </div>

        {/* SNS Icons */}
        <div className="flex items-center gap-5 text-gray-400">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors"
            aria-label="YouTube"
          >
            <YoutubeIcon className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors"
            aria-label="Twitter/X"
          >
            <TwitterIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
