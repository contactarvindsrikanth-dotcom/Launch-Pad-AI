import { useState } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const PRACTICE_AREAS = ["All", "Tax Prep", "Audit", "Bookkeeping", "Client Management", "Financial Analysis", "Practice Management"];
const TOOL_TYPES = ["All", "Claude Skill", "MCP Server", "Workflow"];
const SETUP_TIMES = ["All", "1 min", "5 min"];

const TOOLS = [
  { id: 1, name: "Tax Return Reviewer", setup: "1 min", type: "Claude Skill", outcome: "Review tax returns for errors and missing deductions in seconds", rating: 4.9, reviews: 63, area: "Tax Prep", description: "Paste any individual or business tax return into Claude and get an instant error-check. This skill cross-references common IRS rules, flags missing deductions (home office, retirement contributions, education credits), identifies math errors, and suggests optimization opportunities. Built specifically for US federal returns (1040, 1120, 1065).", capabilities: ["Cross-references IRS rules and schedules automatically", "Flags commonly missed deductions by return type", "Identifies math errors and inconsistencies", "Suggests optimization opportunities with explanations", "Supports 1040, 1120, 1065, and 1120-S returns"], requirements: ["Claude Pro subscription ($20/mo)", "No coding required", "Works in browser — nothing to install"], install1: "Open Claude → Create a new Project → Paste this system prompt:\n\nYou are a senior tax reviewer at a CPA firm. When given a tax return, you will:\n1. Check all math and cross-references between schedules\n2. Flag missing deductions common to this return type\n3. Identify inconsistencies with prior year data if provided\n4. Suggest optimization opportunities\n5. Rate confidence level for each finding\n\nAlways cite the specific IRS code section or publication for each finding. Format output as a structured review memo.", install5: "git clone https://github.com/launchpad-ai/tax-review-skill\ncd tax-review-skill\ncp skill.md ~/Claude/Skills/\n# Restart Claude Desktop" },
  { id: 2, name: "Client Document Organizer", setup: "1 min", type: "Claude Skill", outcome: "Auto-sort and categorize client documents by type and tax year", rating: 4.7, reviews: 41, area: "Practice Management", description: "Upload a batch of client documents and this skill automatically categorizes them by document type (W-2, 1099, receipts, bank statements), tax year, and client. Outputs a structured index you can paste into your workpaper system. Eliminates the most tedious part of tax season prep.", capabilities: ["Categorizes documents by type, year, and client", "Generates structured indices for workpaper systems", "Handles W-2s, 1099s, receipts, bank statements, and more", "Flags missing documents based on prior year comparison", "Outputs in multiple formats (table, CSV, checklist)"], requirements: ["Claude Pro subscription ($20/mo)", "No coding required"], install1: "Open Claude → New Project → Paste this system prompt:\n\nYou are a document management specialist for an accounting firm. When given client documents, you will:\n1. Identify each document type (W-2, 1099-INT, 1099-NEC, bank statement, receipt, etc.)\n2. Extract the tax year and client name\n3. Create a structured index sorted by client → year → document type\n4. Flag any commonly expected documents that appear to be missing\n\nOutput as a clean table with columns: Client | Tax Year | Document Type | Status | Notes", install5: "# Download the skill file directly\ncurl -O https://raw.githubusercontent.com/launchpad-ai/doc-organizer/main/skill.md\ncp skill.md ~/Claude/Skills/" },
  { id: 3, name: "Financial Statement Analyzer", setup: "5 min", type: "MCP Server", outcome: "Pull and analyze income statements, balance sheets instantly", rating: 4.8, reviews: 47, area: "Financial Analysis", description: "Connect Claude directly to financial data APIs. Pull real-time income statements, balance sheets, cash flow statements, and stock prices for any public company. Ask questions in plain English like 'Compare Apple and Microsoft's margins over the last 3 years' and get instant analysis with charts.", capabilities: ["Pull income statements, balance sheets, cash flow data", "Real-time and historical stock prices", "Plain English queries for financial analysis", "Automatic ratio calculations and trend analysis", "Export results to Excel-ready format"], requirements: ["Claude Pro or Claude Desktop", "API key from financialdatasets.ai (free tier available)", "5 minutes of setup time"], install1: "1. Get a free API key at financialdatasets.ai\n2. Open Claude Desktop → Settings → MCP Servers\n3. Add new server with this config:\n\n{\n  \"financial-datasets\": {\n    \"command\": \"npx\",\n    \"args\": [\"-y\", \"@financial-datasets/mcp-server\"],\n    \"env\": { \"API_KEY\": \"your-key-here\" }\n  }\n}", install5: "git clone https://github.com/financial-datasets/mcp-server\ncd mcp-server\nnpm install\nexport FINANCIAL_DATASETS_API_KEY=your-key-here\nnpm start" },
  { id: 4, name: "Engagement Letter Generator", setup: "1 min", type: "Claude Skill", outcome: "Generate compliant engagement letters in 60 seconds", rating: 4.6, reviews: 34, area: "Client Management", description: "Input the client name, service type, and fee structure — get a professionally formatted engagement letter that follows AICPA standards. Covers tax preparation, audit, review, compilation, bookkeeping, and advisory engagements. Includes liability limitations, scope definitions, and fee schedules.", capabilities: ["AICPA-compliant letter templates", "Supports tax, audit, review, compilation, bookkeeping, advisory", "Auto-generates liability limitation clauses", "Customizable fee schedule sections", "Professional formatting ready for letterhead"], requirements: ["Claude Pro subscription ($20/mo)", "No coding required"], install1: "Open Claude → New Project → Paste this system prompt:\n\nYou are a professional services engagement letter specialist. Generate AICPA-compliant engagement letters based on:\n- Client name, entity type, and fiscal year\n- Service type (tax prep, audit, review, compilation, bookkeeping, advisory)\n- Fee structure (fixed, hourly, retainer)\n- Any special terms or conditions\n\nInclude: scope of services, responsibilities of both parties, fee schedule, liability limitations, dispute resolution, and signature blocks. Use professional but readable language.", install5: "curl -O https://raw.githubusercontent.com/launchpad-ai/engagement-letters/main/skill.md\ncp skill.md ~/Claude/Skills/" },
  { id: 5, name: "Audit Workpaper Assistant", setup: "1 min", type: "Claude Skill", outcome: "Draft audit workpapers with proper citations and cross-references", rating: 4.8, reviews: 52, area: "Audit", description: "Generate structured audit workpapers with proper tick marks, cross-references, and citations to relevant standards (ASC, PCAOB, GAAS). Input the audit area and key findings — get a workpaper draft ready for senior review. Dramatically reduces documentation time during busy season.", capabilities: ["Generates workpapers following firm formatting standards", "Proper tick marks and cross-reference notation", "Citations to ASC, PCAOB, and GAAS standards", "Structured findings with severity levels", "Ready for senior/manager review"], requirements: ["Claude Pro subscription ($20/mo)", "No coding required"], install1: "Open Claude → New Project → Paste this system prompt:\n\nYou are a senior auditor drafting workpapers. For any audit area provided, generate a structured workpaper that includes:\n1. Objective of the procedure\n2. Population and sample description\n3. Procedures performed (with tick marks: ✓ verified, ✗ exception, N/A not applicable)\n4. Findings and exceptions with severity (High/Medium/Low)\n5. Conclusion\n6. Cross-references to related workpapers\n7. Relevant ASC/PCAOB/GAAS citations\n\nFormat professionally with clear section headers and reference codes.", install5: "curl -O https://raw.githubusercontent.com/launchpad-ai/audit-workpapers/main/skill.md\ncp skill.md ~/Claude/Skills/" },
  { id: 6, name: "Bookkeeping Reconciliation Bot", setup: "5 min", type: "MCP Server", outcome: "Reconcile bank statements against ledger entries automatically", rating: 4.7, reviews: 38, area: "Bookkeeping", description: "Connect your bank statement CSV and general ledger export. This tool automatically matches transactions, flags discrepancies, identifies unrecorded transactions, and generates a reconciliation report. Handles multi-account reconciliation and supports all major bank statement formats.", capabilities: ["Automatic transaction matching by amount, date, and description", "Flags unmatched transactions on both sides", "Identifies timing differences vs. true discrepancies", "Multi-account reconciliation support", "Generates formatted reconciliation reports"], requirements: ["Claude Desktop app", "Bank statement CSV export", "General ledger CSV export", "5 minutes of setup time"], install1: "1. Export your bank statement as CSV from your bank's website\n2. Export your GL trial balance or transaction detail as CSV\n3. Open Claude Desktop → Upload both files\n4. Use this prompt:\n\n'Reconcile these two files. The bank statement is [filename] and the general ledger is [filename]. Match transactions by amount and date (±3 days). Flag all unmatched items and timing differences. Output a formatted reconciliation report.'", install5: "git clone https://github.com/launchpad-ai/recon-bot\ncd recon-bot\npip install -r requirements.txt\npython reconcile.py --bank statement.csv --ledger gl.csv" },
  { id: 7, name: "Meeting Notes to Action Items", setup: "1 min", type: "Claude Skill", outcome: "Turn client call recordings into structured follow-up tasks", rating: 4.8, reviews: 45, area: "Client Management", description: "Paste a meeting transcript or your rough notes from a client call. Get structured action items with owners, deadlines, and priority levels. Automatically identifies commitments made, questions to follow up on, and documents requested. Never lose a follow-up again.", capabilities: ["Extracts action items with owners and deadlines", "Identifies commitments and promises made", "Flags questions requiring follow-up", "Lists documents requested or to be provided", "Prioritizes items by urgency"], requirements: ["Claude Pro subscription ($20/mo)", "Meeting transcript or notes"], install1: "Open Claude → Paste this prompt before your notes:\n\n'Extract all action items from the following client meeting notes. For each item, provide: Task description, Owner (us or client), Priority (High/Medium/Low), Suggested deadline, and any dependencies. Group by owner. Flag any commitments made that need tracking.'\n\nThen paste your meeting notes below.", install5: "N/A — this is a prompt-only skill" },
  { id: 8, name: "Excel Formula Builder", setup: "1 min", type: "Claude Skill", outcome: "Describe what you need and get working Excel formulas instantly", rating: 4.9, reviews: 128, area: "Financial Analysis", description: "Stop Googling Excel formulas. Describe what you need in plain English — 'calculate the running total of column B but only for rows where column A says Revenue' — and get the exact formula with an explanation of how it works. Supports VLOOKUP, INDEX/MATCH, SUMIFS, array formulas, and more.", capabilities: ["Generates complex Excel formulas from plain English", "Supports VLOOKUP, INDEX/MATCH, SUMIFS, XLOOKUP", "Handles array formulas and dynamic arrays", "Explains formula logic step by step", "Suggests more efficient alternatives when available"], requirements: ["Claude Pro subscription ($20/mo)", "No coding required"], install1: "No setup needed! Just open Claude and describe what you need:\n\n'I need an Excel formula that [describe what you want]. My data is in [describe your sheet layout].'\n\nClaude will give you the exact formula and explain how it works.", install5: "N/A — this is a prompt-only skill" },
  { id: 9, name: "PDF Data Extractor", setup: "1 min", type: "Claude Skill", outcome: "Pull tables and figures from any PDF into structured data", rating: 4.7, reviews: 89, area: "Practice Management", description: "Upload any PDF — financial statements, tax forms, client documents — and extract tables, figures, and key data into structured formats (CSV, table, JSON). Handles scanned documents, multi-page tables, and complex layouts. Perfect for digitizing paper-based client records.", capabilities: ["Extracts tables from complex PDF layouts", "Handles multi-page tables and merged cells", "Supports scanned documents with OCR", "Outputs in CSV, table, or JSON format", "Preserves numerical precision"], requirements: ["Claude Pro subscription ($20/mo)", "PDF file to upload"], install1: "Open Claude → Upload your PDF → Use this prompt:\n\n'Extract all tables and key data points from this PDF. Output each table in a clean format I can paste into Excel. Preserve all numbers exactly as they appear. If there are multiple tables, label each one.'", install5: "N/A — this is a prompt-only skill" },
  { id: 10, name: "IRS Notice Responder", setup: "1 min", type: "Claude Skill", outcome: "Draft professional IRS notice responses with proper citations", rating: 4.8, reviews: 56, area: "Tax Prep", description: "Upload or describe an IRS notice — get a professionally drafted response letter citing relevant IRC sections, Treasury Regulations, and Revenue Rulings. Covers CP2000, CP2501, CP3219A, and other common notices. Includes proper formatting for IRS correspondence.", capabilities: ["Drafts responses for all common IRS notice types", "Cites IRC sections, Treasury Regs, and Revenue Rulings", "Proper IRS correspondence formatting", "Includes supporting documentation checklists", "Generates cover letters and transmittal forms"], requirements: ["Claude Pro subscription ($20/mo)", "IRS notice details or upload"], install1: "Open Claude → Upload the IRS notice (or type the notice number and details) → Use this prompt:\n\n'Draft a professional response to this IRS notice. Include: proper salutation and reference numbers, point-by-point response to each issue, citations to relevant IRC sections and regulations, list of supporting documents to attach, and closing with requested resolution. Format for mailing to the IRS.'", install5: "N/A — this is a prompt-only skill" },
  { id: 11, name: "Client Email Drafter", setup: "1 min", type: "Claude Skill", outcome: "Generate professional client emails from bullet point notes", rating: 4.6, reviews: 29, area: "Client Management", description: "Turn messy bullet points into polished client communications. Input your rough notes about what you need to tell a client — get a professional, warm email ready to send. Adjusts tone based on context (good news, bad news, request for documents, status update).", capabilities: ["Converts bullet points to professional emails", "Adjusts tone for context (good news, requests, updates)", "Maintains appropriate formality for professional services", "Suggests subject lines", "Handles sensitive topics with appropriate language"], requirements: ["Claude Pro subscription ($20/mo)"], install1: "No setup needed! Just open Claude and say:\n\n'Draft a professional email to my client based on these notes: [paste your bullet points]. The tone should be [warm/formal/urgent]. Context: [brief context about the client relationship].'", install5: "N/A — this is a prompt-only skill" },
  { id: 12, name: "Depreciation Calculator", setup: "1 min", type: "Claude Skill", outcome: "Calculate MACRS depreciation schedules across asset classes", rating: 4.7, reviews: 37, area: "Tax Prep", description: "Input asset details (cost, date placed in service, asset class) and get complete MACRS depreciation schedules. Handles Section 179, bonus depreciation, mid-quarter convention, and listed property rules. Outputs year-by-year schedules ready for tax return preparation.", capabilities: ["MACRS depreciation for all asset classes", "Section 179 and bonus depreciation calculations", "Mid-quarter and mid-month convention support", "Listed property and luxury auto limitations", "Year-by-year schedule output"], requirements: ["Claude Pro subscription ($20/mo)"], install1: "Open Claude → Use this prompt:\n\n'Calculate the MACRS depreciation schedule for the following asset: [Description], Cost: $[amount], Date placed in service: [date], Asset class: [class/recovery period]. Apply current year Section 179 and bonus depreciation rules. Show the year-by-year schedule and the current year deduction.'", install5: "N/A — this is a prompt-only skill" },
  { id: 13, name: "Proposal & SOW Generator", setup: "1 min", type: "Claude Skill", outcome: "Create detailed service proposals from a 5-minute intake form", rating: 4.8, reviews: 44, area: "Practice Management", description: "Answer a few questions about the prospective client and get a polished service proposal with scope of work, timeline, fee estimate, and terms. Covers tax, audit, bookkeeping, advisory, and fractional CFO engagements. Professional formatting ready for your firm's letterhead.", capabilities: ["Generates complete proposals from brief intake", "Covers all major engagement types", "Includes scope, timeline, fees, and terms", "Professional formatting for letterhead", "Customizable sections and language"], requirements: ["Claude Pro subscription ($20/mo)"], install1: "Open Claude → New Project → Paste this system prompt:\n\nYou are a business development manager at an accounting firm. Generate professional service proposals based on client intake information. Include:\n1. Executive summary\n2. Understanding of client needs\n3. Proposed scope of services\n4. Engagement timeline and milestones\n5. Fee structure and payment terms\n6. Team qualifications\n7. Terms and conditions\n8. Signature block\n\nUse professional language appropriate for accounting/professional services. Make fees appear as [FEE AMOUNT] for manual entry.", install5: "curl -O https://raw.githubusercontent.com/launchpad-ai/proposal-gen/main/skill.md\ncp skill.md ~/Claude/Skills/" },
  { id: 14, name: "Payroll Compliance Checker", setup: "5 min", type: "MCP Server", outcome: "Flag payroll compliance issues across multi-state clients", rating: 4.5, reviews: 22, area: "Bookkeeping", description: "Upload payroll data for multi-state clients and get an instant compliance check. Flags issues with state withholding, unemployment tax rates, minimum wage compliance, overtime calculations, and filing deadlines. Covers all 50 US states.", capabilities: ["Multi-state withholding verification", "Unemployment tax rate validation", "Minimum wage and overtime compliance", "Filing deadline tracking by state", "Generates compliance exception reports"], requirements: ["Claude Desktop app", "Payroll data export (CSV)", "5 minutes of setup"], install1: "1. Export payroll data as CSV from your payroll system\n2. Open Claude Desktop → Upload the CSV\n3. Use this prompt:\n\n'Review this payroll data for multi-state compliance issues. Check: state withholding rates, unemployment tax rates, minimum wage compliance, overtime calculations, and upcoming filing deadlines. Flag all exceptions and provide the correct rates/amounts.'", install5: "git clone https://github.com/launchpad-ai/payroll-compliance\ncd payroll-compliance\npip install -r requirements.txt\npython check.py --data payroll_export.csv" },
  { id: 15, name: "Research Memo Writer", setup: "1 min", type: "Claude Skill", outcome: "Draft technical accounting research memos with ASC references", rating: 4.9, reviews: 61, area: "Audit", description: "Describe a technical accounting question and get a structured research memo with proper ASC citations, analysis of alternatives, and a recommended conclusion. Follows standard firm memo format. Perfect for complex revenue recognition, lease accounting, and consolidation questions.", capabilities: ["Structured research memo format", "Proper ASC and FASB citations", "Analysis of accounting alternatives", "Recommended conclusion with support", "Handles revenue recognition, leases, consolidation, and more"], requirements: ["Claude Pro subscription ($20/mo)"], install1: "Open Claude → Use this prompt:\n\n'Draft a technical accounting research memo for the following question: [describe the issue]. Include:\n1. Issue/Question\n2. Relevant Facts\n3. Applicable Guidance (with specific ASC references)\n4. Analysis of Alternatives\n5. Conclusion and Recommendation\n6. References\n\nUse formal memo format suitable for workpaper documentation.'", install5: "N/A — this is a prompt-only skill" },
  { id: 16, name: "Cash Flow Forecaster", setup: "5 min", type: "MCP Server", outcome: "Generate 12-month cash flow projections from historical data", rating: 4.6, reviews: 31, area: "Financial Analysis", description: "Upload 12-24 months of historical financial data and get a 12-month cash flow projection with assumptions clearly stated. Handles seasonality, growth trends, and one-time events. Outputs an Excel-ready forecast with scenario analysis (best case, base case, worst case).", capabilities: ["12-month projections from historical data", "Seasonality and trend detection", "Three-scenario analysis (best/base/worst)", "Clearly stated assumptions", "Excel-ready output format"], requirements: ["Claude Desktop app", "Historical financial data (CSV or Excel)", "5 minutes of setup"], install1: "1. Export 12-24 months of P&L and cash flow data as CSV\n2. Open Claude Desktop → Upload the file\n3. Use this prompt:\n\n'Generate a 12-month cash flow forecast based on this historical data. Detect seasonality and trends. Provide three scenarios (optimistic, base, conservative) with clearly stated assumptions. Format as a month-by-month table I can paste into Excel.'", install5: "git clone https://github.com/launchpad-ai/cashflow-forecast\ncd cashflow-forecast\npip install -r requirements.txt\npython forecast.py --data historical.csv --months 12" },
  { id: 17, name: "Client Onboarding Checklist", setup: "1 min", type: "Claude Skill", outcome: "Auto-generate customized onboarding checklists by service type", rating: 4.7, reviews: 33, area: "Client Management", description: "Input the client name, entity type, and services engaged — get a complete onboarding checklist with every document needed, system access to set up, and introductory tasks. Customized by engagement type so you never miss a step during new client intake.", capabilities: ["Checklists customized by engagement type", "Document request lists by entity type", "System access and setup tasks", "Timeline with suggested due dates", "Assignable tasks for team members"], requirements: ["Claude Pro subscription ($20/mo)"], install1: "Open Claude → Use this prompt:\n\n'Generate a new client onboarding checklist for: Client: [name], Entity type: [individual/S-corp/C-corp/partnership/LLC], Services: [tax/audit/bookkeeping/advisory]. Include: documents to request, system access to set up, internal tasks, client communication timeline, and team assignments. Format as a checklist with categories.'", install5: "N/A — this is a prompt-only skill" },
  { id: 18, name: "Workpaper Index Generator", setup: "1 min", type: "Claude Skill", outcome: "Create organized workpaper indices with proper reference coding", rating: 4.8, reviews: 48, area: "Audit", description: "Input the engagement type and audit areas — get a complete workpaper index with standard reference codes, section organization, and placeholder descriptions. Follows common firm indexing conventions. Saves hours of setup time at the start of every engagement.", capabilities: ["Standard workpaper reference coding", "Organized by audit area and section", "Follows common firm indexing conventions", "Placeholder descriptions for each workpaper", "Customizable for different engagement types"], requirements: ["Claude Pro subscription ($20/mo)"], install1: "Open Claude → Use this prompt:\n\n'Generate a complete workpaper index for a [type: audit/review/compilation] engagement for a [entity type] in the [industry] industry. Use standard reference coding (A for assets, B for liabilities, etc.). Include section headers, individual workpaper descriptions, and cross-reference placeholders. Format as a table with columns: Reference, Description, Preparer, Reviewer, Status.'", install5: "N/A — this is a prompt-only skill" },
];

