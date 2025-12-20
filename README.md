# Impact Analysis Agent

AI-powered tool that analyzes GitHub repositories and generates comprehensive tech stack recommendations.

## Features

- 📊 Repository analysis and language detection
- 🏗️ Architecture document processing (PDF, DOC, DOCX, TXT)
- 🤖 AI-powered tech stack recommendations
- 📋 Alternative technology suggestions
- 🗄️ Database schema design
- 🔗 API endpoint recommendations
- 📥 Multiple download formats (TXT, PDF, DOCX, JSON)

## Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/MeghanaMedari/-impact-analysis-.git
cd -impact-analysis-
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your OpenAI API key
```

4. **Run the application**
```bash
python impact_agent.py
```

Visit `http://localhost:8090` to use the application.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | Your OpenAI API key | Required |
| `MODEL` | AI model to use | `gpt-3.5-turbo` |
| `PORT` | Server port | `dynamic` |
| `HOST` | Server host | `0.0.0.0` |

## Deployment

### Render Deployment

1. **Fork this repository**
2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
3. **Configure settings**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python impact_agent.py`
4. **Set environment variables** in Render dashboard
5. **Deploy**

### Docker Deployment

```bash
docker build -t impact-analysis .
docker run -p 8000:8000 --env-file .env impact-analysis
```

## Usage

1. **Enter GitHub repository URL**
2. **Upload architecture document** (PDF, DOC, DOCX, or TXT)
3. **Optionally upload PRD document**
4. **Click "Analyze Project"**
5. **Download results** in your preferred format

## API Endpoints

- `GET /` - Web interface
- `POST /upload-file` - File upload
- `POST /analyze` - Project analysis
- `GET /download/{id}/{type}/{format}` - Download results

## Tech Stack

- **Backend**: FastAPI, Python 3.11+
- **AI**: OpenAI GPT models
- **File Processing**: PyPDF2, python-docx, reportlab
- **Deployment**: Docker, Render

## License

MIT License