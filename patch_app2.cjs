const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Import HomeDashboard
content = content.replace(
  "import { ChatTutor } from './components/ChatTutor';",
  "import { HomeDashboard } from './components/HomeDashboard';\nimport { ChatTutor } from './components/ChatTutor';"
);

// Set default activeTab to 'home'
content = content.replace(
  "const [activeTab, setActiveTab] = useState<TabType>('chat');",
  "const [activeTab, setActiveTab] = useState<TabType>('home');"
);

// Render HomeDashboard
const homeRenderStr = `        {activeTab === 'home' && (
          <HomeDashboard onNavigate={setActiveTab} />
        )}
        {activeTab === 'chat' && (`;

content = content.replace(
  /\{\s*activeTab === 'chat' && \(/,
  homeRenderStr
);

fs.writeFileSync('src/App.tsx', content);
