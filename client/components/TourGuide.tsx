import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { X, ChevronLeft, ChevronRight, SkipForward, CheckCircle, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Star } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  fallbackSelector?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlightPadding?: number;
  arrow?: boolean;
  textContent?: string;
  category?: 'navigation' | 'action' | 'content' | 'feature';
}

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  steps: TourStep[];
  tourTitle?: string;
}

export function TourGuide({ isOpen, onClose, onComplete, steps = [], tourTitle = "SOAR-AI Tour Guide" }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Reset currentStep when steps change
  useEffect(() => {
    if (steps.length > 0 && currentStep >= steps.length) {
      setCurrentStep(0);
    }
  }, [steps, currentStep]);

  // Helper function to find element by text content
  const findElementByText = (selector: string, textContent: string): HTMLElement | null => {
    try {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        if (element.textContent?.includes(textContent)) {
          return element as HTMLElement;
        }
      }
    } catch (e) {
      console.warn('Invalid selector in findElementByText:', selector);
    }
    return null;
  };

  useEffect(() => {
    if (!isOpen || steps.length === 0) return;

    const updateTargetElement = () => {
      const step = steps[currentStep];
      if (!step) return;

      let element: HTMLElement | null = null;

      // Try text-based targeting first if textContent is provided
      if (step.textContent) {
        element = findElementByText(step.targetSelector, step.textContent);
        
        // If text-based targeting fails, try with fallback selector
        if (!element && step.fallbackSelector) {
          element = findElementByText(step.fallbackSelector, step.textContent);
        }
      }

      // Fallback to regular selector if text-based targeting didn't work
      if (!element) {
        try {
          element = document.querySelector(step.targetSelector) as HTMLElement;
        } catch (e) {
          console.warn('Invalid primary selector:', step.targetSelector);
          // Try fallback selector if provided
          if (step.fallbackSelector) {
            try {
              element = document.querySelector(step.fallbackSelector) as HTMLElement;
            } catch (fallbackError) {
              console.warn('Invalid fallback selector:', step.fallbackSelector);
            }
          }
        }
      }

      setTargetElement(element);
      
      if (element) {
        // Scroll element into view smoothly
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
        
        // Calculate tooltip position
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          const tooltipElement = tooltipRef.current;
          
          if (tooltipElement) {
            const tooltipRect = tooltipElement.getBoundingClientRect();
            let top = 0;
            let left = 0;

            switch (step.position) {
              case 'top':
                top = rect.top - tooltipRect.height - 30;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
              case 'bottom':
                top = rect.bottom + 30;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
              case 'left':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left - tooltipRect.width - 30;
                break;
              case 'right':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.right + 30;
                break;
              case 'center':
              default:
                top = window.innerHeight / 2 - tooltipRect.height / 2;
                left = window.innerWidth / 2 - tooltipRect.width / 2;
                break;
            }

            // Ensure tooltip stays within viewport
            const padding = 20;
            top = Math.max(padding, Math.min(window.innerHeight - tooltipRect.height - padding, top));
            left = Math.max(padding, Math.min(window.innerWidth - tooltipRect.width - padding, left));

            setTooltipPosition({ top, left });
          }
        }, 100);
      }
    };

    updateTargetElement();
    window.addEventListener('resize', updateTargetElement);
    window.addEventListener('scroll', updateTargetElement);

    return () => {
      window.removeEventListener('resize', updateTargetElement);
      window.removeEventListener('scroll', updateTargetElement);
    };
  }, [currentStep, isOpen, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  const getHighlightStyle = () => {
    if (!targetElement) return {};
    
    const rect = targetElement.getBoundingClientRect();
    const padding = steps[currentStep]?.highlightPadding || 12;
    
    return {
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + (padding * 2),
      height: rect.height + (padding * 2),
    };
  };

  const getSpotlightStyle = () => {
    if (!targetElement) return {};
    
    const rect = targetElement.getBoundingClientRect();
    const padding = steps[currentStep]?.highlightPadding || 12;
    
    return {
      top: rect.top - padding - 8,
      left: rect.left - padding - 8,
      width: rect.width + (padding * 2) + 16,
      height: rect.height + (padding * 2) + 16,
    };
  };

  const getCategoryColor = () => {
    const step = steps[currentStep];
    switch (step?.category) {
      case 'navigation':
        return 'bg-blue-500';
      case 'action':
        return 'bg-[#FD9646]';
      case 'content':
        return 'bg-green-500';
      case 'feature':
        return 'bg-purple-500';
      default:
        return 'bg-[#FD9646]';
    }
  };

  const getCategoryBadgeColor = () => {
    const step = steps[currentStep];
    switch (step?.category) {
      case 'navigation':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'action':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'content':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'feature':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  // Early return if tour is not open or steps are empty/invalid
  if (!isOpen || !steps || steps.length === 0) return null;

  // Ensure currentStep is within bounds
  const safeCurrentStep = Math.max(0, Math.min(currentStep, steps.length - 1));
  const currentStepData = steps[safeCurrentStep];
  
  // Additional safety check
  if (!currentStepData) return null;

  const progress = ((safeCurrentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Spotlight Overlay - Creates a clear cutout for the highlighted element */}
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <mask id="spotlight-mask">
              {/* White background covers everything */}
              <rect width="100%" height="100%" fill="white" />
              {/* Black cutout creates transparent area for highlighted element */}
              {targetElement && (
                <rect
                  x={getSpotlightStyle().left}
                  y={getSpotlightStyle().top}
                  width={getSpotlightStyle().width}
                  height={getSpotlightStyle().height}
                  rx="16"
                  ry="16"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          
          {/* Dimmed overlay with spotlight cutout */}
          <rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      </div>

      {/* Enhanced Highlighted Element Border - Only visible border, no background */}
      {targetElement && (
        <>
          {/* Outer Glow Ring */}
          <div
            className="absolute pointer-events-none rounded-xl"
            style={{
              ...getHighlightStyle(),
              boxShadow: '0 0 0 3px rgba(253, 150, 70, 0.4), 0 0 30px rgba(253, 150, 70, 0.3)',
              border: 'none',
              background: 'transparent',
            }}
          />
          
          {/* Main Highlight Border */}
          <div
            className="absolute pointer-events-none border-3 border-[#FD9646] rounded-xl bg-transparent"
            style={{
              ...getHighlightStyle(),
              animation: 'pulse 2s infinite',
            }}
          />
          
          {/* Corner Accent Indicators */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: getHighlightStyle().top - 8,
              left: getHighlightStyle().left - 8,
            }}
          >
            <div className="w-4 h-4 bg-[#FD9646] rounded-full shadow-lg animate-ping opacity-75" />
            <div className="absolute top-0 left-0 w-4 h-4 bg-[#FD9646] rounded-full shadow-lg" />
          </div>
          
          {/* Additional corner indicators for better visibility */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: getHighlightStyle().top - 8,
              left: getHighlightStyle().left + getHighlightStyle().width - 8,
            }}
          >
            <div className="w-4 h-4 bg-[#FD9646] rounded-full shadow-lg animate-ping opacity-75" />
            <div className="absolute top-0 left-0 w-4 h-4 bg-[#FD9646] rounded-full shadow-lg" />
          </div>
        </>
      )}



      {/* Enhanced Tooltip/Modal Box */}
      <div
        ref={tooltipRef}
        className="absolute z-10 animate-in fade-in-0 zoom-in-95 duration-500"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <Card className="w-80 md:w-[420px] shadow-2xl border-2 border-gray-100 bg-white">
          <CardHeader className="pb-4 relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Header Content */}
            <div className="space-y-4 pr-8">
              {/* Tour Title & Step Counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#FD9646]" />
                  <span className="font-semibold text-gray-600 text-sm">{tourTitle}</span>
                </div>
                <Badge variant="outline" className={getCategoryBadgeColor()}>
                  Step {safeCurrentStep + 1} of {steps.length}
                </Badge>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">Progress</span>
                  <span className="text-xs font-medium text-[#FD9646]">{Math.round(progress)}%</span>
                </div>
                <div className="relative">
                  <Progress value={progress} className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FD9646] via-[#FD9646] to-[#FD9646]/80 rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </Progress>
                </div>
              </div>
              
              {/* Step Title with Category Icon */}
              <CardTitle className="flex items-center gap-3 text-lg pr-4">
                <div className={`w-10 h-10 rounded-xl ${getCategoryColor()} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-sm">{safeCurrentStep + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 font-semibold leading-tight">{currentStepData.title}</div>
                  {currentStepData.category && (
                    <div className="text-xs text-gray-500 capitalize mt-1">{currentStepData.category} Guide</div>
                  )}
                </div>
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Enhanced Description */}
            <div className="space-y-3">
              <CardDescription className="text-gray-700 leading-relaxed text-base">
                {currentStepData.description}
              </CardDescription>
              
              {/* Additional Context Based on Category */}
              {currentStepData.category && (
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border-l-4 border-[#FD9646]">
                  <strong>💡 Tip:</strong> {
                    currentStepData.category === 'navigation' ? 'Use this area to move between different sections of SOAR-AI.' :
                    currentStepData.category === 'action' ? 'Click here to perform important actions and operations.' :
                    currentStepData.category === 'content' ? 'This area displays key information and data for your review.' :
                    currentStepData.category === 'feature' ? 'This is a powerful feature that can help streamline your workflow.' :
                    'This element is an important part of the SOAR-AI interface.'
                  }
                </div>
              )}
            </div>
            
            {/* Enhanced Navigation Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={safeCurrentStep === 0}
                  className="flex items-center gap-2 hover:border-[#FD9646] hover:text-[#FD9646] transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Tour
                </Button>
              </div>
              
              <Button
                onClick={handleNext}
                className="bg-[#FD9646] hover:bg-[#FD9646]/90 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {safeCurrentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Complete Tour
                  </>
                ) : (
                  <>
                    Next Step
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom CSS for pulse animation */}
      <style jsx="true">{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}

// Comprehensive tour steps with separate AI Chatbot and Quick Summary steps
export const defaultTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SOAR-AI Corporate Intelligence Hub',
    description: 'Welcome to your comprehensive Corporate Intelligence Platform! This guided tour will walk you through every important feature, button, tab, and action area in SOAR-AI. By the end, you\'ll be fully equipped to manage airline contracts, leads, and customer support efficiently.',
    targetSelector: 'body',
    position: 'center',
    highlightPadding: 0,
    arrow: false,
    category: 'feature'
  },
  {
    id: 'sidebar-navigation',
    title: 'Main Navigation Sidebar',
    description: 'This is your primary navigation hub. The sidebar contains all major modules organized into collapsible groups: COINHUB (lead management), CONTRAQ (contracts), CONVOY (support), and more. Each group can be expanded or collapsed by clicking the group headers.',
    targetSelector: '[data-sidebar]',
    fallbackSelector: 'aside',
    position: 'right',
    highlightPadding: 10,
    arrow: true,
    category: 'navigation'
  },
  {
    id: 'group-collapse-expand',
    title: 'Group Collapse/Expand Controls',
    description: 'Click on any group header (like "COINHUB" or "CONTRAQ") to collapse or expand that section. This helps you focus on specific modules and reduces visual clutter. The chevron icons indicate whether a group is expanded or collapsed.',
    targetSelector: '[data-slot="sidebar-group-label"]',
    textContent: 'COINHUB',
    fallbackSelector: '[data-sidebar] .cursor-pointer',
    position: 'right',
    highlightPadding: 8,
    arrow: true,
    category: 'action'
  },
  {
    id: 'ai-assistant-menu',
    title: 'AI Assistant - Your Intelligent Helper',
    description: 'Your AI Assistant is the heart of SOAR-AI. Click here to access natural language queries, get intelligent recommendations, and receive personalized insights about your corporate travel management. This is often your first stop for any questions.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'AI Assistant',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]:first-child',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'dashboard-menu',
    title: 'Dashboard - System Overview',
    description: 'The Dashboard provides a comprehensive view of all your key metrics, including contract performance, vendor rankings, revenue predictions, and AI-powered recommendations. It\'s your command center for monitoring overall system health and performance.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Dashboard',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]:nth-child(2)',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'coinhub-section',
    title: 'COINHUB - Lead Management Hub',
    description: 'COINHUB is your comprehensive lead management system. It includes Corporate Search, Lead Dashboard, qualified/unqualified leads tracking, email campaigns, and opportunities management. This entire section is dedicated to finding, qualifying, and converting corporate clients.',
    targetSelector: '[data-slot="sidebar-group-label"]',
    textContent: 'COINHUB',
    fallbackSelector: '[data-sidebar] span',
    position: 'right',
    highlightPadding: 10,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'corporate-search-menu',
    title: 'Corporate Search - AI-Powered Client Discovery',
    description: 'Use Corporate Search to find and discover potential corporate clients using AI-powered search capabilities. This tool helps you identify new business opportunities and build your prospect database with intelligent filtering and matching.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Corporate Search',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'action'
  },
  {
    id: 'lead-dashboard-menu',
    title: 'Lead Dashboard - Pipeline Overview',
    description: 'The Lead Dashboard provides a comprehensive overview of your lead pipeline with visual charts, conversion rates, and performance metrics. Monitor your lead generation progress and identify opportunities for improvement.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Lead Dashboard',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'all-leads-menu',
    title: 'All Leads - Complete Lead Management',
    description: 'View and manage all your leads in one centralized location. This comprehensive list includes qualification status, contact information, and next action suggestions for each lead in your pipeline.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'All Leads',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'qualified-leads-menu',
    title: 'Qualified Leads - High-Potential Prospects',
    description: 'Focus on your most promising leads that have been qualified and are ready for conversion. These leads have shown strong interest and meet your ideal customer profile criteria.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Qualified Leads',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'unqualified-leads-menu',
    title: 'Unqualified Leads - Nurturing Opportunities',
    description: 'Manage leads that need further nurturing and qualification. Use this section to implement nurturing campaigns and gradually move prospects through your qualification process.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Unqualified Leads',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'email-campaigns-menu',
    title: 'Email Campaigns - Automated Outreach',
    description: 'Create and manage automated email campaigns for lead nurturing and client engagement. Set up drip campaigns, track open rates, and automate your marketing outreach to corporate prospects.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Email Campaigns',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'action'
  },
  {
    id: 'opportunities-menu',
    title: 'Opportunities - Sales Pipeline Tracking',
    description: 'Track and manage sales opportunities with deal progression, forecasting, and revenue predictions. Monitor your sales pipeline and identify bottlenecks in your conversion process.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Opportunities',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'cocast-section',
    title: 'COCAST - Corporate Commercial Analytics',
    description: 'COCAST provides advanced analytics and sales trend analysis for corporate commercial activities. This section focuses on data-driven insights for revenue optimization and market intelligence.',
    targetSelector: '[data-slot="sidebar-group-label"]',
    textContent: 'COCAST',
    fallbackSelector: '[data-sidebar] span',
    position: 'right',
    highlightPadding: 10,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'revenue-prediction-menu',
    title: 'Revenue Prediction - AI-Powered Forecasting',
    description: 'Use AI-powered algorithms to predict future revenue based on your current pipeline, historical data, and market trends. Make data-driven decisions for business planning and resource allocation.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Revenue Prediction',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'contraq-section',
    title: 'CONTRAQ - Contract Management System',
    description: 'CONTRAQ handles all contract-related operations including contract lifecycle management, breach monitoring, and risk assessment. This is where you manage agreements, track compliance, and monitor contract performance.',
    targetSelector: '[data-slot="sidebar-group-label"]',
    textContent: 'CONTRAQ',
    fallbackSelector: '[data-sidebar] span',
    position: 'right',
    highlightPadding: 10,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'contracts-menu',
    title: 'Contracts - Agreement Management',
    description: 'Manage all your contracts from creation to completion. Track contract status, renewal dates, terms, and conditions. Ensure compliance and optimize contract performance.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Contracts',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'risk-monitoring-menu',
    title: 'Risk Monitoring - Contract Compliance',
    description: 'Monitor contract compliance and identify potential risks or breaches. Get alerts for important deadlines, renewal dates, and compliance issues to prevent costly oversights.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Risk Monitoring',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'travel-offers-section',
    title: 'Travel Offers - Offer Management',
    description: 'Create, manage, and track travel offers with comprehensive analytics and ATPCO integration. Design competitive offers and monitor their performance in the marketplace.',
    targetSelector: '[data-slot="sidebar-group-label"]',
    textContent: 'Travel Offers',
    fallbackSelector: '[data-sidebar] span',
    position: 'right',
    highlightPadding: 10,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'travel-offers-menu',
    title: 'Travel Offers - Comprehensive Offer Creation',
    description: 'Design and manage travel offers with advanced analytics, pricing strategies, and market positioning. Create competitive offers that maximize revenue and market share.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Travel Offers',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'action'
  },
  {
    id: 'convoy-section',
    title: 'CONVOY - Customer Support System',
    description: 'CONVOY is your customer support and service management hub. It includes agent dashboards, ticket management, and admin controls for providing excellent customer service and support operations.',
    targetSelector: '[data-slot="sidebar-group-label"]',
    textContent: 'CONVOY',
    fallbackSelector: '[data-sidebar] span',
    position: 'right',
    highlightPadding: 10,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'agent-dashboard-menu',
    title: 'Agent Dashboard - Support Agent Workspace',
    description: 'The agent dashboard provides customer support representatives with all the tools they need to efficiently handle customer inquiries, track performance metrics, and manage their workload.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Agent Dashboard',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'support-tickets-menu',
    title: 'Support Tickets - Customer Service Management',
    description: 'View, manage, and resolve customer support tickets. Track ticket status, assign priorities, and ensure timely resolution of customer issues for optimal satisfaction.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Support Tickets',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'admin-dashboard-menu',
    title: 'Admin Dashboard - System Administration',
    description: 'Comprehensive system administration tools for managing user accounts, system settings, performance monitoring, and overall platform configuration.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Admin Dashboard',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'content'
  },
  {
    id: 'system-section',
    title: 'System - Platform Configuration',
    description: 'System-level settings and configuration options for platform administration, user management, and system optimization.',
    targetSelector: '[data-slot="sidebar-group-label"]',
    textContent: 'System',
    fallbackSelector: '[data-sidebar] span',
    position: 'right',
    highlightPadding: 10,
    arrow: true,
    category: 'navigation'
  },
  {
    id: 'settings-menu',
    title: 'Settings - System Configuration',
    description: 'Access system settings for user preferences, account management, notification settings, and platform configuration options.',
    targetSelector: '[data-sidebar] [role="menuitem"]',
    textContent: 'Settings',
    fallbackSelector: '[data-sidebar] button[role="menuitem"]',
    position: 'right',
    highlightPadding: 6,
    arrow: true,
    category: 'action'
  },
  {
    id: 'ai-chatbot-interface',
    title: 'AI Chatbot - Conversational Intelligence',
    description: 'This is your intelligent conversational interface where you interact directly with the AI Assistant. Type questions, receive detailed responses, and engage in natural language conversations about your business operations. The chatbot understands context and provides personalized assistance.',
    targetSelector: '.ai-chatbot, .chat-interface, [data-chatbot], .conversation-area',
    fallbackSelector: '.chat-container .chat-interface, main .chat-interface',
    position: 'left',
    highlightPadding: 12,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'quick-summary-section',
    title: 'Quick Summary - At-a-Glance Insights',
    description: 'The Quick Summary section provides instant overviews of your key business metrics, recent activities, and important updates. Get a snapshot of your performance, pending tasks, and critical information without navigating through multiple pages.',
    targetSelector: '.quick-summary, [data-summary], .summary-panel, .overview-section',
    fallbackSelector: '.summary-container, [class*="summary"]',
    position: 'top',
    highlightPadding: 10,
    arrow: true,
    category: 'content'
  },
  {
    id: 'quick-actions-header',
    title: 'Quick Actions - Instant Access Tools',
    description: 'Access quick actions and frequently used tools from the header area. These quick action buttons provide instant access to common operations like creating new leads, sending emails, generating reports, and performing bulk actions without navigating through multiple menus.',
    targetSelector: '.quick-actions, [data-quick-actions], .action-buttons, header .gap-3',
    fallbackSelector: 'header .flex.items-center.gap-3, header button',
    position: 'bottom',
    highlightPadding: 8,
    arrow: true,
    category: 'action'
  },
  {
    id: 'quick-suggestions-panel',
    title: 'Quick Suggestions - Smart Recommendations',
    description: 'The Quick Suggestions panel provides AI-powered recommendations and shortcuts based on your current context and frequently used actions. These intelligent suggestions help you work more efficiently by predicting your next likely actions.',
    targetSelector: '.quick-suggestions, [data-quick-suggestions], .suggestions-panel, .recommended-actions',
    fallbackSelector: '.suggestions, .recommendations, [class*="suggestion"]',
    position: 'left',
    highlightPadding: 10,
    arrow: true,
    category: 'feature'
  },
  {
    id: 'chatbot-quick-suggestions',
    title: 'Chatbot Quick Suggestions - Conversation Helpers',
    description: 'These quick suggestion buttons appear within or beside the chat interface to help you quickly ask common questions or perform frequent actions. Click on any suggestion to instantly send that query to the AI Assistant without typing.',
    targetSelector: '.chat-suggestions, .chat-quick-actions, [data-chat-suggestions], .message-suggestions',
    fallbackSelector: '.chat-container .suggestions, [class*="chat"] .quick, .chat-interface [class*="suggestion"]',
    position: 'top',
    highlightPadding: 8,
    arrow: true,
    category: 'action'
  },
  {
    id: 'tour-complete',
    title: 'Tour Complete - You\'re Ready to Go!',
    description: 'Congratulations! You\'ve completed the comprehensive SOAR-AI tour covering all menu items, quick actions, AI chatbot, quick summary, and suggestion features. You now understand every aspect of the platform. Remember, you can always access this tour again using the Tour Guide button in the header. Start exploring and make the most of your Corporate Intelligence Hub!',
    targetSelector: 'body',
    position: 'center',
    highlightPadding: 0,
    arrow: false,
    category: 'feature'
  }
];

// Specialized tour for AI Assistant interface
export const aiAssistantTourSteps: TourStep[] = [
  {
    id: 'ai-welcome',
    title: 'AI Assistant Interface Tour',
    description: 'Let\'s explore the AI Assistant interface and learn how to use every button, tab, and interactive element for maximum productivity.',
    targetSelector: 'body',
    position: 'center',
    category: 'feature'
  },
  {
    id: 'ai-chat-input',
    title: 'Chat Input Area',
    description: 'This is where you type your questions and requests to the AI. You can ask about contracts, leads, analytics, or get recommendations. The input area automatically expands as you type longer queries.',
    targetSelector: 'textarea',
    fallbackSelector: 'input[type="text"]',
    position: 'top',
    highlightPadding: 8,
    arrow: true,
    category: 'action'
  },
  {
    id: 'ai-send-button',
    title: 'Send Message Button',
    description: 'Click this button to send your message to the AI Assistant. You can also press Enter to send your message. The button becomes active (highlighted) when you have text in the input area.',
    targetSelector: 'button[type="submit"]',
    fallbackSelector: 'button',
    textContent: 'Send',
    position: 'left',
    highlightPadding: 6,
    arrow: true,
    category: 'action'
  }
];

// Quick action tour for Dashboard
export const dashboardTourSteps: TourStep[] = [
  {
    id: 'dashboard-cards',
    title: 'Dashboard Information Cards',
    description: 'These cards display key metrics and summaries. Each card is clickable and provides detailed information about different aspects of your business like contracts, leads, and performance metrics.',
    targetSelector: '.card',
    fallbackSelector: '[class*="card"]',
    position: 'top',
    highlightPadding: 8,
    arrow: true,
    category: 'content'
  },
  {
    id: 'dashboard-charts',
    title: 'Interactive Charts & Analytics',
    description: 'Charts and graphs provide visual insights into your business performance. Hover over data points for detailed information, and click on legend items to filter data views.',
    targetSelector: '.recharts-wrapper',
    fallbackSelector: 'svg',
    position: 'bottom',
    highlightPadding: 10,
    arrow: true,
    category: 'content'
  }
];