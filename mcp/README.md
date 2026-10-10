# 🤖 Rarity USA - Custom MCP Server & AI Telemetry Bridge

Esse servidor MCP (**Model Context Protocol**) conecta **Claude Desktop**, **Cursor IDE**, e **ChatGPT (Custom GPT Actions)** diretamente aos dados em tempo real de telemetria, conversão e atribuição das landing pages da **Rarity USA** (`https://ecom.rarityagency.io`).

---

## ⚡ 1. Ferramentas Disponíveis para a IA (MCP Tools)

| Nome da Tool | Descrição |
| :--- | :--- |
| `get_analytics_overview` | KPIs executivos: visitantes únicos, pageviews, tempo médio na página, taxa de scroll, plays VTurb, leads e taxa de conversão. |
| `get_landing_pages_performance` | Desempenho detalhado por rota (`/growth-team`, `/lp2`, `/free-audit`), views, cliques em CTA, leads e retenção. |
| `get_channels_attribution` | Atribuição por canal de tráfego (**ChatGPT / AI Search**, **Meta Ads**, **Google Ads**, **Instagram Orgânico**, TikTok, etc.). |
| `get_us_states_and_geo` | Distribuição geográfica detalhada por **Estados dos EUA** (Califórnia, Flórida, Texas, NY, etc.) e países. |
| `get_live_visitors` | Radar de visitantes navegando nas landing pages ao vivo nos últimos 5 minutos. |
| `get_lead_journeys` | Trilha cronológica completa dos leads (canal de origem, página de entrada, submissão de formulário e agendamento Cal.com). |
| `get_vturb_video_stats` | Retenção do vídeo VTurb (marcos de 10s, 30s, 60s, 120s, 300s, 600s) e taxa de liberação de pitch. |

---

## 💻 2. Como Conectar no Claude Desktop

### Passo 1: Localizar o arquivo de configuração
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Passo 2: Adicionar a configuração MCP
```json
{
  "mcpServers": {
    "rarity-analytics": {
      "command": "node",
      "args": [
        "/Users/lenovo/Desktop/DIGITAL MARKETING/03_SOFTWARE, AI AND APP DEVELOPMENT/Claude Cowork/Rarity USA Client Aquisition/rarity_ecom_landing_page/mcp/server.mjs"
      ],
      "env": {
        "RARITY_API_URL": "https://ecom.rarityagency.io",
        "RARITY_API_KEY": "rarity2025"
      }
    }
  }
}
```

> **Dica**: Substitua o caminho do arquivo pelo caminho absoluto do seu computador caso mude de pasta.

---

## 💬 3. Como Conectar no ChatGPT (Custom GPT Actions)

1. Acesse o **ChatGPT** > **Explore GPTs** > **Create a GPT**.
2. Na aba **Configure**, clique em **Create new action** (ou Actions).
3. Em **Authentication**:
   - Authentication Type: **API Key**
   - Auth Type: **Custom** (ou Bearer / Header)
   - Header Name: `x-api-key`
   - API Key: `rarity2025`
4. Em **Schema**, clique em **Import from URL** e insira:
   ```
   https://ecom.rarityagency.io/api/openapi.json
   ```
5. Pronto! Agora o ChatGPT pode consultar métricas ao vivo quando você perguntar:
   - *"Qual o canal de tráfego que mais gerou leads esta semana?"*
   - *"Quantos visitantes da Califórnia e Flórida entraram hoje?"*
   - *"Qual landing page tem a melhor retenção de vídeo no VTurb?"*

---

## 🛡️ 4. Segurança e Autenticação

A API pública `/api/v1/analytics` exige autenticação via cabeçalho `x-api-key: rarity2025` ou `Authorization: Bearer rarity2025`.
As requisições externas não têm acesso a cookies confidenciais de sessão administrativa.
