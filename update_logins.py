with open("src/components/LoginsTab.tsx", "r") as f:
    text = f.read()

# 1. Update interface LoginsTabProps
text = text.replace("interface LoginsTabProps {", "interface LoginsTabProps {\n  lang?: \"pt\" | \"en\";")

# 2. Add lang to destructuring
text = text.replace("export const LoginsTab: React.FC<LoginsTabProps> = ({", "export const LoginsTab: React.FC<LoginsTabProps> = ({\n  lang = \"pt\",")

# 3. Pass lang to UnbundledOAuthBlocks
text = text.replace("<UnbundledOAuthBlocks", "<UnbundledOAuthBlocks lang={lang}")

with open("src/components/LoginsTab.tsx", "w") as f:
    f.write(text)
print("SUCCESS")
