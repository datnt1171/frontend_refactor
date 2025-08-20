'use client'
import React, { useState, useEffect, useRef } from 'react';

interface WorkerConfig {
  x: number;
  y: number;
  rotation: number;
}

interface StepInputs {
  [key: string]: string;
}

const FurnitureCoatingBlueprint: React.FC = () => {
  const [stepInputs, setStepInputs] = useState<StepInputs>({});
  const [svgContent, setSvgContent] = useState<string>('');
  const [workerConfig, setWorkerConfig] = useState<Record<string, WorkerConfig>>({});
  const [availableSvgs] = useState<string[]>(['blueprint1.svg','blueprint2.svg','TBD2.svg','CT5.svg','CT6.svg','CT56.svg','TBD3.svg']);
  const [selectedSvg, setSelectedSvg] = useState<string>('blueprint2.svg');
  const [hideUnselected, setHideUnselected] = useState<boolean>(false);
  const [svgDimensions, setSvgDimensions] = useState<{width: number, height: number}>({width: 0, height: 0});
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const stepOptions: string[] = [
    'Sanding',
    'Priming',
    'Base Coating',
    'Color Application',
    'Clear Coating',
    'Drying/Curing',
    'Quality Check',
    'Polishing',
    'Assembly',
    'Final Inspection'
  ];

  // Extract SVG dimensions from viewBox or width/height attributes
  const extractSvgDimensions = (svgText: string): {width: number, height: number} => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (svgElement) {
      // Try viewBox first
      const viewBox = svgElement.getAttribute('viewBox');
      if (viewBox) {
        const [, , width, height] = viewBox.split(' ').map(Number);
        return { width: width ?? 800, height: height ?? 600 };
      }
      
      // Fall back to width/height attributes
      const width = parseFloat(svgElement.getAttribute('width') || '800');
      const height = parseFloat(svgElement.getAttribute('height') || '600');
      return { width, height };
    }
    
    return { width: 800, height: 600 };
  };

  // Parse transform string to extract rotation
  const parseTransform = (transform: string): number => {
    if (!transform) return 0;
    
    const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
    if (rotateMatch) {
      const params = rotateMatch[1]?.split(',').map(p => parseFloat(p.trim())) || [];
      return params[0] || 0;
    }
    return 0;
  };

  // Extract worker configurations from SVG by finding elements with worker IDs
  const extractWorkerConfig = (svgText: string): { config: Record<string, WorkerConfig>, ids: string[] } => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    const extractedWorkers: Record<string, WorkerConfig> = {};
    const extractedIds: string[] = [];
    
    const allElements = svgDoc.querySelectorAll('[data-cell-id^="spot-"]');
    const regularIdElements = svgDoc.querySelectorAll('[id^="spot-"]');
    const elementsToProcess = [...Array.from(allElements), ...Array.from(regularIdElements)];

    elementsToProcess.forEach((element) => {
      const workerId = element.getAttribute('data-cell-id') || element.id;
      let shapeElement = element.querySelector('rect, circle, ellipse, polygon, path');
      
      if (!shapeElement && (element.tagName === 'rect' || element.tagName === 'circle' || element.tagName === 'ellipse')) {
        shapeElement = element;
      }
      
      if (shapeElement) {
        let x = 0, y = 0, width = 0, height = 0;
        
        if (shapeElement.tagName === 'rect') {
          x = parseFloat(shapeElement.getAttribute('x') || '0');
          y = parseFloat(shapeElement.getAttribute('y') || '0');
          width = parseFloat(shapeElement.getAttribute('width') || '0');
          height = parseFloat(shapeElement.getAttribute('height') || '0');
        } else if (shapeElement.tagName === 'circle') {
          const cx = parseFloat(shapeElement.getAttribute('cx') || '0');
          const cy = parseFloat(shapeElement.getAttribute('cy') || '0');
          const r = parseFloat(shapeElement.getAttribute('r') || '0');
          x = cx - r;
          y = cy - r;
          width = r * 2;
          height = r * 2;
        }
        
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        const elementTransform = shapeElement.getAttribute('transform') || '';
        const parentTransform = element.getAttribute('transform') || '';
        const combinedTransform = elementTransform + ' ' + parentTransform;
        const rotation = parseTransform(combinedTransform);
        
        extractedWorkers[workerId] = {
          x: centerX,
          y: centerY,
          rotation: rotation,
        };
        extractedIds.push(workerId);
      }
    });

    extractedIds.sort((a, b) => {
      const aNum = parseInt(a.replace('spot-', ''));
      const bNum = parseInt(b.replace('spot-', ''));
      return aNum - bNum;
    });

    return { config: extractedWorkers, ids: extractedIds };
  };

  // Load SVG and extract worker configurations
  const loadSvg = async (svgFileName: string): Promise<void> => {
    try {
      const response = await fetch(`/${svgFileName}`);
      const svgText = await response.text();
      setSvgContent(svgText);
      
      // Extract dimensions
      const dimensions = extractSvgDimensions(svgText);
      setSvgDimensions(dimensions);
      
      const { config, ids } = extractWorkerConfig(svgText);
      setWorkerConfig(config);
      
      const initialInputs: StepInputs = {};
      ids.forEach(workerId => {
        initialInputs[workerId] = '';
      });
      setStepInputs(initialInputs);
      
    } catch (error) {
      console.error('Failed to load SVG:', error);
    }
  };

  useEffect(() => {
    loadSvg(selectedSvg);
  }, [selectedSvg]);

  // Update SVG with responsive viewBox and text inputs
  const updateSvgWithText = (): string => {
    if (!svgContent) return '';

    let updatedSvg = svgContent;
    
    // Ensure SVG is responsive by setting viewBox and removing fixed dimensions
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(updatedSvg, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (svgElement) {
      // Set responsive attributes
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      // Ensure viewBox exists
      if (!svgElement.getAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${svgDimensions.width} ${svgDimensions.height}`);
      }
      
      updatedSvg = new XMLSerializer().serializeToString(svgDoc);
    }
    
    // Remove existing text elements
    updatedSvg = updatedSvg.replace(/<text[^>]*data-spot-label="true"[^>]*>.*?<\/text>/g, '');
    
    // Handle hiding unselected workers
    if (hideUnselected) {
      Object.keys(workerConfig).forEach((workerId) => {
        const hasText = stepInputs[workerId] && stepInputs[workerId].trim() !== '';
        
        if (!hasText) {
          const workerGroupRegex = new RegExp(`(<g[^>]*data-cell-id="${workerId}"[^>]*)(>)`, 'g');
          updatedSvg = updatedSvg.replace(workerGroupRegex, '$1 style="opacity:0.2"$2');
        }
      });
    }
    
    // Add text elements
    Object.entries(stepInputs).forEach(([workerId, stepName]) => {
      if (stepName.trim() && workerConfig[workerId]) {
        const config = workerConfig[workerId];
        const textElement = `<text x="${config.x}" y="${config.y + 4}" fill="black" font-size="12" font-weight="bold" text-anchor="middle" transform="rotate(${config.rotation},${config.x},${config.y})" data-spot-label="true">${stepName}</text>`;
        updatedSvg = updatedSvg.replace('</svg>', `${textElement}</svg>`);
      }
    });
    
    return updatedSvg;
  };

  const handleInputChange = (workerId: string, value: string): void => {
    setStepInputs(prev => ({
      ...prev,
      [workerId]: value
    }));
  };

  const clearAll = (): void => {
    const clearedInputs: StepInputs = {};
    Object.keys(stepInputs).forEach(workerId => {
      clearedInputs[workerId] = '';
    });
    setStepInputs(clearedInputs);
  };

  const toggleHideUnselected = (): void => {
    setHideUnselected(prev => !prev);
  };

  const handlePrint = (): void => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const svgToPrint = updateSvgWithText();
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Furniture Coating Blueprint</title>
          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .blueprint-container {
              text-align: center;
            }
            .blueprint-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .blueprint-svg {
              border: 1px solid #ccc;
              background: #f9f9f9;
              width: 100%;
              max-width: 100%;
            }
            @media print {
              body { margin: 0; }
              .blueprint-container { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="blueprint-container">
            <div class="blueprint-title">Furniture Coating Blueprint - ${selectedSvg}</div>
            <div class="blueprint-svg">${svgToPrint}</div>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleSvgChange = (newSvg: string): void => {
    setSelectedSvg(newSvg);
  };

  // Determine if SVG is landscape or portrait
  const isLandscape = svgDimensions.width > svgDimensions.height;
  const aspectRatio = svgDimensions.width / svgDimensions.height;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4 p-4">
      {/* Control Panel - Smaller and collapsible */}
      <div className="lg:w-80 w-full flex-shrink-0">
        <div className="bg-white rounded-lg shadow-lg p-4 h-fit">
          <h1 className="text-lg font-bold mb-4 text-center">Blueprint Control</h1>
          
          <div className="mb-4">
            <label className="block font-medium mb-2 text-sm">Blueprint:</label>
            <select
              value={selectedSvg}
              onChange={(e) => handleSvgChange(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableSvgs.map(svg => (
                <option key={svg} value={svg}>{svg}</option>
              ))}
            </select>
          </div>

          <h2 className="text-md font-semibold mb-3">Step Assignment</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.keys(stepInputs).sort((a, b) => {
              const aNum = parseInt(a.replace('spot-', ''));
              const bNum = parseInt(b.replace('spot-', ''));
              return aNum - bNum;
            }).map((workerId) => (
              <div key={workerId} className="flex items-center space-x-2">
                <label className="w-16 text-xs font-medium">
                  {workerId.replace('spot-', 'S')}:
                </label>
                <select
                  value={stepInputs[workerId]}
                  onChange={(e) => handleInputChange(workerId, e.target.value)}
                  className="flex-1 p-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Step</option>
                  {stepOptions.map(step => (
                    <option key={step} value={step}>{step}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="flex-1 px-3 py-2 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Clear All
              </button>
              
              <button
                onClick={handlePrint}
                className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Print
              </button>
            </div>
            
            <button
              onClick={toggleHideUnselected}
              className={`w-full px-3 py-2 text-xs rounded transition-colors ${
                hideUnselected 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {hideUnselected ? 'Show All' : 'Hide Unassigned'}
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint Display - Takes remaining space */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-semibold">Blueprint Preview</h2>
            <div className="text-sm text-gray-500">
              {svgDimensions.width} × {svgDimensions.height} 
              ({isLandscape ? 'Landscape' : 'Portrait'})
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-2">
            <div 
              ref={svgContainerRef}
              className="border border-gray-300 rounded bg-gray-50 shadow-sm"
              style={{
                width: isLandscape ? 'auto' : '100%',
                height: isLandscape ? '100%' : 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: aspectRatio > 0 ? `${svgDimensions.width}/${svgDimensions.height}` : '1'
              }}
            >
              <div 
                className="w-full h-full p-2"
                dangerouslySetInnerHTML={{ __html: updateSvgWithText() }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureCoatingBlueprint;