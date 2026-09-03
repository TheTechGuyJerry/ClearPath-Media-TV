import sys

with open('src/components/common/RichContentRenderer.tsx', 'r') as f:
    code = f.read()

code = code.replace("break-words", "") # clean up any partial

code = code.replace(
    "if (!content || !content.trim()) {",
    "const normalizedContent = content ? content.replace(/&nbsp;/g, ' ').replace(/\\u00A0/g, ' ') : '';\n\n  if (!normalizedContent || !normalizedContent.trim()) {"
)

code = code.replace("DOMPurify.sanitize(content,", "DOMPurify.sanitize(normalizedContent,")
code = code.replace("test(content);", "test(normalizedContent);")

code = code.replace(
    "w-full max-w-full min-w-0\n        text-on-surface",
    "w-full max-w-full min-w-0 break-words\n        text-on-surface"
)

with open('src/components/common/RichContentRenderer.tsx', 'w') as f:
    f.write(code)
