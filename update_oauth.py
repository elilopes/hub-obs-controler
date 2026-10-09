with open("src/components/UnbundledOAuthBlocks.tsx", "r") as f:
    text = f.read()

# 1. Update interface
text = text.replace("interface UnbundledOAuthBlocksProps {", "interface UnbundledOAuthBlocksProps {\n  lang?: \"pt\" | \"en\";")

# 2. Add lang to destructuring (simple replacement)
text = text.replace("  onCrossCopy,", "  onCrossCopy,\n  lang = \"pt\",")

# 3. Translate labels
text = text.replace("Autenticação OAuth2 Oficial", "{lang === 'en' ? 'Official OAuth2 Auth' : 'Autenticação OAuth2 Oficial'}")
text = text.replace("<span>{block.isConnected ? 'CONECTADO (ON)' : 'AGUARDANDO (OFF)'}</span>", 
                    "<span>{block.isConnected ? (lang === 'en' ? 'CONNECTED (ON)' : 'CONECTADO (ON)') : (lang === 'en' ? 'WAITING (OFF)' : 'AGUARDANDO (OFF)')}</span>")

with open("src/components/UnbundledOAuthBlocks.tsx", "w") as f:
    f.write(text)
print("SUCCESS")
