import Image from "next/image";

interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoClassName?: string;
  title?: string;
}

export default function Header({
  logoSrc = "/test.png",
  logoAlt = "KlarParat Logo",
  logoWidth = 32,
  logoHeight = 32,
  logoClassName = "h-7 w-auto",
  title = "KlarParat",
}: HeaderProps) {
  return (
    <header className="p-4 bg-white border-b flex flex-col items-center">
      <div className="flex flex-row items-center gap-2">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className={logoClassName}
          priority
        />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
    </header>
  );
} 