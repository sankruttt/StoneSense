# Chatbot Setup Instructions

## Setting up OpenRouter API Key

1. Go to https://openrouter.ai/keys and create an account (if you don't have one)
2. Generate a new API key
3. Set the environment variable:

### On macOS/Linux:
```bash
export OPENROUTER_API_KEY="your_api_key_here"
```

### Or add to your shell profile (~/.zshrc or ~/.bashrc):
```bash
echo 'export OPENROUTER_API_KEY="your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

## Running the Application

1. Start Flask backend:
```bash
cd /Users/sankrut/Projects/kidneystone/NH04_SatSan/stone
python3 app.py
```

2. Start React frontend (in a new terminal):
```bash
cd /Users/sankrut/Projects/kidneystone/NH04_SatSan/stone/frontend
npm start
```

## Using the Chatbot

The chatbot appears as a floating button in the bottom-right corner of the screen. Click it to:
- Ask about your scan results
- Get kidney health tips
- Learn about stone prevention
- Ask when to see a doctor
- Get dietary recommendations

The chatbot has context of your uploaded scan results and can answer specific questions about your stones!
