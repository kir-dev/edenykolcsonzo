import ReactMarkdown from "react-markdown";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content?: string;
}

const Markdown = ({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkGemoji]}>
      {content ?? ""}
    </ReactMarkdown>
  );
};

export default Markdown;
