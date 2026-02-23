# Mission Board ORBIT Modules Integration

## Overview
This documentation provides an overview of the newly integrated modules in the Mission Board application.

### Modules
1. **Assistant Dashboard**
   - Location: `/pages/asistente.tsx`
   Features a dashboard showcasing cron jobs, tool usage, and cost metrics.
2. **Documents Explorer**
   - Location: `/pages/documentos.tsx`
   Implements a file explorer for browsing various document directories.
3. **Memory Timeline**
   - Location: `/pages/memoria.tsx`
   Displays a timeline of memory events and opportunities.

### Components
- `CronJobCard.tsx`: Displays cron job details.
- `CostChart.tsx`: Visualizes cost over time using a line chart.
- `ToolsGrid.tsx`: Displays a grid of available tools.
- `GoalProgress.tsx`: Shows progress towards goals.
- `FileExplorer.tsx`: A component for exploring files within directories.
- `DocumentViewer.tsx`: Renders markdown documents.
- `MemoryTimeline.tsx`: Interactive timeline for memory events.
- `OpportunitiesKanban.tsx`: Kanban board for tracking opportunities.

## Integration
The pages utilize the existing `Layout.tsx` and `Navigation.tsx` to maintain consistency with the rest of the application. Hooks used include `useCronJobs`, `useDocuments`, and `useMemory` to fetch and display data accordingly.

Please refer to the project structure for further development and integration of additional features.