const REVIEWS_DATA = {
  1: [
    { name: "Sarah M., CPA", rating: 5, date: "Feb 2026", text: "Caught three missed deductions on a client return I'd already reviewed. Paid for itself on the first use." },
    { name: "James T., Tax Manager", rating: 5, date: "Jan 2026", text: "We run every return through this before final review now. Our error rate dropped significantly." },
    { name: "Lisa K., Staff Accountant", rating: 4, date: "Feb 2026", text: "Great for individual returns. Still learning complex partnership returns but improving fast." },
  ],
  3: [
    { name: "Michael R., CFO Advisory", rating: 5, date: "Mar 2026", text: "Being able to pull financials directly into Claude changed how I prep for client meetings." },
    { name: "David L., Analyst", rating: 5, date: "Feb 2026", text: "The plain English queries are incredible. 'Show me revenue trends for the last 8 quarters' just works." },
  ],
  5: [
    { name: "Jennifer W., Senior Auditor", rating: 5, date: "Mar 2026", text: "Saves me at least 2 hours per audit area on documentation. The ASC citations are accurate." },
    { name: "Robert P., Audit Manager", rating: 4, date: "Jan 2026", text: "Solid first drafts. Still need senior review but cuts workpaper prep time in half." },
  ],
};

// ─── STYLES ─────────────────────────────────────────────────────────────────

