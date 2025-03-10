//import { getServerAuthSession } from "~/server/auth";
import PageContent from "~/components/pageContent/PageContent";
import { api } from "~/trpc/server";

const AboutPage = async () => {
  // eslint-disable-next-line no-void
  void api.pageContent.get.prefetch("ABOUT");

  return <PageContent />;
};

export default AboutPage;
