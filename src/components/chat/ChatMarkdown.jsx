import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Kept in its own module so markdown and KaTeX load only when the chat panel opens.
// react-markdown drops raw HTML by default, so bot output cannot inject markup.
const components = {
  // eslint-disable-next-line no-unused-vars -- node is the mdast object and must not reach the DOM
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

const ChatMarkdown = ({ children }) => (
  <div
    className="space-y-2 break-words
      [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_h4]:font-semibold
      [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm
      [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mt-1
      [&_a]:underline [&_code]:font-mono [&_code]:text-xs
      [&_pre]:overflow-x-auto [&_pre]:bg-white/60 [&_pre]:p-2 [&_pre]:rounded
      [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1"
  >
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
      {children}
    </ReactMarkdown>
  </div>
);

export default ChatMarkdown;
