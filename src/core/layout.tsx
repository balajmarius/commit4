import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Typography } from "@/ui/typography";

export type LayoutProps = {
  children: ReactNode;
};

const links = {
  url1: "https://github.blog/open-source/gaming/game-off-2017-winners/",
  url2: "https://github.com/balajmarius/commit4",
} as const;

export const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();

  const renderers = {
    version: <span className="text-blue-200" />,
    url: (
      <a
        href={links.url1}
        className="whitespace-nowrap text-blue-200 underline decoration-blue-200/30 underline-offset-4 hover:decoration-blue-200"
      />
    ),
  };

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-12 py-16 text-blue-100 antialiased">
      <header className="sticky top-36 col-span-5 flex max-w-104 flex-col gap-4 self-start">
        <Typography variant="h1">
          <Trans t={t} i18nKey="project.title" components={renderers} />
        </Typography>
        <Typography>
          <Trans t={t} i18nKey="project.description" components={renderers} />
        </Typography>
        <Typography>{t("project.controls")}</Typography>
      </header>

      <div className="col-span-7">{children}</div>
    </main>
  );
};
