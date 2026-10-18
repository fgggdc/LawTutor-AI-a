import React, { useState } from 'react';
import { Header, TabType } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { ChatTutor } from './components/ChatTutor';
import { VoiceAgent } from './components/VoiceAgent';
import { ImageDocAnalyzer } from './components/ImageDocAnalyzer';
import { SectionFinder } from './components/SectionFinder';
import { CaseBriefer } from './components/CaseBriefer';
import { MockVivaQuiz } from './components/MockVivaQuiz';
import { LegalMaximsGlossary } from './components/LegalMaximsGlossary';
import { DraftingEthics } from './components/DraftingEthics';
import { MootCourtViva } from './components/MootCourtViva';
import { InAppPDFViewer } from './components/InAppPDFViewer';
import { LawSubjectId, PDFDocumentItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedSubject, setSelectedSubject] = useState<LawSubjectId>('all');
  const [pendingChatQuery, setPendingChatQuery] = useState<string | null>(null);
  const [selectedPDFDoc, setSelectedPDFDoc] = useState<PDFDocumentItem | null>(null);

  const handleAskTutorFromOtherTab = (query: string, subjectId: LawSubjectId) => {
    setSelectedSubject(subjectId);
    setPendingChatQuery(query);
    setActiveTab('chat');
  };

  const handleOpenPDFViewer = (doc: PDFDocumentItem) => {
    setSelectedPDFDoc(doc);
    setActiveTab('pdf_viewer');
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-stone-100 flex flex-col selection:bg-amber-200 selection:text-stone-900">
      {/* Top Header & Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />

      {/* Main Tab Content Display */}
      <main className="flex-1 w-full h-full relative flex flex-col min-h-0">
                {activeTab === 'home' && (
          <HomeDashboard onNavigate={setActiveTab} />
        )}
        {activeTab === 'chat' && (
          <ChatTutor
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            onOpenVoiceTab={() => setActiveTab('voice')}
            initialPrompt={pendingChatQuery || undefined}
            onPromptConsumed={() => setPendingChatQuery(null)}
            onOpenPDFViewer={handleOpenPDFViewer}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceAgent
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            onOpenPDFViewer={handleOpenPDFViewer}
          />
        )}

        {activeTab === 'image_analyzer' && (
          <ImageDocAnalyzer onOpenPDFViewer={handleOpenPDFViewer} />
        )}

        {activeTab === 'sections' && (
          <SectionFinder onAskTutor={handleAskTutorFromOtherTab} onOpenPDFViewer={handleOpenPDFViewer} />
        )}

        {activeTab === 'case_briefer' && (
          <CaseBriefer onOpenPDFViewer={handleOpenPDFViewer} />
        )}

        {activeTab === 'drafting' && (
          <DraftingEthics onOpenPDFViewer={handleOpenPDFViewer} />
        )}

        {activeTab === 'moot_viva' && (
          <MootCourtViva onOpenPDFViewer={handleOpenPDFViewer} />
        )}

        {activeTab === 'quiz' && (
          <MockVivaQuiz />
        )}

        {activeTab === 'maxims' && (
          <LegalMaximsGlossary onAskTutor={handleAskTutorFromOtherTab} />
        )}

        {activeTab === 'pdf_viewer' && (
          <InAppPDFViewer
            initialDocument={selectedPDFDoc}
            onClose={() => setActiveTab('home')}
          />
        )}
      </main>

      
      {/* Developer Footer */}
      <div className="shrink-0 w-full z-[60] bg-stone-950 text-stone-400 text-center py-1 h-6 text-[10px] md:text-[11px] border-t border-stone-800 shadow-2xl font-semibold tracking-wide flex items-center justify-center">
        Developer By : Sohel Ahmed, LAW Student, Satkhira LAW college
      </div>

      {/* Dedicated Touch-friendly Mobile Bottom Navigation */}

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}


