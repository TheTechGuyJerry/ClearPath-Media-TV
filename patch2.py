with open('src/components/common/RichContentRenderer.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "w-full max-w-full min-w-0        text-on-surface",
    "w-full max-w-full min-w-0 break-words\n    text-on-surface"
)
code = code.replace(
    "w-full max-w-full min-w-0\n        text-on-surface",
    "w-full max-w-full min-w-0 break-words\n    text-on-surface"
)

with open('src/components/common/RichContentRenderer.tsx', 'w') as f:
    f.write(code)
