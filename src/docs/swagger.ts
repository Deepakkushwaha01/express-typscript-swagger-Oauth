import express from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'
import logger from '../utils/logger.ts'

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function swaggerDocs(app: express.Express, port: number | string): void {
  // Load and parse the YAML file
  const filePath = path.join(__dirname, './swagger.yaml')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const swaggerSpec = YAML.parse(fileContents)

  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Docs in JSON format
  app.get('/docs.json', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  logger.info(`Docs available at http://localhost:${port}/docs`)
}

export default swaggerDocs
