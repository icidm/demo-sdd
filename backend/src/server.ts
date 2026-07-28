import "dotenv/config";
import express, { Request, Response } from 'express'
import type { DashboardFilters, DashboardResponse, DashboardPayload } from '@demo/shared'
import { DashboardService } from './service/dashboard-service'
import { McpJiraClient } from './jira/mcp-jira-client'
import { DashboardController } from './api/dashboard-controller'

const app = express()
const PORT = 3001

app.use(express.json())

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Initialize real Jira MCP client and dashboard service.
// No snapshot/cache repository: every request calls the live Jira MCP server,
// and a failure is surfaced as an error rather than served from stale data.
const jiraClient = new McpJiraClient()
const dashboardService = new DashboardService(jiraClient)
const dashboardController = new DashboardController(dashboardService)

console.log('[Server] Initialized Jira MCP integration (live only, no snapshot fallback)')

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'dashboard-api', jiraMcp: 'enabled' })
})

// Available projects endpoint
app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const projects = await jiraClient.getAvailableProjects()
    res.json({ projects })
  } catch (error) {
    console.error('[Server] Error fetching projects:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch projects',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Current user endpoint
app.get('/api/current-user', async (req: Request, res: Response) => {
  try {
    const user = await jiraClient.getCurrentUser()
    res.json(user)
  } catch (error) {
    console.error('[Server] Error fetching current user:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch current user',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Dashboard KPIs endpoint (POST to receive filters)
// Uses real Jira MCP integration live only, no snapshot fallback
app.post('/api/dashboard', async (req: Request, res: Response) => {
  try {
    const filters: DashboardFilters = req.body
    
    // Use real dashboard service (connects to Jira MCP)
    const response: DashboardResponse = await dashboardController.readDashboard(filters)
    
    res.json(response)
  } catch (error) {
    console.error('[Server] Error fetching dashboard:', error)
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

app.listen(PORT, () => {
  console.log(`\n✅ Backend server running on http://localhost:${PORT}`)
  console.log(`📊 Jira MCP Integration: ENABLED (live only, no snapshot fallback)`)
  console.log(`🔍 Health check: http://localhost:${PORT}/health`)
  console.log(`📈 Dashboard endpoint: POST http://localhost:${PORT}/api/dashboard\n`)
})