const theme = {
  navy: "#0F1A2E",
  navyLight: "#1B2A4A",
  navyMid: "#243553",
  emerald: "#10B981",
  emeraldHover: "#059669",
  gold: "#F59E0B",
  goldLight: "#FEF3C7",
  white: "#FFFFFF",
  gray50: "#F8FAFC",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray300: "#CBD5E1",
  gray400: "#94A3B8",
  gray500: "#64748B",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1E293B",
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const Stars = ({ rating, size = 14 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: theme.gold, fontSize: size, letterSpacing: 1 }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const Badge = ({ children, color = theme.emerald, bg, textColor }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
    background: bg || `${color}18`, color: textColor || color,
    textTransform: "uppercase", whiteSpace: "nowrap",
  }}>{children}</span>
);

const Button = ({ children, variant = "primary", onClick, style: s = {}, size = "md" }) => {
  const [hovered, setHovered] = useState(false);
  const base = {
    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
    fontFamily: "'Outfit', sans-serif", transition: "all 0.2s ease",
    padding: size === "lg" ? "14px 32px" : size === "sm" ? "8px 16px" : "10px 24px",
    fontSize: size === "lg" ? 16 : size === "sm" ? 13 : 14,
  };
  const variants = {
    primary: { background: hovered ? theme.emeraldHover : theme.emerald, color: "#fff" },
    outline: { background: "transparent", color: theme.emerald, border: `2px solid ${theme.emerald}` },
    outlineWhite: { background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.4)" },
    ghost: { background: hovered ? theme.gray100 : "transparent", color: theme.gray700 },
    white: { background: "#fff", color: theme.navy, boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none" },
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...variants[variant], transform: hovered ? "translateY(-1px)" : "none", ...s }}>
      {children}
    </button>
  );
};

