import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes/index.js';
export default defineConfig({ name: 'fc-vacresse', title: 'FC Vacresse', projectId: 'upze23ba', dataset: 'production', plugins: [structureTool()], schema: { types: schemaTypes } });
