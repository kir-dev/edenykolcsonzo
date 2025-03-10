import PageContent from "~/components/pageContent/PageContent";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const AboutPage = async () => {
  // eslint-disable-next-line no-void
  void api.pageContent.get.prefetch("ABOUT");
  const session = await getServerAuthSession();

  return <PageContent role={session?.user.role} />;
};

export default AboutPage;