const ToolCard = ({ tool, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const accentColor = tool.setup === "1 min" ? theme.emerald : "#3B82F6";
  const areaIcons = {
    "Tax Prep": "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    "Audit": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    "Bookkeeping": "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    "Client Management": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    "Financial Analysis": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    "Practice Management": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  };
  const iconPath = areaIcons[tool.area] || areaIcons["Practice Management"];

  return (
    <div onClick={() => onClick(tool)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 14, cursor: "pointer", overflow: "hidden",
        border: `1px solid ${hovered ? accentColor + "60" : theme.gray200}`,
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.08), 0 0 0 1px ${accentColor}20` : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: hovered ? "translateY(-4px)" : "none",
        display: "flex", flexDirection: "column",
      }}>
      {/* Top accent bar */}
      <div style={{
        height: 3,
        background: hovered
          ? `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}60 100%)`
          : `linear-gradient(90deg, ${accentColor}40 0%, ${accentColor}15 100%)`,
        transition: "all 0.3s ease",
      }} />

      <div style={{ padding: "20px 24px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header row: icon + badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `linear-gradient(135deg, ${accentColor}12 0%, ${accentColor}06 100%)`,
            border: `1px solid ${accentColor}20`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={iconPath} />
            </svg>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <span style={{
              padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
              background: accentColor === theme.emerald ? "#ECFDF5" : "#EFF6FF",
              color: accentColor, letterSpacing: 0.3,
            }}>⚡ {tool.setup}</span>
            <span style={{
              padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: theme.gray100, color: theme.gray500, letterSpacing: 0.3,
            }}>{tool.type}</span>
          </div>
        </div>

        {/* Name */}
        <h3 style={{
          margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: theme.navy,
          fontFamily: "'Outfit', sans-serif", lineHeight: 1.3,
        }}>{tool.name}</h3>

        {/* Outcome */}
        <p style={{
          margin: "0 0 16px", fontSize: 13.5, color: theme.gray500, lineHeight: 1.55, flex: 1,
        }}>{tool.outcome}</p>

        {/* Footer: rating + area + verified */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 14, borderTop: `1px solid ${theme.gray100}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Rating pill */}
            <div style={{
              display: "flex", alignItems: "center", gap: 4, padding: "3px 8px",
              borderRadius: 6, background: "#FFFBEB",
            }}>
              <span style={{ color: theme.gold, fontSize: 12 }}>★</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>{tool.rating}</span>
            </div>
            <span style={{ fontSize: 11, color: theme.gray400 }}>({tool.reviews})</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: `${theme.navyLight}08`, color: theme.navyLight, letterSpacing: 0.3,
            }}>{tool.area}</span>
            {/* Verified checkmark */}
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.emerald} 0%, #059669 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }} title="Verified & Tested">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeading = ({ eyebrow, title, subtitle, light = false, center = true }) => (
  <div style={{ textAlign: center ? "center" : "left", marginBottom: 48, maxWidth: 680, margin: center ? "0 auto 48px" : "0 0 48px" }}>
    {eyebrow && <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: theme.emerald, marginBottom: 12 }}>{eyebrow}</p>}
    <h2 style={{ fontSize: 32, fontWeight: 800, color: light ? "#fff" : theme.navy, margin: "0 0 16px", lineHeight: 1.2, fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 17, color: light ? "rgba(255,255,255,0.7)" : theme.gray500, margin: 0, lineHeight: 1.6 }}>{subtitle}</p>}
  </div>
);

// ─── PAGES ──────────────────────────────────────────────────────────────────

