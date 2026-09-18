import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Typography } from "@/ui/typography";

export type LayoutProps = {
  children: ReactNode;
};

const links = {
  url1: "https://github.blog/open-source/gaming/game-off-2017-winners/",
} as const;

export const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();

  const renderers = {
    version: <span className="text-blue-200" />,
    url: (
      <a
        href={links.url1}
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap text-blue-200 underline decoration-blue-200/30 underline-offset-4 hover:decoration-blue-200"
      />
    ),
  };

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 text-blue-100 antialiased sm:px-12 sm:py-16 xl:grid-cols-12">
      <header className="mx-auto flex w-full max-w-104 flex-col gap-4 self-start xl:sticky xl:top-36 xl:col-span-5 xl:mx-0">
        <Typography variant="h1">
          <Trans t={t} i18nKey="project.title" components={renderers} />
        </Typography>
        <Typography>
          <Trans t={t} i18nKey="project.description" components={renderers} />
        </Typography>
        <Typography>{t("project.controls")}</Typography>
      </header>

      <div className="xl:col-span-7">{children}</div>
    </main>
  );
};