const HomePage = ({ navigate, setSelectedTool }) => (
  <div>
    {/* Hero */}
    <section style={{
      background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyLight} 50%, ${theme.navyMid} 100%)`,
      padding: "100px 24px 80px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -100, right: -100, width: 500, height: 500,
        background: `radial-gradient(circle, ${theme.emerald}15 0%, transparent 70%)`,
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: -150, left: -50, width: 400, height: 400,
        background: `radial-gradient(circle, ${theme.gold}10 0%, transparent 70%)`,
        borderRadius: "50%",
      }} />
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 20, marginBottom: 24,
          background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
        }}>
          <span style={{ fontSize: 13, color: theme.emerald, fontWeight: 600 }}>Now live for Accounting & Professional Services</span>
        </div>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#fff", margin: "0 0 20px",
          lineHeight: 1.1, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em",
        }}>
          Stop Guessing.<br /><span style={{ color: theme.emerald }}>Start Deploying.</span>
        </h1>
        <p style={{ fontSize: 19, color: "rgba(255,255,255,0.7)", marginBottom: 36, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 36px" }}>
          Vetted AI tools for accounting firms. Curated by humans. Install in minutes, not months.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button size="lg" onClick={() => navigate("tools")}>Browse AI Tools</Button>
          <Button variant="outlineWhite" size="lg" onClick={() => navigate("services")}>Book a Free AI Audit</Button>
        </div>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {[["30+", "Vetted Tools"], ["6", "Practice Areas"], ["1 min", "Average Setup"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "'Outfit', sans-serif" }}>{num}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Problem */}
    <section style={{
      padding: "80px 24px", position: "relative", overflow: "hidden",
      background: `linear-gradient(160deg, #0C1220 0%, ${theme.navy} 40%, #162033 100%)`,
    }}>
      {/* Decorative grid lines */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#EF4444", marginBottom: 16, opacity: 0.9 }}>THE PROBLEM</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.15, fontFamily: "'Outfit', sans-serif", maxWidth: 650, marginLeft: "auto", marginRight: "auto" }}>
            You Know AI Can Help.<br />You Just Don't Know Where to Start.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            {
              stat: "15+", statLabel: "hrs/week wasted",
              title: "Drowning in documents",
              desc: "Your team spends 15+ hours every week on data entry, document review, and manual reporting that AI could handle today.",
              gradient: "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.03) 100%)",
              borderColor: "rgba(239,68,68,0.2)", accentColor: "#EF4444",
              iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              stat: "11K+", statLabel: "AI tools exist",
              title: "Too many tools, no filter",
              desc: "There are thousands of AI tools out there. Most don't work. Most aren't built for accounting. You don't have time to test them all.",
              gradient: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.03) 100%)",
              borderColor: "rgba(245,158,11,0.2)", accentColor: "#F59E0B",
              iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            },
            {
              stat: "67%", statLabel: "of AI projects fail",
              title: "Fear of getting it wrong",
              desc: "One bad AI implementation wastes months of budget and destroys your team's trust in technology. The stakes are too high to guess.",
              gradient: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.03) 100%)",
              borderColor: "rgba(168,85,247,0.2)", accentColor: "#A855F7",
              iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
            },
          ].map((card) => (
            <div key={card.title} style={{
              background: card.gradient, borderRadius: 16, padding: 32,
              border: `1px solid ${card.borderColor}`,
              backdropFilter: "blur(8px)", position: "relative", overflow: "hidden",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${card.borderColor}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Subtle corner glow */}
              <div style={{
                position: "absolute", top: -30, right: -30, width: 100, height: 100,
                borderRadius: "50%", background: `radial-gradient(circle, ${card.accentColor}15 0%, transparent 70%)`,
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10, marginBottom: 20,
                  background: `${card.accentColor}18`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={card.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={card.iconPath} />
                  </svg>
                </div>

                {/* Stat */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    fontSize: 42, fontWeight: 800, fontFamily: "'Outfit', sans-serif",
                    color: card.accentColor, lineHeight: 1, letterSpacing: "-0.03em",
                  }}>{card.stat}</span>
                  <span style={{
                    display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4,
                  }}>{card.statLabel}</span>
                </div>

                {/* Content */}
                <h3 style={{
                  fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 10,
                  fontFamily: "'Outfit', sans-serif",
                }}>{card.title}</h3>
                <p style={{
                  fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0,
                }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Solution Steps */}
    <section style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading eyebrow="How it works" title="We Test It. We Rate It. You Deploy It."
          subtitle="Every tool in our directory has been personally vetted for accounting professionals. No fluff. No vaporware." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 0, position: "relative" }}>
          {/* Connector line (desktop) */}
          <div style={{
            position: "absolute", top: 40, left: "20%", right: "20%", height: 2,
            background: `linear-gradient(90deg, ${theme.gray200} 0%, ${theme.emerald}40 50%, ${theme.gray200} 100%)`,
            zIndex: 0,
          }} />
          {[
            { num: "1", title: "Browse by Practice Area", desc: "Find tools organized by what you actually do: tax prep, audit, client management, bookkeeping.", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
            { num: "2", title: "See What Works", desc: "Every tool has honest ratings, setup time estimates, and real outcome descriptions.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { num: "3", title: "Install in Minutes", desc: "Copy-paste setup instructions. No developers needed. No IT department required.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
          ].map((step, i) => (
            <div key={step.num} style={{ textAlign: "center", padding: "0 16px", position: "relative", zIndex: 1 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px",
                background: `linear-gradient(135deg, ${theme.emerald}15 0%, ${theme.emerald}05 100%)`,
                border: `2px solid ${theme.emerald}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 20px ${theme.emerald}10`,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={step.icon} />
                </svg>
              </div>
              <div style={{
                display: "inline-block", padding: "2px 10px", borderRadius: 10,
                background: theme.gray100, marginBottom: 12,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.emerald, letterSpacing: 1 }}>STEP {step.num}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.navy, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: theme.gray500, lineHeight: 1.6, margin: 0, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Featured Tools */}
    <section style={{ padding: "80px 24px", background: theme.gray50, position: "relative" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: theme.emerald, marginBottom: 8 }}>Featured</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: theme.navy, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Popular Tools for Accounting Firms</h2>
          </div>
          <Button variant="outline" onClick={() => navigate("tools")} size="sm">View All 18 Tools →</Button>
        </div>
        {/* Practice area quick tags */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["Tax Prep", "Audit", "Bookkeeping", "Client Management", "Financial Analysis", "Practice Management"].map(area => (
            <span key={area} style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: "#fff", color: theme.gray500, border: `1px solid ${theme.gray200}`,
              cursor: "pointer",
            }}
              onClick={() => navigate("tools")}
            >{area}</span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {TOOLS.slice(0, 6).map(t => <ToolCard key={t.id} tool={t} onClick={(tool) => { setSelectedTool(tool); navigate("tool-detail"); }} />)}
        </div>
      </div>
    </section>

    {/* Consulting Teaser */}
    <section style={{
      padding: "80px 24px",
      background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyMid} 100%)`,
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading light eyebrow="Services" title="Need Hands-On Help? We'll Implement It For You."
          subtitle="Not every firm has time to DIY. Our implementation team will audit your workflows, recommend the right tools, and deploy them across your practice." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            ["AI Readiness Audit", "$500 one-time", "90-minute assessment of your current workflows, tech stack, and AI opportunities."],
            ["Starter Implementation", "$3,000/month", "We deploy 3–5 AI tools across your practice, train your team, and support for 90 days."],
            ["Full Transformation", "$7,000/month", "End-to-end AI integration across all practice areas. Custom workflows, monthly reviews."],
          ].map(([name, price, desc], i) => (
            <div key={name} style={{
              background: i === 1 ? `${theme.emerald}12` : "rgba(255,255,255,0.05)",
              borderRadius: 12, padding: 28,
              border: i === 1 ? `1px solid ${theme.emerald}40` : "1px solid rgba(255,255,255,0.08)",
            }}>
              {i === 1 && <Badge color={theme.gold} bg={`${theme.gold}20`} textColor={theme.gold}>Most Popular</Badge>}
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: i === 1 ? "12px 0 6px" : "0 0 6px", fontFamily: "'Outfit', sans-serif" }}>{name}</h3>
              <p style={{ fontSize: 22, fontWeight: 800, color: theme.emerald, margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>{price}</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Button onClick={() => navigate("services")}>Book a Free Discovery Call</Button>
        </div>
      </div>
    </section>

    {/* Trust */}
    <section style={{ padding: "60px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <SectionHeading eyebrow="Why trust us" title="Built by People Who Understand Your Practice" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {[
            "Founded by a B2B SaaS professional with 5+ years in enterprise technology",
            "Every tool tested against real accounting workflows",
            "Used by firms processing 500+ client returns per season",
          ].map(t => (
            <div key={t} style={{
              padding: 20, borderRadius: 10, background: theme.gray50,
              border: `1px solid ${theme.gray200}`,
            }}>
              <p style={{ margin: 0, fontSize: 14, color: theme.gray600, lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Newsletter */}
    <section style={{ padding: "60px 24px", background: theme.gray50 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: theme.navy, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>Get the Weekly AI Tools Briefing</h2>
        <p style={{ fontSize: 15, color: theme.gray500, marginBottom: 24 }}>Every Friday: 1 new vetted tool, 1 implementation tip, 1 industry insight. No spam.</p>
        <div style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto" }}>
          <input placeholder="you@yourfirm.com" style={{
            flex: 1, padding: "12px 16px", borderRadius: 8, border: `1px solid ${theme.gray300}`,
            fontSize: 14, outline: "none", fontFamily: "'Source Sans 3', sans-serif",
          }} />
          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  </div>
);

const ToolsPage = ({ navigate, setSelectedTool }) => {
  const [areaFilter, setAreaFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  let filtered = TOOLS.filter(t =>
    (areaFilter === "All" || t.area === areaFilter) &&
    (typeFilter === "All" || t.type === typeFilter) &&
    (timeFilter === "All" || t.setup === timeFilter)
  );
  if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
  if (sortBy === "newest") filtered.sort((a, b) => b.id - a.id);

  const FilterPill = ({ label, active, onClick: oc }) => (
    <button onClick={oc} style={{
      padding: "6px 14px", borderRadius: 20, border: `1px solid ${active ? theme.emerald : theme.gray300}`,
      background: active ? `${theme.emerald}12` : "#fff", color: active ? theme.emerald : theme.gray500,
      fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
      fontFamily: "'Source Sans 3', sans-serif",
    }}>{label}</button>
  );

  return (
    <div style={{ background: theme.gray50, minHeight: "100vh" }}>
      <section style={{ padding: "60px 24px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.navy, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>AI Tools for Accounting Firms</h1>
          <p style={{ fontSize: 16, color: theme.gray500, marginBottom: 0 }}>Every tool below has been tested on real accounting workflows. Filter by practice area, setup time, or tool type.</p>
        </div>
      </section>
      <section style={{ padding: "16px 24px", background: "#fff", borderBottom: `1px solid ${theme.gray200}`, position: "sticky", top: 60, zIndex: 90 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.gray400, textTransform: "uppercase", letterSpacing: 1, marginRight: 4 }}>Area:</span>
            {PRACTICE_AREAS.map(a => <FilterPill key={a} label={a} active={areaFilter === a} onClick={() => setAreaFilter(a)} />)}
            <span style={{ width: 1, height: 20, background: theme.gray200, margin: "0 8px" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.gray400, textTransform: "uppercase", letterSpacing: 1, marginRight: 4 }}>Time:</span>
            {SETUP_TIMES.map(t => <FilterPill key={t} label={t} active={timeFilter === t} onClick={() => setTimeFilter(t)} />)}
          </div>
        </div>
      </section>
      <section style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 14, color: theme.gray500 }}>{filtered.length} tools found</p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              padding: "6px 12px", borderRadius: 6, border: `1px solid ${theme.gray300}`,
              fontSize: 13, color: theme.gray600, background: "#fff", cursor: "pointer",
            }}>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filtered.map(t => <ToolCard key={t.id} tool={t} onClick={(tool) => { setSelectedTool(tool); navigate("tool-detail"); }} />)}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60 }}>
              <p style={{ fontSize: 18, color: theme.gray400 }}>No tools match your filters.</p>
              <Button variant="ghost" onClick={() => { setAreaFilter("All"); setTimeFilter("All"); }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ToolDetailPage = ({ tool, navigate, setSelectedTool }) => {
  const [activeTab, setActiveTab] = useState("1min");
  if (!tool) return null;
  const reviews = REVIEWS_DATA[tool.id] || REVIEWS_DATA[1];
  const related = TOOLS.filter(t => t.area === tool.area && t.id !== tool.id).slice(0, 3);

  return (
    <div style={{ background: theme.gray50, minHeight: "100vh" }}>
      <section style={{ padding: "48px 24px", background: "#fff", borderBottom: `1px solid ${theme.gray200}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <button onClick={() => navigate("tools")} style={{
            background: "none", border: "none", color: theme.gray400, cursor: "pointer",
            fontSize: 13, marginBottom: 20, fontFamily: "'Source Sans 3', sans-serif",
          }}>← Back to Tools</button>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Badge color={tool.setup === "1 min" ? theme.emerald : "#3B82F6"}>{tool.setup} setup</Badge>
            <Badge color={theme.gray500} bg={theme.gray100} textColor={theme.gray600}>{tool.type}</Badge>
            <Badge color={theme.navyLight} bg={`${theme.navyLight}0D`} textColor={theme.navyLight}>{tool.area}</Badge>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.navy, margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>{tool.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Stars rating={tool.rating} size={18} />
            <span style={{ fontSize: 15, fontWeight: 600, color: theme.gray700 }}>{tool.rating}</span>
            <span style={{ fontSize: 14, color: theme.gray400 }}>({tool.reviews} reviews)</span>
          </div>
          <p style={{ fontSize: 20, color: theme.gray600, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>"{tool.outcome}"</p>
        </div>
      </section>

      <section style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
          {/* Description */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: `1px solid ${theme.gray200}` }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>What It Does</h2>
            <p style={{ fontSize: 15, color: theme.gray600, lineHeight: 1.7, margin: "0 0 20px" }}>{tool.description}</p>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: theme.gray400, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Key Capabilities</h3>
            <ul style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
              {tool.capabilities.map((c, i) => (
                <li key={i} style={{ fontSize: 14, color: theme.gray600, lineHeight: 1.5 }}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: `1px solid ${theme.gray200}` }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>What You'll Need</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tool.requirements.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: theme.emerald, fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14, color: theme.gray600 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Install */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: `1px solid ${theme.gray200}` }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>How to Install</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <button onClick={() => setActiveTab("1min")} style={{
                padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                background: activeTab === "1min" ? theme.emerald : theme.gray100,
                color: activeTab === "1min" ? "#fff" : theme.gray500,
                fontWeight: 600, fontSize: 13, fontFamily: "'Outfit', sans-serif",
              }}>⚡ 1-Minute Setup</button>
              <button onClick={() => setActiveTab("5min")} style={{
                padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                background: activeTab === "5min" ? "#3B82F6" : theme.gray100,
                color: activeTab === "5min" ? "#fff" : theme.gray500,
                fontWeight: 600, fontSize: 13, fontFamily: "'Outfit', sans-serif",
              }}>🔧 5-Minute Setup</button>
            </div>
            <pre style={{
              background: theme.gray800, color: "#E2E8F0", padding: 24, borderRadius: 10,
              fontSize: 13, lineHeight: 1.7, overflow: "auto", whiteSpace: "pre-wrap",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
            }}>
              {activeTab === "1min" ? tool.install1 : tool.install5}
            </pre>
            <button onClick={() => navigator.clipboard?.writeText(activeTab === "1min" ? tool.install1 : tool.install5)}
              style={{
                marginTop: 12, padding: "8px 16px", borderRadius: 6, border: `1px solid ${theme.gray300}`,
                background: "#fff", color: theme.gray600, fontSize: 13, cursor: "pointer", fontWeight: 500,
              }}>📋 Copy to Clipboard</button>
          </div>

          {/* Reviews */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: `1px solid ${theme.gray200}` }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>What Users Are Saying</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ padding: 20, borderRadius: 10, background: theme.gray50, border: `1px solid ${theme.gray200}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: theme.navy }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: theme.gray400 }}>{r.date}</span>
                  </div>
                  <Stars rating={r.rating} size={13} />
                  <p style={{ margin: "8px 0 0", fontSize: 14, color: theme.gray600, lineHeight: 1.5 }}>"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          {related.length > 0 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>Related Tools in {tool.area}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {related.map(t => <ToolCard key={t.id} tool={t} onClick={(tl) => { setSelectedTool(tl); window.scrollTo(0, 0); }} />)}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.navyLight} 0%, ${theme.navy} 100%)`,
            borderRadius: 12, padding: 32, textAlign: "center",
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>Need help setting this up?</h3>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>Our team can deploy this tool across your entire practice in days, not weeks.</p>
            <Button onClick={() => navigate("services")}>Book a Free Discovery Call</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ServicesPage = ({ navigate }) => (
  <div>
    <section style={{
      padding: "100px 24px 60px",
      background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyMid} 100%)`,
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: "#fff", marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Let Us Handle the AI Implementation</h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>You focus on your clients. We'll make AI work for your practice.</p>
        <Button size="lg" onClick={() => navigate("contact")}>Book a Free Discovery Call</Button>
      </div>
    </section>

    {/* Comparison */}
    <section style={{ padding: "60px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionHeading title="DIY AI is Risky. Guided AI is Transformative." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          <div style={{ padding: 28, borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#991B1B", marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Without LaunchPad</h3>
            {["Weeks spent researching tools", "Wasted budget on tools that don't fit", "Team resistance from bad experiences", "No measurement of ROI"].map(t => (
              <div key={t} style={{ display: "flex", gap: 8, marginBottom: 10 }}><span style={{ color: "#DC2626" }}>✗</span><span style={{ fontSize: 14, color: "#7F1D1D" }}>{t}</span></div>
            ))}
          </div>
          <div style={{ padding: 28, borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#166534", marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>With LaunchPad</h3>
            {["Curated tools matched to your workflows", "Deployed and tested within 2 weeks", "Team trained and confident", "Monthly ROI reporting"].map(t => (
              <div key={t} style={{ display: "flex", gap: 8, marginBottom: 10 }}><span style={{ color: theme.emerald }}>✓</span><span style={{ fontSize: 14, color: "#14532D" }}>{t}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section style={{ padding: "60px 24px", background: theme.gray50 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading eyebrow="Pricing" title="Choose Your Level of Support" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" }}>
          {[
            { name: "AI Readiness Audit", price: "$500", period: "one-time", desc: "Know exactly where AI fits in your practice before spending a dollar on tools.", features: ["90-minute workflow assessment", "Current tech stack review", "Prioritized AI opportunity map", "Custom implementation roadmap", "30-minute follow-up call"], cta: "Book Your Audit", popular: false },
            { name: "Starter Implementation", price: "$3,000", period: "/month", desc: "Get AI running in your highest-impact practice areas within 30 days.", features: ["Everything in AI Readiness Audit", "3–5 AI tools deployed", "Team training (up to 10 people)", "Weekly check-in calls", "90 days of support", "Slack channel for questions"], cta: "Get Started", popular: true },
            { name: "Full Transformation", price: "$7,000", period: "/month", desc: "Complete AI integration across every practice area. The white-glove experience.", features: ["Everything in Starter", "Unlimited tool deployments", "Custom workflow automation", "Monthly optimization reviews", "Dedicated implementation manager", "Quarterly ROI reporting"], cta: "Let's Talk", popular: false },
          ].map(tier => (
            <div key={tier.name} style={{
              background: "#fff", borderRadius: 12, padding: 32,
              border: tier.popular ? `2px solid ${theme.emerald}` : `1px solid ${theme.gray200}`,
              boxShadow: tier.popular ? `0 8px 30px ${theme.emerald}15` : "none",
              position: "relative",
            }}>
              {tier.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: theme.emerald, color: "#fff", padding: "4px 16px", borderRadius: 20,
                  fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                }}>Most Popular</div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{tier.name}</h3>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: theme.navy, fontFamily: "'Outfit', sans-serif" }}>{tier.price}</span>
                <span style={{ fontSize: 14, color: theme.gray400 }}>{tier.period}</span>
              </div>
              <p style={{ fontSize: 14, color: theme.gray500, lineHeight: 1.5, marginBottom: 24 }}>{tier.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8 }}>
                    <span style={{ color: theme.emerald, fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 14, color: theme.gray600 }}>{f}</span>
                  </div>
                ))}
              </div>
              <Button variant={tier.popular ? "primary" : "outline"} style={{ width: "100%" }} onClick={() => navigate("contact")}>{tier.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section style={{ padding: "60px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionHeading eyebrow="Process" title="How It Works" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {[
            ["1", "Discovery Call", "We learn about your practice, pain points, and goals. 30 minutes, no commitment."],
            ["2", "Workflow Audit", "We map your processes and identify the highest-ROI AI opportunities."],
            ["3", "Implement & Train", "We deploy the right tools, configure them, and train your team."],
            ["4", "Optimize & Scale", "Monthly reviews to measure impact and expand to new areas."],
          ].map(([n, t, d]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: theme.emerald,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
              }}>{n}</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: theme.navy, marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{t}</h4>
              <p style={{ fontSize: 13, color: theme.gray500, lineHeight: 1.5, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section style={{ padding: "60px 24px", background: theme.gray50 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionHeading title="Frequently Asked Questions" />
        {[
          ["Do I need to be technical?", "Not at all. We handle all setup and configuration. Your team just needs to know how to use the tools — and we train them on that."],
          ["What if a tool doesn't work for us?", "We swap it out. Our library has 30+ vetted alternatives. No tool is one-size-fits-all."],
          ["Can I start with the audit and decide later?", "Absolutely. The audit is standalone. No pressure to continue."],
          ["How quickly will I see results?", "Most firms see measurable time savings within the first 2 weeks of implementation."],
        ].map(([q, a]) => (
          <div key={q} style={{ marginBottom: 20, padding: 24, background: "#fff", borderRadius: 10, border: `1px solid ${theme.gray200}` }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: theme.navy, marginBottom: 8 }}>{q}</h4>
            <p style={{ fontSize: 14, color: theme.gray500, lineHeight: 1.6, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const AboutPage = ({ navigate }) => (
  <div>
    {/* Hero — big mission statement */}
    <section style={{
      padding: "120px 24px 80px", position: "relative", overflow: "hidden",
      background: `linear-gradient(160deg, #0C1220 0%, ${theme.navy} 50%, #162033 100%)`,
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${theme.emerald}08 0%, transparent 60%)` }} />
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: theme.emerald, marginBottom: 24 }}>OUR MISSION</p>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#fff", margin: "0 0 24px",
          lineHeight: 1.1, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em",
        }}>
          Close the gap between<br /><span style={{ color: theme.emerald }}>having AI</span> and <span style={{ color: theme.emerald }}>using AI.</span>
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>
          The tools exist. The talent exists. What's missing is a trusted layer that connects busy professionals with AI that actually works for their practice.
        </p>
      </div>
    </section>

    {/* The insight — big quote-style block */}
    <section style={{ padding: "72px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{
          borderLeft: `4px solid ${theme.emerald}`, paddingLeft: 28,
        }}>
          <p style={{ fontSize: 22, color: theme.navy, lineHeight: 1.6, fontWeight: 500, margin: "0 0 16px", fontFamily: "'Outfit', sans-serif" }}>
            "Every accounting firm in the world has access to AI. Almost none of them are actually using it. The problem was never the technology — it's the implementation."
          </p>
          <p style={{ fontSize: 14, color: theme.gray400, margin: 0 }}>The insight that started LaunchPad AI</p>
        </div>
      </div>
    </section>

    {/* Stats band */}
    <section style={{ padding: "48px 24px", background: theme.gray50, borderTop: `1px solid ${theme.gray200}`, borderBottom: `1px solid ${theme.gray200}` }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, textAlign: "center" }}>
        {[
          ["30+", "Tools vetted & tested"],
          ["6", "Practice areas covered"],
          ["500+", "Hours of tool research"],
          ["100%", "Human-tested, no bots"],
        ].map(([stat, label]) => (
          <div key={label}>
            <div style={{ fontSize: 36, fontWeight: 800, color: theme.navy, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>{stat}</div>
            <div style={{ fontSize: 13, color: theme.gray500, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* What we do — 3 pillars */}
    <section style={{ padding: "72px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: theme.emerald, marginBottom: 12 }}>WHAT WE DO</p>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: theme.navy, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Three things. Done exceptionally well.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            {
              icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              title: "Discover",
              desc: "We scour GitHub, product launches, and the AI builder community to find tools that solve real problems for professional services firms. Most don't make the cut.",
              stat: "1 in 10", statLabel: "tools pass our review",
            },
            {
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              title: "Verify",
              desc: "Every tool we list has been installed, tested, and evaluated against actual accounting workflows. We check reliability, ease of setup, and real-world output quality.",
              stat: "18+", statLabel: "tools live right now",
            },
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              title: "Deploy",
              desc: "We write the install guides, create the prompts, and offer hands-on implementation. Your team gets working AI without needing a single developer.",
              stat: "< 5 min", statLabel: "average time to deploy",
            },
          ].map(pillar => (
            <div key={pillar.title} style={{
              padding: 28, borderRadius: 14, border: `1px solid ${theme.gray200}`,
              background: "#fff", position: "relative", overflow: "hidden",
              transition: "box-shadow 0.25s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.06)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, marginBottom: 20,
                background: `${theme.emerald}10`, border: `1px solid ${theme.emerald}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={pillar.icon} />
                </svg>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>{pillar.title}</h3>
              <p style={{ fontSize: 14, color: theme.gray500, lineHeight: 1.6, marginBottom: 20 }}>{pillar.desc}</p>
              <div style={{ paddingTop: 16, borderTop: `1px solid ${theme.gray100}` }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: theme.navy, fontFamily: "'Outfit', sans-serif" }}>{pillar.stat}</span>
                <span style={{ display: "block", fontSize: 12, color: theme.gray400, marginTop: 2 }}>{pillar.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section style={{
      padding: "72px 24px", position: "relative", overflow: "hidden",
      background: `linear-gradient(160deg, ${theme.navy} 0%, #162033 100%)`,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: theme.emerald, marginBottom: 12 }}>OUR PRINCIPLES</p>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: 0, fontFamily: "'Outfit', sans-serif" }}>What we believe</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {[
            { title: "Curation over catalog", desc: "We'd rather list 30 tools that work than 3,000 that might. Quality is the product.", icon: "◆" },
            { title: "Outcomes over features", desc: "We don't care how a tool works technically. We care if it saves your firm 5 hours this week.", icon: "◆" },
            { title: "Honesty over hype", desc: "If a tool is overhyped, we'll tell you. If it needs improvement, we'll say so. Trust is everything.", icon: "◆" },
          ].map((val, i) => (
            <div key={val.title} style={{
              padding: 28, borderRadius: 14,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ fontSize: 16, color: theme.emerald, marginBottom: 14 }}>{val.icon}</div>
              <h4 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>{val.title}</h4>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Who it's for */}
    <section style={{ padding: "72px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: theme.emerald, marginBottom: 12 }}>WHO IT'S FOR</p>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: theme.navy, margin: "0 0 16px", fontFamily: "'Outfit', sans-serif" }}>Built for firms like yours</h2>
          <p style={{ fontSize: 16, color: theme.gray500, maxWidth: 520, margin: "0 auto" }}>LaunchPad AI is designed for professional services firms that know AI matters — but don't have the time or tech team to figure it out.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {[
            { role: "Managing Partners", desc: "Who want to modernize their practice without disrupting what's already working." },
            { role: "Practice Managers", desc: "Who are drowning in operations and need tools that save hours, not create work." },
            { role: "Forward-thinking CPAs", desc: "Who see AI as a competitive advantage and want to move before their competitors do." },
            { role: "Ops & Technology Leads", desc: "Who need vetted, secure tools they can confidently recommend to leadership." },
          ].map(persona => (
            <div key={persona.role} style={{
              display: "flex", gap: 14, padding: 20, borderRadius: 10,
              background: theme.gray50, border: `1px solid ${theme.gray200}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0, marginTop: 2,
                background: `${theme.emerald}10`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6m3-3h-6" />
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: theme.navy, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>{persona.role}</h4>
                <p style={{ fontSize: 13, color: theme.gray500, lineHeight: 1.5, margin: 0 }}>{persona.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "60px 24px", background: theme.gray50, textAlign: "center" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: theme.navy, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Ready to see what AI can do for your practice?</h2>
        <p style={{ fontSize: 15, color: theme.gray500, marginBottom: 24 }}>Browse our curated tools or talk to us about implementation.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button onClick={() => navigate("tools")}>Browse AI Tools</Button>
          <Button variant="outline" onClick={() => navigate("services")}>View Services</Button>
        </div>
      </div>
    </section>
  </div>
);

const ContactPage = ({ navigate }) => (
  <div>
    <section style={{
      padding: "100px 24px 60px",
      background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyMid} 100%)`,
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, color: "#fff", marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Let's Talk</h1>
      <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }}>Whether you have a question about a tool, want to discuss consulting, or just want to say hello.</p>
    </section>
    <section style={{ padding: "60px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>Send a Message</h2>
          {[
            { label: "Name", type: "text", placeholder: "Your name" },
            { label: "Email", type: "email", placeholder: "you@yourfirm.com" },
            { label: "Firm Name", type: "text", placeholder: "Optional" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: theme.gray600, marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} style={{
                width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${theme.gray300}`,
                fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Source Sans 3', sans-serif",
              }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: theme.gray600, marginBottom: 6 }}>Subject</label>
            <select style={{
              width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${theme.gray300}`,
              fontSize: 14, color: theme.gray600, background: "#fff",
            }}>
              <option>General Question</option>
              <option>Tool Inquiry</option>
              <option>Consulting Interest</option>
              <option>Partnership</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: theme.gray600, marginBottom: 6 }}>Message</label>
            <textarea rows={5} placeholder="How can we help?" style={{
              width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${theme.gray300}`,
              fontSize: 14, resize: "vertical", outline: "none", boxSizing: "border-box",
              fontFamily: "'Source Sans 3', sans-serif",
            }} />
          </div>
          <Button style={{ width: "100%" }}>Send Message</Button>
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>Other Ways to Reach Us</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              ["📧", "Email", "hello@launchpadai.co"],
              ["💼", "LinkedIn", "Connect with Arvind"],
              ["📅", "Book a Call", "Schedule on Calendly"],
              ["⏱", "Response Time", "Typically within 24 hours"],
            ].map(([icon, label, val]) => (
              <div key={label} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.gray400 }}>{label}</div>
                  <div style={{ fontSize: 15, color: theme.navy, fontWeight: 500 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, padding: 24, background: theme.gray50, borderRadius: 10, border: `1px solid ${theme.gray200}` }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.navy, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>Interested in consulting?</h3>
            <p style={{ fontSize: 14, color: theme.gray500, marginBottom: 16, lineHeight: 1.5 }}>Book a free 30-minute discovery call. No commitment, no pressure.</p>
            <Button variant="outline" onClick={() => navigate("services")}>View Services & Pricing</Button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const AssessmentPage = ({ navigate }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { q: "What is your firm's primary service?", options: ["Tax Preparation", "Audit & Assurance", "Bookkeeping", "Advisory/Consulting", "Multiple Services"] },
    { q: "How many people are in your firm?", options: ["1–5", "6–20", "21–50", "51–200", "200+"] },
    { q: "How would you describe your current AI usage?", options: ["Not using AI at all", "Experimenting individually", "A few tools adopted firm-wide", "AI integrated into workflows", "We have an AI strategy"] },
    { q: "What's your biggest operational bottleneck?", options: ["Document processing & data entry", "Client communication & follow-ups", "Report generation", "Compliance & research", "Staff training & onboarding"] },
  ];

  if (submitted) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: theme.gray50 }}>
      <div style={{ maxWidth: 500, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: theme.navy, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Assessment Complete!</h2>
        <p style={{ fontSize: 16, color: theme.gray500, marginBottom: 32, lineHeight: 1.6 }}>Your personalized AI Readiness Report will arrive in your inbox within 24 hours.</p>
        <Button onClick={() => navigate("tools")}>Browse Popular Tools While You Wait →</Button>
      </div>
    </div>
  );

  return (
    <div>
      <section style={{
        padding: "100px 24px 60px",
        background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyMid} 100%)`,
        textAlign: "center",
      }}>
        <Badge color={theme.gold} bg={`${theme.gold}20`} textColor={theme.gold}>Free</Badge>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: "16px 0 12px", fontFamily: "'Outfit', sans-serif" }}>AI Readiness Assessment</h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto" }}>Answer {questions.length} questions. Get a personalized AI implementation roadmap. Takes 2 minutes.</p>
      </section>
      <section style={{ padding: "60px 24px", background: theme.gray50 }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          {/* Progress */}
          <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i <= step ? theme.emerald : theme.gray200,
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: `1px solid ${theme.gray200}` }}>
            <p style={{ fontSize: 13, color: theme.gray400, marginBottom: 8 }}>Question {step + 1} of {questions.length}</p>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: theme.navy, marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>{questions[step].q}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions[step].options.map(opt => (
                <button key={opt} onClick={() => {
                  const updated = [...answers, opt];
                  setAnswers(updated);
                  if (step < questions.length - 1) setStep(step + 1);
                  else setSubmitted(true);
                }} style={{
                  padding: "14px 20px", borderRadius: 10, border: `1px solid ${theme.gray200}`,
                  background: "#fff", textAlign: "left", fontSize: 15, color: theme.gray700,
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "'Source Sans 3', sans-serif",
                }}
                  onMouseEnter={e => { e.target.style.borderColor = theme.emerald; e.target.style.background = `${theme.emerald}08`; }}
                  onMouseLeave={e => { e.target.style.borderColor = theme.gray200; e.target.style.background = "#fff"; }}
                >{opt}</button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedTool, setSelectedTool] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = (p) => { setPage(p); setMobileMenu(false); window.scrollTo(0, 0); };

  const navLinks = [
    { label: "Tools", page: "tools" },
    { label: "Services", page: "services" },
    { label: "About", page: "about" },
    { label: "Assessment", page: "assessment" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: theme.gray700, minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: "rgba(15,26,46,0.97)",
        backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div onClick={() => navigate("home")} style={{
            cursor: "pointer", fontSize: 20, fontWeight: 800, color: "#fff",
            fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em",
          }}>
            <span style={{ color: theme.emerald }}>◆</span> LaunchPad AI
          </div>
          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 24 }} className="nav-links-desktop">
              {navLinks.map(l => (
                <span key={l.page} onClick={() => navigate(l.page)} style={{
                  color: page === l.page ? theme.emerald : "rgba(255,255,255,0.6)",
                  fontSize: 14, fontWeight: 500, cursor: "pointer",
                  transition: "color 0.15s",
                }}>{l.label}</span>
              ))}
            </div>
            <Button size="sm" onClick={() => navigate("tools")}>Browse Tools</Button>
            {/* Hamburger button (mobile) */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="nav-hamburger" style={{
              display: "none", background: "none", border: "none", cursor: "pointer", padding: 4,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                {mobileMenu
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenu && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, bottom: 0,
          background: "rgba(15,26,46,0.98)", zIndex: 99,
          display: "flex", flexDirection: "column", padding: "24px",
        }}>
          {navLinks.map(l => (
            <span key={l.page} onClick={() => navigate(l.page)} style={{
              color: page === l.page ? theme.emerald : "rgba(255,255,255,0.7)",
              fontSize: 18, fontWeight: 500, cursor: "pointer",
              padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>{l.label}</span>
          ))}
          <div style={{ marginTop: 20 }}>
            <Button onClick={() => navigate("tools")} style={{ width: "100%" }}>Browse Tools</Button>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>

      {/* Pages */}
      {page === "home" && <HomePage navigate={navigate} setSelectedTool={setSelectedTool} />}
      {page === "tools" && <ToolsPage navigate={navigate} setSelectedTool={setSelectedTool} />}
      {page === "tool-detail" && <ToolDetailPage tool={selectedTool} navigate={navigate} setSelectedTool={setSelectedTool} />}
      {page === "services" && <ServicesPage navigate={navigate} />}
      {page === "about" && <AboutPage navigate={navigate} />}
      {page === "contact" && <ContactPage navigate={navigate} />}
      {page === "assessment" && <AssessmentPage navigate={navigate} />}

      {/* Footer */}
      <footer style={{
        background: theme.navy, padding: "48px 24px 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>
                <span style={{ color: theme.emerald }}>◆</span> LaunchPad AI
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                AI tools that actually work for your accounting firm. Curated by humans. Deployed in minutes.
              </p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Product</h4>
                {["Tools", "Services", "Assessment"].map(l => (
                  <p key={l} onClick={() => navigate(l.toLowerCase())} style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", cursor: "pointer", marginBottom: 8 }}>{l}</p>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Company</h4>
                {["About", "Contact"].map(l => (
                  <p key={l} onClick={() => navigate(l.toLowerCase())} style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", cursor: "pointer", marginBottom: 8 }}>{l}</p>
                ))}
              </div>
            </div>
          </div>
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20,
            display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>© 2026 LaunchPad AI. All rights reserved.</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>Built with ♥ for accounting professionals</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
